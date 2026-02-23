import type { VEvent } from "@/app/types/calendarType";

/**
 * Parse ICS file content into VEvent array
 * Supports VEVENT components with DTSTART, DTEND, SUMMARY, LOCATION, DESCRIPTION
 */
export function parseICS(content: string): VEvent[] {
  const events: VEvent[] = [];
  
  // Split into lines, handle CRLF and LF
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  
  // Unfold lines (continuation lines start with space or tab)
  const unfolded: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  }
  
  let inEvent = false;
  let currentEvent: Partial<VEvent & { id: number }> = {};
  let eventId = 1;
  
  for (const line of unfolded) {
    const trimmed = line.trim();
    
    if (trimmed === "BEGIN:VEVENT") {
      inEvent = true;
      currentEvent = {};
      continue;
    }
    
    if (trimmed === "END:VEVENT") {
      inEvent = false;
      if (currentEvent.title && currentEvent.start) {
        events.push({
          title: currentEvent.title,
          start: currentEvent.start,
          end: currentEvent.end || currentEvent.start,
          allDay: currentEvent.allDay || false,
          resource: {
            id: eventId++,
            location: currentEvent.resource?.location || "",
            description: currentEvent.resource?.description || "",
          },
        });
      }
      continue;
    }
    
    if (!inEvent) continue;
    
    // Parse property name and value
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    
    const propFull = trimmed.substring(0, colonIdx);
    const value = trimmed.substring(colonIdx + 1);
    
    // Property name may have parameters (e.g., DTSTART;TZID=...)
    const semiIdx = propFull.indexOf(";");
    const propName = semiIdx !== -1 ? propFull.substring(0, semiIdx) : propFull;
    const propParams = semiIdx !== -1 ? propFull.substring(semiIdx + 1) : "";
    
    switch (propName.toUpperCase()) {
      case "SUMMARY":
        currentEvent.title = decodeICSText(value);
        break;
        
      case "DTSTART": {
        const { date, allDay } = parseICSDate(value, propParams);
        currentEvent.start = date;
        currentEvent.allDay = allDay;
        break;
      }
        
      case "DTEND": {
        const { date } = parseICSDate(value, propParams);
        currentEvent.end = date;
        break;
      }
        
      case "LOCATION":
        if (!currentEvent.resource) currentEvent.resource = { id: 0 };
        currentEvent.resource.location = decodeICSText(value);
        break;
        
      case "DESCRIPTION":
        if (!currentEvent.resource) currentEvent.resource = { id: 0 };
        (currentEvent.resource as Record<string, unknown>).description = decodeICSText(value);
        break;
    }
  }
  
  return events;
}

function parseICSDate(value: string, params: string): { date: Date; allDay: boolean } {
  // All-day event: DATE format (YYYYMMDD)
  if (value.length === 8 && !value.includes("T")) {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(4, 6)) - 1;
    const day = parseInt(value.substring(6, 8));
    return { date: new Date(year, month, day), allDay: true };
  }
  
  // Check if VALUE=DATE in params
  if (params.includes("VALUE=DATE")) {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(4, 6)) - 1;
    const day = parseInt(value.substring(6, 8));
    return { date: new Date(year, month, day), allDay: true };
  }
  
  // DateTime format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
  const isUTC = value.endsWith("Z");
  const clean = value.replace("Z", "");
  
  const year = parseInt(clean.substring(0, 4));
  const month = parseInt(clean.substring(4, 6)) - 1;
  const day = parseInt(clean.substring(6, 8));
  const hour = parseInt(clean.substring(9, 11));
  const minute = parseInt(clean.substring(11, 13));
  const second = parseInt(clean.substring(13, 15) || "0");
  
  let date: Date;
  if (isUTC) {
    date = new Date(Date.UTC(year, month, day, hour, minute, second));
  } else {
    date = new Date(year, month, day, hour, minute, second);
  }
  
  return { date, allDay: false };
}

function decodeICSText(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
