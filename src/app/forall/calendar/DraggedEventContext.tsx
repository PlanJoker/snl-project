import { createContext } from "react";
import type { VEvent } from "@/app/types/calendarType";

interface DraggedEventContextType {
	draggedEvent: VEvent | null;
	setDraggedEvent: (event: VEvent | null) => void;
}

export const DraggedEventContext = createContext<DraggedEventContextType>({
	draggedEvent: null,
	setDraggedEvent: () => {},
});
