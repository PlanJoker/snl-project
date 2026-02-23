"use client";

import LeftNav from "@components/layout/LeftNav";
import ICSCalendarViewer from "./ICSCalendarViewer";

export default function CalendarPage() {
	return (
		<div className="flex h-screen w-full flex-row justify-center bg-[#EFEFEF] pt-16">
			<div className="relative max-w-7xl">
				<ICSCalendarViewer />
			</div>
		</div>
	);
}
