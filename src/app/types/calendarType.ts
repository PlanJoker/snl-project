export type VEvent = {
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	resource?: any;
};

// VCALENDAR
export type ICSCalendar = {
	PRODID: string;
	VERSION: string;
	CALSCALE: string;

	VTIMEZONE?: VTimeZone;

	VEVENTS: ICSEvent[];
};

// Referenced iCalendar spec (RFC 5545)
export type ICSEvent = {
	// if ID is not set, then it is dummy selction data.
	id: string; // UID from iCal
	title?: string; // SUMMARY
	startTime: string; // DTSTART in ISO format; NOTE original is: DTSTART;TZID=Australia/Melbourne:20250203T143000
	endTime?: string; // DTEND in ISO format; NOTE original is: DTEND;TZID=Australia/Melbourne:20250203T163000
	location?: string; // LOCATION; NOTE: this is NOT timezone
	description?: string; // DESCRIPTION
	createdAt: string; // DTSTAMP in ISO format

	timeZone?: string; // Slice TZID from START and END

	// sequence?: number;
	// isRecurring?: boolean;
	// recurringType?: RecurringType;
};

export type RecurringType =
	| "daily"
	| "weekly"
	| "biweekly"
	| "monthly"
	| "yearly";

export type VTimeZone = {
	TZID: string;
	LAST_MODIFIED: string;
	TZURL: string;
	X_LIC_LOCATION: string;

	STANDARD: Standard;

	DAYLIGHT: DayLight;
};

type Standard = {
	TZNAME: string;
	TZOFFSETFROM: string;
	TZOFFSETTO: string;
	DTSTART: string;
	RRULE: string; // NOTE original is: FREQ=YEARLY;BYMONTH=4;BYDAY=1SU
};

type DayLight = {
	TZNAME: string;
	TZOFFSETFROM: string;
	TZOFFSETTO: string;
	DTSTART: string;
	RRULE: string; // NOTE original is: RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU
};
