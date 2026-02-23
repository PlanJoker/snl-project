"use client";
import { Calculator, CalendarDays, Home, Settings } from "lucide-react";
import Link from "next/link";

export default function LeftNav() {
	return (
		<div className="-translate-y-1/2 fixed top-1/2 left-4 z-50 flex w-[56px] transform flex-col items-center space-y-6 rounded-xl bg-gray-100 py-4 shadow-md">
			<Link
				href=""
				className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-300"
			>
				<Home size={24} />
			</Link>
			<Link
				href="/wam_calculator"
				className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-300"
			>
				<Calculator size={24} />
			</Link>
			<Link
				href="/calendar"
				className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-300"
			>
				<CalendarDays size={24} />
			</Link>
			<NavIcon icon={<Settings size={24} />} label="Settings" />
		</div>
	);
}

function NavIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<button
			type="button"
			className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-300"
			title={label}
		>
			{icon}
		</button>
	);
}
