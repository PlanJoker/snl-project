import type { VEvent } from "@/app/types/calendarType";
import { RRule, RRuleSet } from "rrule";

/**
 * Parse ICS file content into VEvent array.
 * Supports:
 *  - VEVENT with DTSTART, DTEND, SUMMARY, LOCATION, DESCRIPTION
 *  - RRULE (recurring events) via rrule.js
 *  - EXDATE (exception dates for recurring events)
 *  - DURATION property
 *  - All-day events (DATE format)
 *  - UTC and local datetime formats
 *
 * Recurring events are expanded up to 1 year from today.
 */
export function parseICS(content: string): VEvent[] {
  const events: VEvent[] = [];

  // Normalize line endings and unfold continuation lines
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const unfolded: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  }

  // Raw event structure before expansion
  type RawEvent = {
    summary?: string;
    dtstart?: string;
    dtstartParams?: string;
    dtend?: string;
    dtendParams?: string;
    duration?: string;
    rrule?: string;
    exdates?: string[];
    location?: string;
    description?: string;
    uid?: string;
  };

  const rawEvents: RawEvent[] = [];
  let inEvent = false;
  let current: RawEvent = {};

  for (const line of unfolded) {
    const trimmed = line.trim();
    if (trimmed === "BEGIN:VEVENT") {
      inEvent = true;
      current = { exdates: [] };
      continue;
    }
    if (trimmed === "END:VEVENT") {
      inEvent = false;
      rawEvents.push(current);
      continue;
    }
    if (!inEvent) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const propFull = trimmed.substring(0, colonIdx);
    const value = trimmed.substring(colonIdx + 1);
    const semiIdx = propFull.indexOf(";");
    const propName = (semiIdx !== -1 ? propFull.substring(0, semiIdx) : propFull).toUpperCase();
    const propParams = semiIdx !== -1 ? propFull.substring(semiIdx + 1) : "";

    switch (propName) {
      case "SUMMARY":
        current.summary = decodeICSText(value);
        break;
      case "DTSTART":
        current.dtstart = value;
        current.dtstartParams = propParams;
        break;
      case "DTEND":
        current.dtend = value;
        current.dtendParams = propParams;
        break;
      case "DURATION":
        current.duration = value;
        break;
      case "RRULE":
        current.rrule = value;
        break;
      case "EXDATE":
        current.exdates = current.exdates || [];
        value.split(",").forEach((d) => current.exdates!.push(d.trim()));
        break;
      case "LOCATION":
        current.location = decodeICSText(value);
        break;
      case "DESCRIPTION":
        current.description = decodeICSText(value);
        break;
      case "UID":
        current.uid = value;
        break;
    }
  }

  // Expand raw events into VEvent instances
  let eventId = 1;
  const rangeStart = new Date();
  rangeStart.setHours(0, 0, 0, 0);
  // Go back 3 months to also show recent past events
  rangeStart.setMonth(rangeStart.getMonth() - 3);
  const rangeEnd = new Date();
  rangeEnd.setFullYear(rangeEnd.getFullYear() + 1);

  for (const raw of rawEvents) {
    if (!raw.summary || !raw.dtstart) continue;

    const { date: startDate, allDay } = parseICSDate(raw.dtstart, raw.dtstartParams || "");
    let endDate: Date;

    if (raw.dtend) {
      endDate = parseICSDate(raw.dtend, raw.dtendParams || "").date;
    } else if (raw.duration) {
      endDate = new Date(startDate.getTime() + parseDuration(raw.duration));
    } else {
      endDate = allDay
        ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    const durationMs = Math.max(0, endDate.getTime() - startDate.getTime());

    const makeVEvent = (start: Date): VEvent => ({
      title: raw.summary!,
      start,
      end: new Date(start.getTime() + durationMs),
      allDay,
      resource: {
        id: eventId++,
        location: raw.location || "",
        description: raw.description || "",
        uid: raw.uid || "",
        isRecurring: !!raw.rrule,
      },
    });

    if (!raw.rrule) {
      // Non-recurring event
      events.push(makeVEvent(startDate));
    } else {
      // Recurring event — expand with rrule.js
      try {
        const rruleSet = new RRuleSet();

        // Build RRULE string with DTSTART
        const dtStartStr = formatDateForRRule(startDate, allDay);
        const rruleStr = `DTSTART:${dtStartStr}\nRRULE:${raw.rrule}`;
        const rule = RRule.fromString(rruleStr);
        rruleSet.rrule(rule);

        // Add EXDATE exceptions
        if (raw.exdates && raw.exdates.length > 0) {
          for (const exStr of raw.exdates) {
            try {
              const exDate = parseICSDate(exStr.replace(/;.*?:/, ":").split(":").pop() || exStr, "").date;
              rruleSet.exdate(exDate);
            } catch {
              // ignore malformed EXDATE
            }
          }
        }

        // Expand occurrences within range
        const occurrences = rruleSet.between(rangeStart, rangeEnd, true);

        for (const occ of occurrences) {
          // rrule.js returns dates in UTC when DTSTART has no timezone
          // We need to convert back to local time
          const localOcc = new Date(
            occ.getUTCFullYear(),
            occ.getUTCMonth(),
            occ.getUTCDate(),
            allDay ? 0 : occ.getUTCHours(),
            allDay ? 0 : occ.getUTCMinutes(),
            allDay ? 0 : occ.getUTCSeconds()
          );
          events.push(makeVEvent(localOcc));
        }

        // If no occurrences found in range, include original start if valid
        if (occurrences.length === 0) {
          events.push(makeVEvent(startDate));
        }
      } catch (e) {
        // Fallback: add original event if RRULE parsing fails
        console.warn("RRULE parse error for event:", raw.summary, e);
        events.push(makeVEvent(startDate));
      }
    }
  }

  // Sort by start date
  events.sort((a, b) => a.start.getTime() - b.start.getTime());

  return events;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseICSDate(value: string, params: string): { date: Date; allDay: boolean } {
  const clean = value.trim();

  // All-day: DATE format YYYYMMDD (8 chars, no T)
  if (clean.length === 8 && !clean.includes("T")) {
    return {
      date: new Date(
        parseInt(clean.substring(0, 4)),
        parseInt(clean.substring(4, 6)) - 1,
        parseInt(clean.substring(6, 8))
      ),
      allDay: true,
    };
  }

  // VALUE=DATE param
  if (params.toUpperCase().includes("VALUE=DATE")) {
    return {
      date: new Date(
        parseInt(clean.substring(0, 4)),
        parseInt(clean.substring(4, 6)) - 1,
        parseInt(clean.substring(6, 8))
      ),
      allDay: true,
    };
  }

  // DateTime: YYYYMMDDTHHMMSS[Z]
  const isUTC = clean.endsWith("Z");
  const s = clean.replace("Z", "");

  const year = parseInt(s.substring(0, 4));
  const month = parseInt(s.substring(4, 6)) - 1;
  const day = parseInt(s.substring(6, 8));
  const hour = parseInt(s.substring(9, 11) || "0");
  const minute = parseInt(s.substring(11, 13) || "0");
  const second = parseInt(s.substring(13, 15) || "0");

  const date = isUTC
    ? new Date(Date.UTC(year, month, day, hour, minute, second))
    : new Date(year, month, day, hour, minute, second);

  return { date, allDay: false };
}

function parseDuration(duration: string): number {
  // ISO 8601 duration: P[n]W, P[n]DT[n]H[n]M[n]S
  let ms = 0;
  const m = duration.match(/P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if (!m) return 0;
  if (m[1]) ms += parseInt(m[1]) * 7 * 24 * 60 * 60 * 1000;
  if (m[2]) ms += parseInt(m[2]) * 24 * 60 * 60 * 1000;
  if (m[3]) ms += parseInt(m[3]) * 60 * 60 * 1000;
  if (m[4]) ms += parseInt(m[4]) * 60 * 1000;
  if (m[5]) ms += parseInt(m[5]) * 1000;
  return ms;
}

function formatDateForRRule(date: Date, allDay: boolean): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  if (allDay) return `${y}${mo}${d}`;
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}${mo}${d}T${h}${mi}${s}`;
}

function decodeICSText(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
