"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts";
import {
	Bell,
	CalendarDays,
	Target,
	TrendingUp,
	BookOpen,
	MapPin,
	Clock,
	ChevronRight,
	Plus,
	Trash2,
	Edit3,
	Check,
	X,
	Camera,
	Upload,
	Globe,
	Clock3,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import { useAuthStore } from "@stores/authStore";
import { useUserStore } from "@stores/userStore";
import { useAdminStore } from "@stores/adminStore";
import { useWAMStore } from "@stores/WAMStore";
import { useCalendarStore } from "@stores/calendarStore";
import type { StudyGoal } from "@stores/userStore";

// ─── Grade helpers ────────────────────────────────────────────────────────────
const gradeLabel = (score: number | null) => {
	if (score === null) return "—";
	if (score >= 80) return "H1";
	if (score >= 70) return "H2A";
	if (score >= 60) return "H2B";
	if (score >= 50) return "H3";
	return "F";
};

const gradeColor = (score: number | null) => {
	if (score === null) return "#6b7280";
	if (score >= 80) return "#22c55e";
	if (score >= 70) return "#84cc16";
	if (score >= 60) return "#eab308";
	if (score >= 50) return "#f97316";
	return "#ef4444";
};

// ─── Weekly calendar helpers ──────────────────────────────────────────────────
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekRange(offset = 0) {
	const now = new Date();
	const day = now.getDay(); // 0=Sun
	const monday = new Date(now);
	monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d;
	});
}

function sameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
	return (
		<div className="mb-4 flex items-center gap-2">
			<span className="text-BRAND_COLOR">{icon}</span>
			<h2 className="font-bold text-lg dark:text-slate-100">{title}</h2>
		</div>
	);
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={`rounded-2xl bg-white p-5 shadow-sm dark:bg-[#1e2130] dark:shadow-black/30 ${className}`}
		>
			{children}
		</div>
	);
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
	const router = useRouter();
	const { isLoggedIn, isAdmin, userId } = useAuthStore();
	const { getCurrentUser, getGoals, addGoal, updateGoal, removeGoal } = useUserStore();
	const { announcements, sessions } = useAdminStore();
	const { semesters, calculateSemesterGPA, calculateSubjectGrade } = useWAMStore();
	const { vEventLists } = useCalendarStore();

	const [weekOffset, setWeekOffset] = useState(0);
	const weekDays = getWeekRange(weekOffset);

	// Goal editing state
	const [showGoalForm, setShowGoalForm] = useState(false);
	const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
	const [goalForm, setGoalForm] = useState({
		semesterId: "",
		semesterName: "",
		targetWAM: 75,
		targetGrade: "H2A",
		note: "",
	});

	// Redirect if not logged in
	useEffect(() => {
		if (!isLoggedIn) router.push("/auth");
	}, [isLoggedIn, router]);

	if (!isLoggedIn) return null;

	const user = isAdmin ? null : getCurrentUser();
	const displayName = isAdmin ? "Admin" : (user?.displayName || user?.username || "Student");
	const goals = isAdmin ? [] : getGoals();

	// ── WAM chart data ──
	const wamChartData = semesters.map((sem) => {
		const gpa = calculateSemesterGPA(sem.id);
		const goal = goals.find((g) => g.semesterId === sem.id);
		return {
			name: sem.name,
			WAM: gpa !== null ? Math.round(gpa * 10) / 10 : null,
			Goal: goal ? goal.targetWAM : null,
			fill: gradeColor(gpa),
		};
	});

	// ── Next session ──
	const now = new Date();
	const upcomingSessions = sessions
		.filter((s) => new Date(`${s.date}T${s.startTime}`) >= now)
		.sort((a, b) => a.date.localeCompare(b.date));
	const nextSession = upcomingSessions[0] ?? null;

	// ── Pinned announcements ──
	const pinnedAnnouncements = announcements.filter((a) => a.pinned);
	const recentAnnouncements = [...announcements]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 3);

	// ── Weekly events ──
	const weeklyEvents = vEventLists.filter((ev) => {
		const start = new Date(ev.start);
		return weekDays.some((d) => sameDay(d, start));
	});

	// ── Goal form helpers ──
	const openAddGoal = () => {
		setEditingGoalId(null);
		setGoalForm({
			semesterId: semesters[0]?.id ?? "",
			semesterName: semesters[0]?.name ?? "",
			targetWAM: 75,
			targetGrade: "H2A",
			note: "",
		});
		setShowGoalForm(true);
	};

	const openEditGoal = (g: StudyGoal) => {
		setEditingGoalId(g.id);
		setGoalForm({
			semesterId: g.semesterId,
			semesterName: g.semesterName,
			targetWAM: g.targetWAM,
			targetGrade: g.targetGrade,
			note: g.note,
		});
		setShowGoalForm(true);
	};

	const saveGoal = () => {
		if (!goalForm.semesterId && semesters.length > 0) return;
		if (editingGoalId) {
			updateGoal(editingGoalId, goalForm);
		} else {
			addGoal(goalForm);
		}
		setShowGoalForm(false);
	};

	return (
		<div className="space-y-6 pb-12">
			{/* ── Welcome banner ── */}
			<div className="relative overflow-hidden rounded-3xl bg-DEFUALT_BLACK px-5 py-6 md:px-8 md:py-8 text-white">
				<div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-BRAND_COLOR opacity-20 blur-3xl" />
				<p className="text-BRAND_COLOR text-sm font-semibold uppercase tracking-widest mb-1">
					Saturday Normal Library
				</p>
				<h1 className="font-black text-3xl md:text-4xl">
					Welcome back, <span className="text-BRAND_COLOR">{displayName}</span> 👋
				</h1>
				<p className="mt-2 text-gray-400">
					{new Date().toLocaleDateString("en-AU", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
				{/* Quick stats */}
				<div className="mt-6 flex flex-wrap gap-4">
					<div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
						<p className="text-xs text-gray-400">Semesters tracked</p>
						<p className="font-bold text-xl text-BRAND_COLOR">{semesters.length}</p>
					</div>
					<div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
						<p className="text-xs text-gray-400">Study goals</p>
						<p className="font-bold text-xl text-BRAND_COLOR">{goals.length}</p>
					</div>
					<div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
						<p className="text-xs text-gray-400">Calendar events</p>
						<p className="font-bold text-xl text-BRAND_COLOR">{vEventLists.length}</p>
					</div>
				</div>
			</div>

			{/* ── Top row: Announcements + Next Session ── */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Announcements */}
				<Card>
					<SectionTitle icon={<Bell size={20} />} title="Announcements" />
					{recentAnnouncements.length === 0 ? (
						<p className="text-gray-400 text-sm">No announcements yet.</p>
					) : (
						<div className="space-y-3">
							{recentAnnouncements.map((ann) => (
								<div
									key={ann.id}
									className={`rounded-xl p-3 ${
										ann.pinned
											? "border border-BRAND_COLOR/30 bg-BRAND_COLOR/5"
											: "bg-gray-50 dark:bg-slate-800"
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<p className="font-semibold text-sm dark:text-slate-100">
											{ann.pinned && (
												<span className="mr-1.5 rounded-full bg-BRAND_COLOR px-1.5 py-0.5 text-DEFUALT_BLACK text-[10px] font-bold">
													📌 PINNED
												</span>
											)}
											{ann.title}
										</p>
									</div>
									<p className="mt-1 text-gray-500 text-xs dark:text-slate-400 line-clamp-2">
										{ann.content}
									</p>
									<p className="mt-1 text-gray-400 text-[10px]">
										{new Date(ann.createdAt).toLocaleDateString("en-AU")}
									</p>
								</div>
							))}
						</div>
					)}
				</Card>

				{/* Next Session */}
				<Card>
					<SectionTitle icon={<CalendarDays size={20} />} title="Next SNL Session" />
					{nextSession ? (
						<div className="rounded-2xl bg-DEFUALT_BLACK p-5 text-white">
							<div className="mb-3 flex items-center gap-2">
								<span className="rounded-full bg-BRAND_COLOR px-3 py-1 font-bold text-DEFUALT_BLACK text-xs">
									UPCOMING
								</span>
							</div>
							<p className="font-black text-2xl text-BRAND_COLOR">
								{new Date(nextSession.date).toLocaleDateString("en-AU", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</p>
							<div className="mt-3 space-y-2">
								<div className="flex items-center gap-2 text-gray-300 text-sm">
									<Clock size={14} className="text-BRAND_COLOR" />
									{nextSession.startTime} – {nextSession.endTime}
								</div>
								<div className="flex items-center gap-2 text-gray-300 text-sm">
									<MapPin size={14} className="text-BRAND_COLOR" />
									{nextSession.location}
								</div>
								<div className="flex items-center gap-2 text-gray-300 text-sm">
									<BookOpen size={14} className="text-BRAND_COLOR" />
									{nextSession.topic}
								</div>
							</div>
							{nextSession.notes && (
								<p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-gray-400 text-xs">
									{nextSession.notes}
								</p>
							)}
						</div>
					) : (
						<div className="rounded-2xl bg-gray-50 p-6 text-center dark:bg-slate-800">
							<p className="text-gray-400 text-sm">No upcoming sessions scheduled.</p>
							<p className="mt-1 text-gray-400 text-xs">
								Every Saturday 1pm–6pm @ o3space@brunswick
							</p>
						</div>
					)}
				</Card>
			</div>

			{/* ── Study Goals ── */}
			{!isAdmin && (
				<Card>
					<div className="mb-4 flex items-center justify-between">
						<SectionTitle icon={<Target size={20} />} title="Study Goals" />
						<button
							type="button"
							onClick={openAddGoal}
							className="flex items-center gap-1 rounded-xl bg-DEFUALT_BLACK px-3 py-1.5 text-BRAND_COLOR text-xs font-semibold transition hover:opacity-80"
						>
							<Plus size={12} /> Add Goal
						</button>
					</div>

					{/* Goal form */}
					{showGoalForm && (
						<div className="mb-4 rounded-2xl border border-BRAND_COLOR/30 bg-BRAND_COLOR/5 p-4">
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="mb-1 block text-xs font-semibold dark:text-slate-300">
										Semester
									</label>
									{semesters.length > 0 ? (
										<select
											value={goalForm.semesterId}
											onChange={(e) => {
												const sem = semesters.find((s) => s.id === e.target.value);
												setGoalForm((f) => ({
													...f,
													semesterId: e.target.value,
													semesterName: sem?.name ?? "",
												}));
											}}
											className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
										>
											{semesters.map((s) => (
												<option key={s.id} value={s.id}>
													{s.name}
												</option>
											))}
										</select>
									) : (
										<input
											type="text"
											placeholder="e.g. Sem 1 2025"
											value={goalForm.semesterName}
											onChange={(e) =>
												setGoalForm((f) => ({ ...f, semesterName: e.target.value }))
											}
											className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
										/>
									)}
								</div>
								<div>
									<label className="mb-1 block text-xs font-semibold dark:text-slate-300">
										Target WAM (%)
									</label>
									<input
										type="number"
										min={0}
										max={100}
										value={goalForm.targetWAM}
										onChange={(e) =>
											setGoalForm((f) => ({ ...f, targetWAM: Number(e.target.value) }))
										}
										className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-semibold dark:text-slate-300">
										Target Grade
									</label>
									<select
										value={goalForm.targetGrade}
										onChange={(e) =>
											setGoalForm((f) => ({ ...f, targetGrade: e.target.value }))
										}
										className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
									>
										{["H1", "H2A", "H2B", "H3"].map((g) => (
											<option key={g}>{g}</option>
										))}
									</select>
								</div>
								<div>
									<label className="mb-1 block text-xs font-semibold dark:text-slate-300">
										Note
									</label>
									<input
										type="text"
										placeholder="Optional note"
										value={goalForm.note}
										onChange={(e) =>
											setGoalForm((f) => ({ ...f, note: e.target.value }))
										}
										className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
									/>
								</div>
							</div>
							<div className="mt-3 flex gap-2">
								<button
									type="button"
									onClick={saveGoal}
									className="flex items-center gap-1 rounded-xl bg-DEFUALT_BLACK px-4 py-2 text-BRAND_COLOR text-sm font-semibold transition hover:opacity-80"
								>
									<Check size={14} /> Save
								</button>
								<button
									type="button"
									onClick={() => setShowGoalForm(false)}
									className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-2 text-gray-600 text-sm font-semibold transition hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300"
								>
									<X size={14} /> Cancel
								</button>
							</div>
						</div>
					)}

					{goals.length === 0 && !showGoalForm ? (
						<div className="rounded-2xl bg-gray-50 p-6 text-center dark:bg-slate-800">
							<p className="text-gray-400 text-sm">No study goals set yet.</p>
							<button
								type="button"
								onClick={openAddGoal}
								className="mt-2 rounded-xl bg-DEFUALT_BLACK px-4 py-2 text-BRAND_COLOR text-xs font-semibold transition hover:opacity-80"
							>
								Set your first goal →
							</button>
						</div>
					) : (
						<div className="space-y-3">
							{goals.map((goal) => {
								const sem = semesters.find((s) => s.id === goal.semesterId);
								const actual = sem ? calculateSemesterGPA(sem.id) : null;
								const progress = actual !== null ? Math.min((actual / goal.targetWAM) * 100, 100) : 0;
								const achieved = actual !== null && actual >= goal.targetWAM;

								return (
									<div
										key={goal.id}
										className="rounded-2xl border border-gray-100 p-4 dark:border-slate-700"
									>
										<div className="flex items-start justify-between">
											<div>
												<p className="font-semibold text-sm dark:text-slate-100">
													{goal.semesterName || "Semester"}
												</p>
												<p className="text-gray-400 text-xs">
													Target: {goal.targetWAM}% ({goal.targetGrade})
												</p>
												{goal.note && (
													<p className="text-gray-400 text-xs italic">{goal.note}</p>
												)}
											</div>
											<div className="flex items-center gap-1">
												{achieved && (
													<span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-[10px] font-bold dark:bg-green-900/30 dark:text-green-400">
														✓ ACHIEVED
													</span>
												)}
												<button
													type="button"
													onClick={() => openEditGoal(goal)}
													className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700"
												>
													<Edit3 size={13} />
												</button>
												<button
													type="button"
													onClick={() => removeGoal(goal.id)}
													className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
												>
													<Trash2 size={13} />
												</button>
											</div>
										</div>
										{/* Progress bar */}
										<div className="mt-3">
											<div className="flex justify-between text-xs text-gray-400 mb-1">
												<span>Current: {actual !== null ? `${Math.round(actual)}%` : "No data"}</span>
												<span>{Math.round(progress)}%</span>
											</div>
											<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
												<div
													className="h-full rounded-full transition-all duration-500"
													style={{
														width: `${progress}%`,
														backgroundColor: achieved ? "#22c55e" : "#FFDC73",
													}}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</Card>
			)}


			{/* ── WAM Chart ── */}
			<Card>
				<div className="mb-4 flex items-center justify-between">
					<SectionTitle icon={<TrendingUp size={20} />} title="WAM Progress by Semester" />
					<Link
						href="/forall/wam-calculator"
						className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-gray-600 text-xs font-semibold transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR dark:bg-slate-800 dark:text-slate-300"
					>
						Open Calculator <ChevronRight size={12} />
					</Link>
				</div>
				{wamChartData.length === 0 ? (
					<div className="flex h-40 flex-col items-center justify-center rounded-2xl bg-gray-50 dark:bg-slate-800">
						<p className="text-gray-400 text-sm">No WAM data yet.</p>
						<Link
							href="/forall/wam-calculator"
							className="mt-2 rounded-xl bg-DEFUALT_BLACK px-4 py-2 text-BRAND_COLOR text-xs font-semibold transition hover:opacity-80"
						>
							Add your grades →
						</Link>
					</div>
				) : (
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={wamChartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="name" tick={{ fontSize: 11 }} />
								<YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
								<Tooltip
									formatter={(v: number, name: string) => [`${v}%`, name]}
									contentStyle={{
										borderRadius: "12px",
										border: "none",
										boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
									}}
								/>
								<Legend wrapperStyle={{ fontSize: 11 }} />
								<ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "H1 (80)", fontSize: 10, fill: "#22c55e" }} />
								<ReferenceLine y={70} stroke="#84cc16" strokeDasharray="4 4" label={{ value: "H2A (70)", fontSize: 10, fill: "#84cc16" }} />
								<Line
									type="monotone"
									dataKey="WAM"
									stroke="#FFDC73"
									strokeWidth={2.5}
									dot={{ fill: "#FFDC73", r: 5 }}
									activeDot={{ r: 7 }}
									connectNulls
								/>
								<Line
									type="monotone"
									dataKey="Goal"
									stroke="#6366f1"
									strokeWidth={2}
									strokeDasharray="5 5"
									dot={{ fill: "#6366f1", r: 4 }}
									activeDot={{ r: 6 }}
									connectNulls
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}

				{/* Per-semester breakdown */}
				{semesters.length > 0 && (
					<div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
						{semesters.map((sem) => {
							const gpa = calculateSemesterGPA(sem.id);
							return (
								<div
									key={sem.id}
									className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800"
								>
									<p className="truncate font-semibold text-xs dark:text-slate-300">
										{sem.name}
									</p>
									<p
										className="mt-1 font-black text-2xl"
										style={{ color: gradeColor(gpa) }}
									>
										{gpa !== null ? `${Math.round(gpa)}%` : "—"}
									</p>
									<p className="text-gray-400 text-xs">{gradeLabel(gpa)}</p>
								</div>
							);
						})}
					</div>
				)}
			</Card>

			{/* ── Weekly Calendar ── */}
			<Card>
				<div className="mb-4 flex items-center justify-between">
					<SectionTitle icon={<CalendarDays size={20} />} title="Weekly Schedule" />
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setWeekOffset((o) => o - 1)}
							className="rounded-xl bg-gray-100 px-3 py-1.5 text-gray-600 text-xs font-semibold transition hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300"
						>
							← Prev
						</button>
						<button
							type="button"
							onClick={() => setWeekOffset(0)}
							className="rounded-xl bg-DEFUALT_BLACK px-3 py-1.5 text-BRAND_COLOR text-xs font-semibold transition hover:opacity-80"
						>
							This Week
						</button>
						<button
							type="button"
							onClick={() => setWeekOffset((o) => o + 1)}
							className="rounded-xl bg-gray-100 px-3 py-1.5 text-gray-600 text-xs font-semibold transition hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300"
						>
							Next →
						</button>
						<Link
							href="/forall/calendar"
							className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-gray-600 text-xs font-semibold transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR dark:bg-slate-800 dark:text-slate-300"
						>
							Full Calendar <ChevronRight size={12} />
						</Link>
					</div>
				</div>

				{vEventLists.length === 0 ? (
					<div className="rounded-2xl bg-gray-50 p-6 text-center dark:bg-slate-800">
						<p className="text-gray-400 text-sm">No calendar events loaded.</p>
						<Link
							href="/forall/calendar"
							className="mt-2 inline-block rounded-xl bg-DEFUALT_BLACK px-4 py-2 text-BRAND_COLOR text-xs font-semibold transition hover:opacity-80"
						>
							Upload ICS file →
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto -mx-1 pb-2">
					<div className="grid grid-cols-7 gap-1.5 min-w-[380px] px-1">
						{weekDays.map((day, i) => {
							const isToday = sameDay(day, now);
							const dayEvents = weeklyEvents.filter((ev) =>
								sameDay(new Date(ev.start), day),
							);
							return (
								<div
									key={day.toISOString()}
									className={`rounded-2xl p-2 ${
										isToday
											? "bg-DEFUALT_BLACK text-white"
											: "bg-gray-50 dark:bg-slate-800"
									}`}
								>
									<p
										className={`text-center font-semibold text-xs ${
											isToday ? "text-BRAND_COLOR" : "text-gray-400 dark:text-slate-400"
										}`}
									>
										{WEEKDAYS[i]}
									</p>
									<p
										className={`text-center font-black text-lg ${
											isToday ? "text-BRAND_COLOR" : "dark:text-slate-100"
										}`}
									>
										{day.getDate()}
									</p>
									<div className="mt-1 space-y-1">
										{dayEvents.slice(0, 3).map((ev) => (
						<div
							key={ev.resource?.id ?? ev.title}
							className={`rounded-lg px-1.5 py-0.5 ${
								isToday
									? "bg-white/90"
									: "bg-BRAND_COLOR/20"
							}`}
						>
							<p className={`truncate text-[9px] font-semibold ${
								isToday
									? "text-gray-900"
									: "text-DEFUALT_BLACK dark:text-BRAND_COLOR"
							}`}>
								{ev.title}
							</p>
						</div>
										))}
										{dayEvents.length > 3 && (
											<p className="text-center text-[9px] text-gray-400">
												+{dayEvents.length - 3} more
											</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				)}
			</Card>

			{/* ── My Photos ── */}
			{!isAdmin && <MyPhotosSection currentUserId={userId} />}
		</div>
	);
}

// ─── My Photos Section ────────────────────────────────────────────────────────
function MyPhotosSection({ currentUserId }: { currentUserId: string | null }) {
	const { addUserPhoto, removeUserPhoto, getUserPhotos, getCurrentUser, updatePhotoStatus, markPhotoSubmitted, userPhotos, currentUserId: storeUserId } = useUserStore();
	const { submitUserPhoto } = useAdminStore();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [caption, setCaption] = useState("");
	const [preview, setPreview] = useState<string | null>(null);
	const [lightbox, setLightbox] = useState<string | null>(null);
	// Local set of submitted photo IDs for instant UI feedback
	const [submittedIds, setSubmittedIds] = useState<Set<string>>(() => {
		const uid = currentUserId ?? storeUserId;
		const already = userPhotos.filter((p) => p.userId === uid && p.submitted).map((p) => p.id);
		return new Set(already);
	});

	// Directly subscribe to userPhotos for reactive re-render
	const myPhotos = userPhotos.filter((p) => p.userId === (currentUserId ?? storeUserId));

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			alert("File size must be under 5MB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = (ev) => setPreview(ev.target?.result as string);
		reader.readAsDataURL(file);
	};

	const handleUpload = () => {
		if (!preview || !currentUserId) return;
		addUserPhoto({ userId: currentUserId, src: preview, caption });
		setPreview(null);
		setCaption("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSubmitToGallery = (photo: { id: string; submitted?: boolean; src: string; caption: string }) => {
		if (!currentUserId || submittedIds.has(photo.id)) return;
		// Instantly update local UI state
		setSubmittedIds((prev) => new Set([...prev, photo.id]));
		const user = getCurrentUser();
		submitUserPhoto({
			userId: currentUserId,
			username: user?.username || currentUserId,
			displayName: user?.displayName || user?.username || currentUserId,
			src: photo.src,
			caption: photo.caption,
		});
		markPhotoSubmitted(photo.id);
	};

	const statusBadge = (status: string) => {
		if (status === "approved") return (
			<span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-[10px] font-bold dark:bg-green-900/30 dark:text-green-400">
				<CheckCircle2 size={10} /> Approved
			</span>
		);
		if (status === "rejected") return (
			<span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-600 text-[10px] font-bold dark:bg-red-900/30 dark:text-red-400">
				<XCircle size={10} /> Rejected
			</span>
		);
		return (
			<span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-700 text-[10px] font-bold dark:bg-yellow-900/30 dark:text-yellow-400">
				<Clock3 size={10} /> Pending Review
			</span>
		);
	};

	return (
		<>
		<Card>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-BRAND_COLOR"><Camera size={20} /></span>
					<h2 className="font-bold text-lg dark:text-slate-100">My Photos</h2>
				</div>
				<span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500 text-xs dark:bg-slate-800 dark:text-slate-400">
					{myPhotos.length} photo{myPhotos.length !== 1 ? "s" : ""}
				</span>
			</div>

			{/* Upload area */}
			<div className="mb-5 rounded-2xl border-2 border-dashed border-gray-200 p-4 dark:border-slate-700">
				<p className="mb-3 font-semibold text-sm text-gray-600 dark:text-slate-300">Upload a new photo</p>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
					<div className="flex-1 space-y-2">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-xl file:border-0 file:bg-DEFUALT_BLACK file:px-4 file:py-2 file:text-BRAND_COLOR file:font-semibold file:text-xs hover:file:opacity-80 dark:text-slate-400"
						/>
						<input
							type="text"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder="Add a caption (optional)"
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-BRAND_COLOR focus:ring-2 focus:ring-BRAND_COLOR/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
						/>
					</div>
					{preview && (
						<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
							<Image src={preview} alt="preview" fill className="object-cover" sizes="80px" />
						</div>
					)}
					<button
						type="button"
						onClick={handleUpload}
						disabled={!preview}
						className="flex items-center gap-2 rounded-xl bg-DEFUALT_BLACK px-5 py-2.5 font-semibold text-BRAND_COLOR text-sm transition hover:opacity-80 disabled:opacity-40"
					>
						<Upload size={15} />
						Upload
					</button>
				</div>
			</div>

			{/* Photo grid */}
			{myPhotos.length === 0 ? (
				<div className="rounded-2xl bg-gray-50 p-8 text-center dark:bg-slate-800">
					<Camera size={32} className="mx-auto mb-2 text-gray-300 dark:text-slate-600" />
					<p className="text-gray-400 text-sm">No photos yet. Upload your first photo!</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{myPhotos.map((photo) => (
						<div key={photo.id} className="group relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800">
							<button
								type="button"
								onClick={() => setLightbox(photo.src)}
								className="relative block aspect-square w-full overflow-hidden"
							>
								<Image src={photo.src} alt={photo.caption || "My photo"} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
							</button>
							<div className="p-2">
								<div className="flex items-center justify-between gap-1">
									{statusBadge(photo.status)}
									<button
										type="button"
										onClick={() => removeUserPhoto(photo.id)}
										className="rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
										title="Delete photo"
									>
										<Trash2 size={12} />
									</button>
								</div>
								{photo.caption && (
									<p className="mt-1 truncate text-[11px] text-gray-500 dark:text-slate-400">{photo.caption}</p>
								)}
								<p className="text-[10px] text-gray-400 dark:text-slate-500">
									{new Date(photo.uploadedAt).toLocaleDateString()}
								</p>
					{/* Submit to Gallery button */}
					{!submittedIds.has(photo.id) ? (
						<button
							type="button"
							onClick={() => handleSubmitToGallery(photo)}
							className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg bg-DEFUALT_BLACK px-2 py-1.5 text-BRAND_COLOR text-[10px] font-bold transition hover:opacity-80"
						>
							<Globe size={10} /> Submit to Gallery
						</button>
					) : (
						<div className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg bg-green-500 px-2 py-1.5 text-white text-[10px] font-bold cursor-not-allowed">
							<CheckCircle2 size={10} /> Submitted!
						</div>
					)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Info note */}
			<div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/10">
				<Globe size={14} className="mt-0.5 flex-shrink-0 text-blue-500" />
				<p className="text-blue-700 text-xs dark:text-blue-400">
					Upload photos to your personal gallery. Click "Submit to Gallery" on each photo to send it to Admin for review. Once approved, it will appear in the Global Gallery.
				</p>
			</div>
		</Card>

		{/* Lightbox */}
		{lightbox && (
			<div
				className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
				onClick={() => setLightbox(null)}
			>
				<button
					type="button"
					onClick={() => setLightbox(null)}
					className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
				>
					<X size={20} />
				</button>
				<div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
					<Image src={lightbox} alt="Photo" width={1200} height={900} className="max-h-[85vh] w-auto rounded-2xl object-contain" />
				</div>
			</div>
		)}
		</>
	);
}
