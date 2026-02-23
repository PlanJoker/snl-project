"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import clsx from "clsx";
import { Calculator, CalendarDays, Home, Settings } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function PublicDashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full">
			<LeftNav className="w-56" />
			{/* Main content area where child pages/layouts render */}
			<main className="my-8 mr-8 ml-64">{children}</main>
		</div>
	);
}

function LeftNav({ className }: { className?: string }) {
	const pathname = usePathname();

	return (
		<div
			className={clsx(
				"fixed top-7 bottom-7 left-4 z-50 flex flex-col items-center gap-1 rounded-[36px] bg-DEFUALT_WHITE px-3 py-4 pt-8 font-semibold shadow-2xs shadow-sm",
				className,
			)}
		>
			{/* Logo */}
			<Link href="/" className="mb-16 flex w-full items-center">
				<Image
					src="/logo06.svg"
					alt="Logo"
					// width={120}
					// height={30}
					width={72}
					height={72}
					className="p-1"
				/>
			</Link>

			<div className="flex h-9 w-full cursor-default items-center gap-1 px-2 py-5 text-gray-300 transition">
				<Home size={24} />
				Home
			</div>

			<Link
				href="/forall/wam-calculator"
				className={clsx(
					"flex h-9 w-full items-center gap-1 rounded-xl px-2 py-5 transition",
					{
						"bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm shadow-yellow-500/50":
							pathname === "/forall/wam-calculator",
						"hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50":
							pathname !== "/forall/wam-calculator",
					},
				)}
				// className="flex h-9 w-full items-center gap-1 rounded-xl px-2 py-5 transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-lg hover:shadow-yellow-500/50"
			>
				<Calculator size={24} />
				Calculator
			</Link>
			<Link
				href="/forall/calendar"
				className="flex h-9 w-full items-center gap-1 rounded-xl px-2 py-5 transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50"
			>
				<CalendarDays size={24} />
				Calendar
			</Link>
			<Link
				href=""
				className="flex h-9 w-full items-center gap-1 rounded-xl px-2 py-5 transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50"
			>
				<Settings size={24} />
				Settings
			</Link>
		</div>
	);
}
