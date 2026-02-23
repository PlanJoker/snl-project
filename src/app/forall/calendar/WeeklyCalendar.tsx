import { Calendar1Icon, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import type { VEvent } from "@/app/types/calendarType";
// import "./css/week-calendar.css";

const localizer = momentLocalizer(moment);

interface WeeklyCalendarProps {
	events: VEvent[];
	selectedEvent: VEvent | null;
	onEventSelect: (event: VEvent | null) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
	events,
	selectedEvent,
	onEventSelect,
}) => {
	// State to control the calendar's current date
	const [currentDate, setCurrentDate] = useState(new Date());

	// Effect to navigate to the selected event's week if outside the current view
	useEffect(() => {
		if (
			selectedEvent &&
			selectedEvent.start &&
			moment(selectedEvent.start).isValid()
		) {
			const eventDate = moment(selectedEvent.start);
			const currentWeekStart = moment(currentDate).startOf("week");
			const currentWeekEnd = moment(currentDate).endOf("week");

			if (
				!eventDate.isBetween(currentWeekStart, currentWeekEnd, undefined, "[]")
			) {
				setCurrentDate(eventDate.toDate());
			}
		}
	}, [selectedEvent]); // Only depend on selectedEvent, if multiple exists, navigation won't work.

	// Handle event click to update selectedEvent
	const handleSelectEvent = (event: VEvent) => {
		onEventSelect(event);
	};

	// Handle user navigation to keep currentDate in sync
	const handleNavigate = (newDate: Date) => {
		setCurrentDate(newDate);
	};

	// Customize event styles (highlight the selected event)
	const eventPropGetter = (event: VEvent) => {
		if (selectedEvent && event.resource?.id === selectedEvent.resource?.id) {
			return { style: { backgroundColor: "rgba(14, 165, 233, 0.1)" } };
		}
		return {};
	};

	// Highlight the day containing the selected event
	const dayPropGetter = (date: Date) => {
		if (
			selectedEvent &&
			selectedEvent.start &&
			moment(selectedEvent.start).isValid()
		) {
			const isSelectedDay = moment(date).isSame(
				moment(selectedEvent.start),
				"day",
			);
			if (isSelectedDay) {
				return { style: { backgroundColor: "#fff59d" } }; // Yellow for selected event's day
			}
		}
		return {};
	};

	const CustomToolbar = (toolbarProps: any) => {
		const { date, onNavigate } = toolbarProps;
		const monthName = moment(date).format("MMMM");

		const goToBack = () => onNavigate("PREV");
		const goToNext = () => onNavigate("NEXT");
		const goToToday = () => onNavigate("TODAY");

		return (
			<div className="rbc-toolbar" style={{ justifyContent: "flex-start" }}>
				<span className="rbc-btn-group">
					<button
						style={{ border: "none", padding: "0" }}
						type="button"
						onClick={goToBack}
						title="Previous month"
						aria-label="Previous month"
					>
						<ChevronLeft className="text-DEFUALT_BLACK" size={24} />
					</button>
					<button
						style={{
							border: "none",
							padding: "0",
							paddingLeft: "4px",
							paddingRight: "4px",
						}}
						type="button"
						onClick={goToToday}
						title="Go to today"
						aria-label="Go to today"
					>
						Today
					</button>
					<button
						style={{ border: "none", padding: "0" }}
						type="button"
						onClick={goToNext}
						title="Next month"
						aria-label="Next month"
					>
						<ChevronRight className="text-DEFUALT_BLACK" size={24} />
					</button>
				</span>
			</div>
		);
	};

	return (
		<Calendar
			className="w-full h-full"
			localizer={localizer}
			events={events}
			startAccessor="start"
			endAccessor="end"
			defaultView={Views.WEEK}
			date={currentDate}
			onNavigate={handleNavigate}
			onSelectEvent={handleSelectEvent}
			eventPropGetter={eventPropGetter}
			dayPropGetter={dayPropGetter}
			components={{ toolbar: CustomToolbar }}
		/>
	);
};

export default WeeklyCalendar;
