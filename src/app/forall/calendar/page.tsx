"use client";

import LeftNav from "@components/layout/LeftNav";
import ICSCalendarViewer from "./ICSCalendarViewer";

export default function CalendarPage() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-[#EFEFEF] dark:bg-[#0f1117] pt-2 md:pt-16">
			<div className="relative w-full max-w-7xl px-0 md:px-4">
				<ICSCalendarViewer />
			</div>
		</div>
	);
}
