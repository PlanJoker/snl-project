import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import type { VEvent } from "@/app/types/calendarType";
import "./css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface MonthlyCalendarProps {
	events: VEvent[];
	selectedEvent: VEvent | null;
	onEventSelect: (event: VEvent | null) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
	events,
	selectedEvent,
	onEventSelect,
}) => {
	// State to control the calendar's current date
	const [currentDate, setCurrentDate] = useState(new Date());

	// Handle event click to update selectedEvent
	const handleSelectEvent = (event: VEvent) => {
		onEventSelect(event);
	};

	// Handle user navigation to keep currentDate in sync
	const handleNavigate = (newDate: Date) => {
		setCurrentDate(newDate);
	};

	// Highlight selected event
	const eventPropGetter = (event: VEvent) => {
		if (selectedEvent && event.resource?.id === selectedEvent.resource?.id) {
			return { style: { backgroundColor: "#3174ad" } };
		}
		return {};
	};

	// Highlight current day and selected event's day
	const dayPropGetter = (date: Date) => {
		// Highlight selected event's day
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

		// Highlight current day
		const isToday = moment(date).isSame(moment(), "day");
		if (isToday) {
			return { style: { backgroundColor: "#e0f7fa" } }; // Light cyan for today
		}

		return {};
	};

	// Navigate to selected event's month if outside current view
	useEffect(() => {
		if (
			selectedEvent &&
			selectedEvent.start &&
			moment(selectedEvent.start).isValid()
		) {
			const eventDate = moment(selectedEvent.start);
			const currentMonthStart = moment(currentDate).startOf("month");
			const currentMonthEnd = moment(currentDate).endOf("month");

			if (
				!eventDate.isBetween(
					currentMonthStart,
					currentMonthEnd,
					undefined,
					"[]",
				)
			) {
				setCurrentDate(eventDate.toDate());
			}
		}
	}, [selectedEvent]);

	const CustomToolbar = (toolbarProps: any) => {
		const { date, onNavigate } = toolbarProps;
		const monthName = moment(date).format("MMMM");
		const yearName = moment(date).format("YYYY");

		const goToBack = () => onNavigate("PREV");
		const goToNext = () => onNavigate("NEXT");

		return (
			<div className="flex justify-between items-center h-12">
				<span className="text-2xl">{monthName}</span>
				<span className="text-2xl text-BRAND_COLOR">{yearName}</span>
				<span className="flex items-center">
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

	interface EventWrapperProps {
		style?: React.CSSProperties;
		className?: string;
		children: React.ReactNode;
		event: VEvent;
	}

	const CustomEventWrapper = ({
		style,
		className,
		children,
		event,
	}: EventWrapperProps) => {
		return (
			<div
				style={{ ...style, backgroundColor: "transparent" }}
				className={className}
				title={event.title}
				aria-label={`Event: ${event.title}`}
			>
				{children}
			</div>
		);
	};

	const CustomEvent = ({ event }: { event: VEvent }) => {
		return (
			<div
				title={event.title}
				style={{
					width: "8px",
					height: "8px",
					backgroundColor: "blue",
					borderRadius: "50%",
					margin: "2px",
					cursor: "pointer",
				}}
			></div>
		);
	};

	// const CustomDateHeader = ({ event }: { event: VEvent }) => {
	//   const dayNumber = event.start.getDate();
	//   const isWeekend = date.getDay() === 0 || date.getDay() === 6;
	//   return (
	//     <div
	//       style={{
	//         backgroundColor: isWeekend ? '#ffebee' : 'white',
	//         padding: '5px',
	//         textAlign: 'right',
	//       }}
	//     >
	//       <span>{dayNumber}</span>
	//       {isWeekend && <span>🌴</span>}
	//     </div>
	//   );
	// };

	return (
		<Calendar
			className="w-full h-full"
			localizer={localizer}
			events={events}
			startAccessor="start"
			endAccessor="end"
			defaultView={Views.MONTH}
			views={[Views.MONTH]}
			date={currentDate}
			onNavigate={handleNavigate}
			eventPropGetter={eventPropGetter}
			dayPropGetter={dayPropGetter}
			onSelectEvent={handleSelectEvent}
			components={{
				toolbar: CustomToolbar,
				// event: CustomEvent,
				// eventWrapper: CustomEventWrapper,
			}}
			// toolbar={false}
		/>
	);
};

export default MonthlyCalendar;
