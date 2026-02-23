"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import {
	Calculator,
	CalendarDays,
	Home,
	Settings,
	Images,
	Sun,
	Moon,
	X,
} from "lucide-react";
import { useThemeStore } from "@stores/themeStore";

export default function PublicDashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full">
			<LeftNav className="w-56" />
			<main className="my-8 mr-8 ml-64 dark:text-slate-100">{children}</main>
		</div>
	);
}

function LeftNav({ className }: { className?: string }) {
	const pathname = usePathname();
	const { theme, toggleTheme } = useThemeStore();
	const [settingsOpen, setSettingsOpen] = useState(false);

	const navItem = (href: string, icon: React.ReactNode, label: string) => {
		const active = pathname === href;
		return (
			<Link
				href={href}
				className={clsx(
					"flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition",
					{
						"bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm shadow-yellow-500/50": active,
						"hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR":
							!active,
					},
				)}
			>
				{icon}
				{label}
			</Link>
		);
	};

	return (
		<>
			<div
				className={clsx(
					"sidebar-nav fixed top-7 bottom-7 left-4 z-50 flex flex-col items-center gap-1 rounded-[36px] bg-DEFUALT_WHITE px-3 py-4 font-semibold shadow-sm dark:bg-[#1e2130] dark:shadow-black/40",
					className,
				)}
			>
				{/* Logo — 5px lower via mt-[5px] */}
				<Link href="/" className="mb-16 mt-[15px] flex w-full items-center">
					<Image
						src="/snlnewlogo.png"
						alt="SNL Logo"
						width={72}
						height={72}
						className="object-contain"
					/>
				</Link>

				{/* Home (non-clickable placeholder) */}
				<div className="flex h-9 w-full cursor-default items-center gap-2 px-2 py-5 text-gray-300 dark:text-slate-600 transition">
					<Home size={24} />
					Home
				</div>

				{navItem("/forall/wam-calculator", <Calculator size={24} />, "Calculator")}
				{navItem("/forall/calendar", <CalendarDays size={24} />, "Calendar")}
				{navItem("/gallery", <Images size={24} />, "Gallery")}

				{/* Spacer */}
				<div className="flex-1" />

				{/* Settings button */}
				<button
					type="button"
					onClick={() => setSettingsOpen(true)}
					className="flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR"
				>
					<Settings size={24} />
					Settings
				</button>
			</div>

			{/* Settings Panel */}
			{settingsOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#1e2130] dark:text-slate-100">
						{/* Close */}
						<button
							type="button"
							onClick={() => setSettingsOpen(false)}
							className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
						>
							<X size={16} />
						</button>

						<h2 className="mb-6 font-bold text-2xl">Settings</h2>

						{/* Theme Toggle */}
						<div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
							<div className="flex items-center gap-3">
								{theme === "dark" ? (
									<Moon size={20} className="text-BRAND_COLOR" />
								) : (
									<Sun size={20} className="text-DEFUALT_BLACK" />
								)}
								<div>
									<p className="font-semibold text-sm">Appearance</p>
									<p className="text-gray-400 text-xs dark:text-slate-500">
										{theme === "dark" ? "Dark mode" : "Light mode"}
									</p>
								</div>
							</div>

							{/* Toggle switch */}
							<button
								type="button"
								onClick={toggleTheme}
								className={clsx(
									"relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-BRAND_COLOR focus:ring-offset-2",
									theme === "dark" ? "bg-DEFUALT_BLACK" : "bg-gray-200",
								)}
								aria-label="Toggle dark mode"
							>
								<span
									className={clsx(
										"inline-block h-5 w-5 transform rounded-full shadow transition-transform duration-300",
										theme === "dark"
											? "translate-x-8 bg-BRAND_COLOR"
											: "translate-x-1 bg-white",
									)}
								/>
							</button>
						</div>

						{/* Quick theme buttons */}
						<div className="mt-4 grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => useThemeStore.getState().setTheme("light")}
								className={clsx(
									"flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold text-sm transition",
									theme === "light"
										? "border-DEFUALT_BLACK bg-BRAND_COLOR text-DEFUALT_BLACK"
										: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
								)}
							>
								<Sun size={16} />
								Light
							</button>
							<button
								type="button"
								onClick={() => useThemeStore.getState().setTheme("dark")}
								className={clsx(
									"flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold text-sm transition",
									theme === "dark"
										? "border-BRAND_COLOR bg-DEFUALT_BLACK text-BRAND_COLOR"
										: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
								)}
							>
								<Moon size={16} />
								Dark
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
