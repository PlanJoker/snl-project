import { useCalendarStore } from "@stores/calendarStore";
import { File, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import type { VEvent } from "@/app/types/calendarType";
import { parseICS } from "@/app/utils/icsParser";
import ClubEvent from "./ClubEvents";
import EventEditor from "./EventEditor";
import MonthlyCalendar from "./MonthlyCalendar";
import WeeklyCalendar from "./WeeklyCalendar";

const sampleDraggableEvents: VEvent[] = [
{
title: "SNL Weekly Study Session",
start: new Date(),
end: new Date(Date.now() + 2 * 60 * 60 * 1000),
allDay: false,
resource: {
id: 99,
location: "Melbourne CBD Library",
course: "SNL Community Event",
},
},
];

export default function ICSCalendarViewer() {
const {
vEventLists,
targetVEvent,
setTargetVEvent,
setVEvents,
updateVEvent,
} = useCalendarStore();
const [isDragging, setIsDragging] = useState<boolean>(false);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [success, setSuccess] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

const processFile = async (file: File): Promise<void> => {
setIsLoading(true);
setError(null);
setSuccess(false);

try {
if (!file.name.toLowerCase().endsWith(".ics")) {
throw new Error("Invalid file type. Please upload an .ics file.");
}
if (file.size > 5 * 1024 * 1024) {
throw new Error("File size exceeds 5MB limit.");
}

const content = await file.text();
const parsedEvents = parseICS(content);

if (parsedEvents.length === 0) {
throw new Error("No events found in the ICS file. Please check the file format.");
}

setVEvents(parsedEvents);
setSuccess(true);
} catch (err) {
setError(err instanceof Error ? err.message : "An error occurred while parsing the file.");
} finally {
setIsLoading(false);
}
};

const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
e.preventDefault();
setIsDragging(true);
};
const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
e.preventDefault();
setIsDragging(false);
};
const handleDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
e.preventDefault();
setIsDragging(false);
const file = e.dataTransfer.files[0];
if (file) await processFile(file);
};
const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
const file = e.target.files?.[0];
if (file) await processFile(file);
};
const handleClear = (): void => {
setVEvents([]);
setSuccess(false);
setError(null);
if (fileInputRef.current) fileInputRef.current.value = "";
};

return (
<div className="relative flex flex-col w-full h-full justify-center items-center">
{vEventLists.length === 0 ? (
<div className="flex flex-col gap-6 w-full max-w-lg items-center">
{/* Drop Zone */}
<div
className={`flex flex-col gap-4 border-2 border-dashed justify-center items-center rounded-2xl p-12 text-center w-full transition-all cursor-pointer
              ${isDragging ? "border-BRAND_COLOR bg-BRAND_COLOR/10 scale-105" : "border-gray-300 hover:border-gray-400"}`}
onDragOver={handleDragOver}
onDragLeave={handleDragLeave}
onDrop={handleDrop}
onClick={() => fileInputRef.current?.click()}
onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
>
{isLoading ? (
<div className="flex flex-col items-center gap-3">
<div className="h-12 w-12 animate-spin rounded-full border-4 border-BRAND_COLOR border-t-transparent" />
<p className="text-gray-600">Parsing ICS file...</p>
</div>
) : (
<>
<div className="rounded-full bg-gray-100 p-4">
<Upload size={32} className="text-gray-500" />
</div>
<div>
<p className="font-semibold text-lg text-gray-800">Drop your ICS file here</p>
<p className="text-gray-500 text-sm mt-1">or click to browse files</p>
</div>
<p className="text-xs text-gray-400">Supports .ics calendar files up to 5MB</p>
</>
)}
</div>
<input
ref={fileInputRef}
type="file"
accept=".ics"
className="hidden"
onChange={handleFileInput}
/>

{/* Error Message */}
{error && (
<div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 w-full">
<AlertCircle size={20} className="text-red-500 flex-shrink-0" />
<p className="text-red-700 text-sm">{error}</p>
</div>
)}

{/* Info */}
<div className="rounded-xl bg-gray-50 p-4 w-full text-sm text-gray-600">
<p className="font-semibold mb-2">How to get your ICS file:</p>
<ul className="list-disc list-inside space-y-1 text-xs">
<li>Google Calendar: Settings → Export calendar</li>
<li>Apple Calendar: File → Export → Export...</li>
<li>Outlook: File → Save Calendar</li>
<li>University portal: Download timetable as .ics</li>
</ul>
</div>
</div>
) : (
<div className="w-full h-full flex gap-8">
<div className="w-[68%] flex flex-col gap-5">
{/* Header with clear button */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
{success && (
<div className="flex items-center gap-2 text-green-600 text-sm">
<CheckCircle size={16} />
<span>Calendar loaded successfully ({vEventLists.length} events)</span>
</div>
)}
</div>
<button
type="button"
onClick={handleClear}
className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
>
<X size={14} />
Clear calendar
</button>
</div>
<div className="shadow-sm bg-white rounded-3xl p-2">
<ClubEvent vEvent={sampleDraggableEvents[0]} />
</div>
<div className="shadow-sm bg-white rounded-3xl p-2 overflow-hidden">
<WeeklyCalendar
events={vEventLists}
selectedEvent={targetVEvent}
onEventSelect={setTargetVEvent}
/>
</div>
</div>
<div className="flex w-[32%] flex-col gap-5">
<div className="h-[50%] shadow-sm bg-white rounded-3xl p-2">
<MonthlyCalendar
events={vEventLists}
selectedEvent={targetVEvent}
onEventSelect={setTargetVEvent}
/>
</div>
<div className="h-[50%] shadow-sm bg-white rounded-3xl p-2">
{!targetVEvent ? (
<div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
<File size={32} strokeWidth={1} />
<p className="text-sm">Select an event to view details</p>
</div>
) : (
<EventEditor
selectedEvent={targetVEvent}
onUpdateEvent={updateVEvent}
/>
)}
</div>
</div>
</div>
)}
</div>
);
}
