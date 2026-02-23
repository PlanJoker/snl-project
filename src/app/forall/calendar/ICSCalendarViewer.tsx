"use client";
import { useCalendarStore } from "@stores/calendarStore";
import { File, Upload, X, CheckCircle, AlertCircle, RefreshCw, Download, Sparkles } from "lucide-react";
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
			location: "Melbourne CBD Library, Level 3",
			course: "SNL Community Event",
		},
	},
];

const EXAMPLE_PRESETS = [
	{
		id: "university",
		label: "University Timetable",
		description: "CS101, ECON201, MATH301 lectures + SNL sessions (recurring events demo)",
		icon: "🎓",
		file: "/examples/university-timetable.ics",
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
	const [loadingPreset, setLoadingPreset] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [loadedName, setLoadedName] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const processContent = (content: string, name: string): void => {
		const parsedEvents = parseICS(content);
		if (parsedEvents.length === 0) {
			throw new Error("No events found in the ICS file. Please check the file format.");
		}
		setVEvents(parsedEvents);
		setLoadedName(name);
		setSuccess(true);
	};

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
			processContent(content, file.name);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred while parsing the file.");
		} finally {
			setIsLoading(false);
		}
	};

	const loadPreset = async (preset: typeof EXAMPLE_PRESETS[0]): Promise<void> => {
		setLoadingPreset(preset.id);
		setError(null);
		setSuccess(false);
		try {
			const res = await fetch(preset.file);
			if (!res.ok) throw new Error(`Failed to load example: ${res.statusText}`);
			const content = await res.text();
			processContent(content, preset.label);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load example calendar.");
		} finally {
			setLoadingPreset(null);
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
		setLoadedName("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const recurringCount = vEventLists.filter((e) => e.resource?.isRecurring).length;

	return (
		<div className="relative flex flex-col w-full h-full justify-center items-center">
			{vEventLists.length === 0 ? (
				<div className="flex flex-col gap-5 w-full max-w-lg items-center">
					{/* Drop Zone */}
					<div
						className={`flex flex-col gap-4 border-2 border-dashed justify-center items-center rounded-2xl p-10 text-center w-full transition-all cursor-pointer
              ${isDragging ? "border-BRAND_COLOR bg-BRAND_COLOR/10 scale-105" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
						onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
						role="button"
						tabIndex={0}
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
								<p className="text-xs text-gray-400">Supports .ics calendar files up to 5MB · Recurring events (RRULE) supported</p>
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

					{/* Divider */}
					<div className="flex items-center gap-3 w-full">
						<div className="flex-1 h-px bg-gray-200" />
						<span className="text-xs text-gray-400 font-medium tracking-wide">OR TRY AN EXAMPLE</span>
						<div className="flex-1 h-px bg-gray-200" />
					</div>

					{/* Example Presets */}
					<div className="w-full flex flex-col gap-3">
						{EXAMPLE_PRESETS.map((preset) => (
							<button
								key={preset.id}
								type="button"
								onClick={() => loadPreset(preset)}
								disabled={loadingPreset === preset.id}
								className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-BRAND_COLOR hover:bg-BRAND_COLOR/5 transition-all disabled:opacity-60 group shadow-sm"
							>
								<div className="text-3xl flex-shrink-0">{preset.icon}</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<p className="font-semibold text-gray-800 group-hover:text-DEFUALT_BLACK">{preset.label}</p>
										<span className="inline-flex items-center gap-1 rounded-full bg-BRAND_COLOR/30 px-2 py-0.5 text-xs font-semibold text-DEFUALT_BLACK">
											<Sparkles size={10} />
											Recurring
										</span>
									</div>
									<p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
								</div>
								<div className="flex-shrink-0">
									{loadingPreset === preset.id ? (
										<RefreshCw size={18} className="animate-spin text-gray-400" />
									) : (
										<Download size={18} className="text-gray-400 group-hover:text-DEFUALT_BLACK transition-colors" />
									)}
								</div>
							</button>
						))}
					</div>

					{/* Error Message */}
					{error && (
						<div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 w-full">
							<AlertCircle size={20} className="text-red-500 flex-shrink-0" />
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					)}

					{/* Info */}
					<div className="rounded-xl bg-gray-50 border border-gray-100 p-4 w-full">
						<p className="font-semibold text-sm text-gray-700 mb-2">How to get your ICS file:</p>
						<ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
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
						{/* Header */}
						<div className="flex items-center justify-between flex-wrap gap-2">
							<div className="flex items-center gap-3 flex-wrap">
								{success && (
									<div className="flex items-center gap-2 text-green-600 text-sm font-medium">
										<CheckCircle size={16} />
										<span>{loadedName || "Calendar"} loaded</span>
									</div>
								)}
								<span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
									{vEventLists.length} events
								</span>
								{recurringCount > 0 && (
									<span className="inline-flex items-center gap-1 rounded-full bg-BRAND_COLOR/25 px-2.5 py-0.5 text-xs font-semibold text-DEFUALT_BLACK">
										<RefreshCw size={10} />
										{recurringCount} recurring
									</span>
								)}
							</div>
							<button
								type="button"
								onClick={handleClear}
								className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
							>
								<X size={14} />
								Clear
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
									<p className="text-sm text-center px-4">Select an event to view details</p>
								</div>
							) : (
								<div className="h-full overflow-auto">
									{targetVEvent.resource?.isRecurring && (
										<div className="mx-3 mt-3 mb-1 flex items-center gap-1.5 rounded-lg bg-BRAND_COLOR/20 px-3 py-1.5 text-xs font-semibold text-DEFUALT_BLACK">
											<RefreshCw size={11} />
											Recurring event
										</div>
									)}
									<EventEditor
										selectedEvent={targetVEvent}
										onUpdateEvent={updateVEvent}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
