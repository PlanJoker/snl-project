import moment from "moment";
import { useEffect, useState } from "react";
import type { VEvent } from "@/app/types/calendarType";

interface EventEditorProps {
	selectedEvent: VEvent | null;
	onUpdateEvent: (updatedEvent: VEvent) => void;
}

const EventEditor: React.FC<EventEditorProps> = ({
	selectedEvent,
	onUpdateEvent,
}) => {
	if (!selectedEvent) {
		return <div>No event selected</div>;
	}

	// State for each editable field
	const [title, setTitle] = useState(selectedEvent.title);
	const [start, setStart] = useState(selectedEvent.start);
	const [end, setEnd] = useState(selectedEvent.end);
	const [allDay, setAllDay] = useState(selectedEvent.allDay || false);
	const [location, setLocation] = useState(
		selectedEvent.resource?.location || "",
	);
	const [description, setDescription] = useState(
		selectedEvent.resource?.description || "",
	);

	// Update state when selectedEvent changes
	useEffect(() => {
		setTitle(selectedEvent.title);
		setStart(selectedEvent.start);
		setEnd(selectedEvent.end);
		setAllDay(selectedEvent.allDay || false);
		setLocation(selectedEvent.resource?.location || "");
		setDescription(selectedEvent.resource?.description || "");
	}, [selectedEvent]);

	const formatDate = (date: Date, type: string) => {
		const m = moment(date);
		if (!m.isValid()) {
			return "";
		}
		if (type === "date") {
			return m.format("YYYY-MM-DD");
		} else {
			return m.format("YYYY-MM-DDTHH:mm");
		}
	};

	const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (allDay) {
			setStart(moment(value).startOf("day").toDate());
		} else {
			setStart(new Date(value));
		}
	};

	const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (allDay) {
			setEnd(moment(value).endOf("day").toDate());
		} else {
			setEnd(new Date(value));
		}
	};

	const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;
		setAllDay(checked);
		if (checked) {
			setStart(moment(start).startOf("day").toDate());
			setEnd(moment(end).endOf("day").toDate());
		}
	};

	const handleUpdate = () => {
		if (!selectedEvent.resource?.id) {
			console.error("Cannot update event without id");
			return;
		}
		const updatedEvent: VEvent = {
			...selectedEvent,
			title,
			start,
			end,
			allDay,
			resource: {
				...selectedEvent.resource,
				location,
				description,
			},
		};
		onUpdateEvent(updatedEvent);
	};

	const inputType = allDay ? "date" : "datetime-local";

	return (
		<div className="flex flex-col gap-1">
			<h2 className="mb-6">Edit Event</h2>
			<div>
				Title:
				<input
					className="ml-1 bg-DEFUALT_WHITE"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div>
				Start:
				<input
					className="ml-1 bg-DEFUALT_WHITE"
					type={inputType}
					value={formatDate(start, inputType)}
					onChange={handleStartChange}
				/>
			</div>
			<div>
				End:
				<input
					className="ml-1 bg-DEFUALT_WHITE"
					type={inputType}
					value={formatDate(end, inputType)}
					onChange={handleEndChange}
				/>
			</div>
			<div>
				All Day:
				<input
					className="ml-1"
					type="checkbox"
					checked={allDay}
					onChange={handleAllDayChange}
				/>
			</div>
			<div>
				Location:
				<input
					className="ml-1 bg-DEFUALT_WHITE"
					type="text"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
			</div>
			<div className="flex items-start">
				Description:
				<textarea
					className="ml-1 w-60 h-32 resize-none"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<button
				className="px-2 py-1 bg-red-500 rounded-md text-DEFUALT_WHITE font-bold"
				onClick={handleUpdate}
			>
				Update!
			</button>
		</div>
	);
};

export default EventEditor;
