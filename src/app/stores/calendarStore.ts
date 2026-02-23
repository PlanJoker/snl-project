import { create } from "zustand";
import type { VEvent } from "../types/calendarType";

interface CalendarState {
	vEventLists: VEvent[];
	targetVEvent: VEvent | null;

	setVEvents: (events: VEvent[]) => void; // New action to replace vEventLists
	addVEvents: (events: VEvent[]) => void;
	setTargetVEvent: (event: VEvent | null) => void;
	updateVEvent: (updatedEvent: VEvent) => void;
	deleteVEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
	vEventLists: [],
	targetVEvent: null,

	setVEvents: (events: VEvent[]) => set({ vEventLists: events }), // Replace vEventLists with new events
	addVEvents: (events: VEvent[]) =>
		set((state) => ({ vEventLists: [...state.vEventLists, ...events] })),
	setTargetVEvent: (event: VEvent | null) => set({ targetVEvent: event }),
	updateVEvent: (updatedEvent: VEvent) =>
		set((state) => ({
			vEventLists: state.vEventLists.map((event: VEvent) =>
				event.resource?.id === updatedEvent.resource?.id ? updatedEvent : event,
			),
		})),
	deleteVEvent: (id: string) =>
		set((state) => {
			const newEvents = state.vEventLists.filter(
				(event: VEvent) => event.resource?.id !== id,
			);
			return { vEventLists: newEvents };
		}),
}));
