"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
	Lock,
	LogOut,
} from "lucide-react";
import { useThemeStore } from "@stores/themeStore";
import { useAuthStore } from "@stores/authStore";

export default function PublicDashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full">
			<LeftNav className="w-56 hidden md:flex" />
			<main className="pb-24 px-4 pt-4 md:pb-8 md:my-8 md:mr-8 md:ml-64 md:px-0 md:pt-0 dark:text-slate-100">
				{children}
			</main>
			<MobileTabBar />
		</div>
	);
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
	const { theme, toggleTheme } = useThemeStore();
	const { isLoggedIn, isAdmin } = useAuthStore();
	return (
		<div className="relative w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-[#1e2130] dark:text-slate-100 md:max-w-sm md:rounded-3xl md:p-8" onClick={(e) => e.stopPropagation()}>
			<button type="button" onClick={onClose} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300">
				<X size={16} />
			</button>
			<div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 dark:bg-slate-600 md:hidden" />
			<h2 className="mb-6 font-bold text-xl">Settings</h2>
			<div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
				<div className="flex items-center gap-3">
					{theme === "dark" ? <Moon size={18} className="text-BRAND_COLOR" /> : <Sun size={18} className="text-DEFUALT_BLACK" />}
					<div>
						<p className="font-semibold text-sm">Appearance</p>
						<p className="text-gray-400 text-xs">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
					</div>
				</div>
				<button type="button" onClick={toggleTheme} className={clsx("relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300", theme === "dark" ? "bg-DEFUALT_BLACK" : "bg-gray-200")}>
					<span className={clsx("inline-block h-5 w-5 transform rounded-full shadow transition-transform duration-300", theme === "dark" ? "translate-x-8 bg-BRAND_COLOR" : "translate-x-1 bg-white")} />
				</button>
			</div>
			{isLoggedIn && (
				<div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
					<p className="font-semibold text-sm mb-1">Account</p>
					<p className="text-gray-400 text-xs">{isAdmin ? "Logged in as Admin" : "Logged in as User"}</p>
				</div>
			)}
			{isLoggedIn && (
				<button type="button" onClick={() => { useAuthStore.getState().logout(); onClose(); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 font-semibold text-red-500 text-sm transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
					<LogOut size={16} />
					Log Out
				</button>
			)}
		</div>
	);
}

function MobileTabBar({ homeLabel = "Home", adminLabel = "Admin" }: { homeLabel?: string; adminLabel?: string }) {
	const pathname = usePathname();
	const { isLoggedIn, isAdmin } = useAuthStore();
	const [settingsOpen, setSettingsOpen] = useState(false);

	const homeDest = isLoggedIn ? "/user/dashboard" : "/auth";
	const homeActive = pathname === "/user/dashboard";

	const tabItem = (href: string, icon: React.ReactNode, label: string) => {
		const active = pathname === href || pathname.startsWith(href + "/");
		return (
			<Link href={href} className={clsx("flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition", active ? "text-BRAND_COLOR" : "text-gray-400 dark:text-slate-500")}>
				{icon}
				{label}
			</Link>
		);
	};

	return (
		<>
			<nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t border-gray-100 bg-white px-2 shadow-lg dark:border-slate-700 dark:bg-[#1e2130] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
				<Link href={homeDest} className={clsx("flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition", homeActive ? "text-BRAND_COLOR" : isLoggedIn ? "text-gray-400 dark:text-slate-500" : "text-gray-300 dark:text-slate-600")}>
					{isLoggedIn ? <Home size={20} /> : <Lock size={20} />}
					{homeLabel}
				</Link>
				{tabItem("/forall/wam-calculator", <Calculator size={20} />, "Calc")}
				{tabItem("/forall/calendar", <CalendarDays size={20} />, "Calendar")}
				{tabItem("/gallery", <Images size={20} />, "Gallery")}
				<button type="button" onClick={() => setSettingsOpen(true)} className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold text-gray-400 transition dark:text-slate-500">
					<Settings size={20} />
					Settings
				</button>
			</nav>
			{settingsOpen && (
				<div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center" onClick={() => setSettingsOpen(false)}>
					<SettingsPanel onClose={() => setSettingsOpen(false)} />
				</div>
			)}
		</>
	);
}

function LeftNav({ className }: { className?: string }) {
	const pathname = usePathname();
	const { theme, toggleTheme } = useThemeStore();
	const { isLoggedIn, isAdmin } = useAuthStore();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const homeDest = isLoggedIn ? "/user/dashboard" : "/auth";
	const homeActive = pathname === "/user/dashboard";

	const navItem = (href: string, icon: React.ReactNode, label: string) => {
		const active = pathname === href || pathname.startsWith(href + "/");
		return (
			<Link href={href} className={clsx("flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition", { "bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm shadow-yellow-500/50": active, "hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR": !active })}>
				{icon}
				{label}
			</Link>
		);
	};

	return (
		<>
			<div className={clsx("sidebar-nav fixed top-7 bottom-7 left-4 z-50 flex-col items-center gap-1 rounded-[36px] bg-DEFUALT_WHITE px-3 py-4 font-semibold shadow-sm dark:bg-[#1e2130] dark:shadow-black/40", className)}>
				<Link href="/" className="mb-16 mt-[15px] flex w-full items-center">
					<Image src="/snlnewlogo.png" alt="SNL Logo" width={72} height={72} className="object-contain" />
				</Link>
				<Link href={homeDest} className={clsx("flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition", { "bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm shadow-yellow-500/50": homeActive && isLoggedIn, "hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR": !homeActive && isLoggedIn, "cursor-pointer text-gray-300 hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR dark:text-slate-600 dark:hover:text-BRAND_COLOR": !isLoggedIn })} title={isLoggedIn ? "Go to Dashboard" : "Log in to access Dashboard"}>
					{isLoggedIn ? <Home size={24} /> : <Lock size={24} />}
					Home
					{!isLoggedIn && <span className="ml-auto rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-400 dark:bg-slate-700 dark:text-slate-500">Login</span>}
				</Link>
				{navItem("/forall/wam-calculator", <Calculator size={24} />, "Calculator")}
				{navItem("/forall/calendar", <CalendarDays size={24} />, "Calendar")}
				{navItem("/gallery", <Images size={24} />, "Gallery")}
				{isAdmin && navItem("/admin", <span className="text-BRAND_COLOR text-xs font-black">ADM</span>, "Admin")}
				<div className="flex-1" />
				<button type="button" onClick={() => setSettingsOpen(true)} className="flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR">
					<Settings size={24} />
					Settings
				</button>
			</div>
			{settingsOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSettingsOpen(false)}>
					<SettingsPanel onClose={() => setSettingsOpen(false)} />
				</div>
			)}
		</>
	);
}
