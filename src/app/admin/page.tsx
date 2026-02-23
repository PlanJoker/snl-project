"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@stores/authStore";
import { useAdminStore, type Announcement, type Session } from "@stores/adminStore";
import { useUserStore } from "@stores/userStore";
import {
	Megaphone, CalendarDays, Images, Plus, Trash2, Edit3,
	Pin, PinOff, Eye, EyeOff, LogOut, Shield, X, Check, ChevronRight,
	Users, CheckCircle2, XCircle, Clock3,
} from "lucide-react";
import Image from "next/image";

type Tab = "announcements" | "sessions" | "gallery" | "user-photos";

export default function AdminPage() {
	const { isLoggedIn, isAdmin, logout } = useAuthStore();
	const router = useRouter();
	const [tab, setTab] = useState<Tab>("announcements");

	useEffect(() => {
		if (!isLoggedIn || !isAdmin) {
			router.replace("/");
		}
	}, [isLoggedIn, isAdmin, router]);

	if (!isLoggedIn || !isAdmin) return null;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
			{/* Header */}
			<div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#1a1d27]/90">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-DEFUALT_BLACK">
							<Shield size={18} className="text-BRAND_COLOR" />
						</div>
						<div>
							<p className="font-bold text-gray-900 text-sm dark:text-white">Admin Dashboard</p>
							<p className="text-gray-400 text-xs">Saturday Normal Library</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => { logout(); router.push("/"); }}
						className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-gray-600 text-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400"
					>
						<LogOut size={15} />
						Logout
					</button>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-6 py-8">
				{/* Tab nav */}
				<div className="mb-8 flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm dark:bg-[#1e2130]">
					{([
						{ id: "announcements", icon: <Megaphone size={16} />, label: "Announcements" },
						{ id: "sessions", icon: <CalendarDays size={16} />, label: "Sessions" },
						{ id: "gallery", icon: <Images size={16} />, label: "Gallery" },
					] as { id: Tab; icon: React.ReactNode; label: string }[]).map((t) => (
						<button
							key={t.id}
							type="button"
							onClick={() => setTab(t.id)}
							className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-sm transition ${
								tab === t.id
									? "bg-DEFUALT_BLACK text-BRAND_COLOR shadow"
									: "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
							}`}
						>
							{t.icon}
							{t.label}
						</button>
					))}
				</div>

				{tab === "announcements" && <AnnouncementsTab />}
				{tab === "sessions" && <SessionsTab />}
				{tab === "gallery" && <GalleryTab />}
			{tab === "user-photos" && <UserPhotosTab />}
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Announcements Tab
───────────────────────────────────────────── */
function AnnouncementsTab() {
	const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdminStore();
	const [editing, setEditing] = useState<Announcement | null>(null);
	const [creating, setCreating] = useState(false);
	const [form, setForm] = useState({ title: "", content: "", pinned: false });

	const openCreate = () => { setForm({ title: "", content: "", pinned: false }); setCreating(true); };
	const openEdit = (a: Announcement) => { setEditing(a); setForm({ title: a.title, content: a.content, pinned: a.pinned }); };

	const handleSave = () => {
		if (editing) {
			updateAnnouncement(editing.id, form);
			setEditing(null);
		} else {
			addAnnouncement(form);
			setCreating(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-gray-900 text-xl dark:text-white">Announcements</h2>
				<button
					type="button"
					onClick={openCreate}
					className="flex items-center gap-2 rounded-xl bg-DEFUALT_BLACK px-4 py-2 font-semibold text-BRAND_COLOR text-sm transition hover:bg-[#023d39]"
				>
					<Plus size={16} />
					New Announcement
				</button>
			</div>

			{/* Form modal */}
			{(creating || editing) && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#1e2130]">
						<h3 className="mb-5 font-bold text-gray-900 text-lg dark:text-white">
							{editing ? "Edit Announcement" : "New Announcement"}
						</h3>
						<div className="space-y-4">
							<div>
								<label className="mb-1 block font-semibold text-gray-700 text-sm dark:text-slate-300">Title</label>
								<input
									value={form.title}
									onChange={(e) => setForm({ ...form, title: e.target.value })}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
									placeholder="Announcement title"
								/>
							</div>
							<div>
								<label className="mb-1 block font-semibold text-gray-700 text-sm dark:text-slate-300">Content</label>
								<textarea
									value={form.content}
									onChange={(e) => setForm({ ...form, content: e.target.value })}
									rows={4}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
									placeholder="Write your announcement..."
								/>
							</div>
							<label className="flex cursor-pointer items-center gap-3">
								<div
									onClick={() => setForm({ ...form, pinned: !form.pinned })}
									className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${form.pinned ? "border-BRAND_COLOR bg-BRAND_COLOR" : "border-gray-300"}`}
								>
									{form.pinned && <Check size={12} className="text-DEFUALT_BLACK" />}
								</div>
								<span className="font-semibold text-gray-700 text-sm dark:text-slate-300">Pin to top</span>
							</label>
						</div>
						<div className="mt-6 flex gap-3">
							<button
								type="button"
								onClick={() => { setCreating(false); setEditing(null); }}
								className="flex-1 rounded-xl border border-gray-200 py-2.5 font-semibold text-gray-600 text-sm transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSave}
								disabled={!form.title || !form.content}
								className="flex-1 rounded-xl bg-DEFUALT_BLACK py-2.5 font-semibold text-BRAND_COLOR text-sm transition hover:bg-[#023d39] disabled:opacity-40"
							>
								{editing ? "Save Changes" : "Post"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* List */}
			{announcements.length === 0 && (
				<div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center text-gray-400 dark:border-slate-700">
					No announcements yet. Create your first one!
				</div>
			)}
			<div className="space-y-3">
				{announcements.map((a) => (
					<div key={a.id} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-[#1e2130]">
						{a.pinned && <Pin size={16} className="mt-0.5 flex-shrink-0 text-BRAND_COLOR" />}
						{!a.pinned && <Megaphone size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />}
						<div className="flex-1 min-w-0">
							<p className="font-bold text-gray-900 text-sm dark:text-white">{a.title}</p>
							<p className="mt-1 text-gray-500 text-sm line-clamp-2 dark:text-slate-400">{a.content}</p>
							<p className="mt-2 text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</p>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => updateAnnouncement(a.id, { pinned: !a.pinned })}
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-BRAND_COLOR hover:text-DEFUALT_BLACK dark:bg-slate-700 dark:text-slate-400"
								title={a.pinned ? "Unpin" : "Pin"}
							>
								{a.pinned ? <PinOff size={14} /> : <Pin size={14} />}
							</button>
							<button
								type="button"
								onClick={() => openEdit(a)}
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-400"
							>
								<Edit3 size={14} />
							</button>
							<button
								type="button"
								onClick={() => deleteAnnouncement(a.id)}
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-100 hover:text-red-600 dark:bg-slate-700 dark:text-slate-400"
							>
								<Trash2 size={14} />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Sessions Tab
───────────────────────────────────────────── */
function SessionsTab() {
	const { sessions, addSession, updateSession, deleteSession } = useAdminStore();
	const [editing, setEditing] = useState<Session | null>(null);
	const [creating, setCreating] = useState(false);
	const emptyForm = { date: "", startTime: "13:00", endTime: "18:00", location: "o3space@brunswick", topic: "", maxAttendees: 30, notes: "" };
	const [form, setForm] = useState(emptyForm);

	const openCreate = () => { setForm(emptyForm); setCreating(true); };
	const openEdit = (s: Session) => { setEditing(s); setForm({ date: s.date, startTime: s.startTime, endTime: s.endTime, location: s.location, topic: s.topic, maxAttendees: s.maxAttendees, notes: s.notes }); };

	const handleSave = () => {
		if (editing) { updateSession(editing.id, form); setEditing(null); }
		else { addSession(form); setCreating(false); }
	};

	const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-gray-900 text-xl dark:text-white">Sessions</h2>
				<button
					type="button"
					onClick={openCreate}
					className="flex items-center gap-2 rounded-xl bg-DEFUALT_BLACK px-4 py-2 font-semibold text-BRAND_COLOR text-sm transition hover:bg-[#023d39]"
				>
					<Plus size={16} />
					New Session
				</button>
			</div>

			{/* Form modal */}
			{(creating || editing) && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#1e2130] max-h-[90vh] overflow-y-auto">
						<h3 className="mb-5 font-bold text-gray-900 text-lg dark:text-white">
							{editing ? "Edit Session" : "New Session"}
						</h3>
						<div className="space-y-4">
							{[
								{ label: "Date", key: "date", type: "date" },
								{ label: "Start Time", key: "startTime", type: "time" },
								{ label: "End Time", key: "endTime", type: "time" },
								{ label: "Location", key: "location", type: "text" },
								{ label: "Topic / Theme", key: "topic", type: "text" },
								{ label: "Max Attendees", key: "maxAttendees", type: "number" },
							].map(({ label, key, type }) => (
								<div key={key}>
									<label className="mb-1 block font-semibold text-gray-700 text-sm dark:text-slate-300">{label}</label>
									<input
										type={type}
										value={String((form as Record<string, unknown>)[key] ?? "")}
										onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
										className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
									/>
								</div>
							))}
							<div>
								<label className="mb-1 block font-semibold text-gray-700 text-sm dark:text-slate-300">Notes</label>
								<textarea
									value={form.notes}
									onChange={(e) => setForm({ ...form, notes: e.target.value })}
									rows={3}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
								/>
							</div>
						</div>
						<div className="mt-6 flex gap-3">
							<button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 font-semibold text-gray-600 text-sm dark:border-slate-700 dark:text-slate-400">Cancel</button>
							<button type="button" onClick={handleSave} disabled={!form.date || !form.topic} className="flex-1 rounded-xl bg-DEFUALT_BLACK py-2.5 font-semibold text-BRAND_COLOR text-sm hover:bg-[#023d39] disabled:opacity-40">
								{editing ? "Save" : "Create"}
							</button>
						</div>
					</div>
				</div>
			)}

			{sorted.length === 0 && (
				<div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center text-gray-400 dark:border-slate-700">
					No sessions scheduled yet.
				</div>
			)}
			<div className="space-y-3">
				{sorted.map((s) => {
					const isPast = new Date(s.date) < new Date(new Date().toDateString());
					return (
						<div key={s.id} className={`flex items-start gap-4 rounded-2xl p-5 shadow-sm ${isPast ? "bg-gray-50 opacity-60 dark:bg-slate-900" : "bg-white dark:bg-[#1e2130]"}`}>
							<div className="flex-shrink-0 rounded-xl bg-DEFUALT_BLACK px-3 py-2 text-center">
								<p className="font-bold text-BRAND_COLOR text-xs">{new Date(s.date + "T00:00").toLocaleDateString("en-AU", { month: "short" }).toUpperCase()}</p>
								<p className="font-bold text-white text-xl leading-none">{new Date(s.date + "T00:00").getDate()}</p>
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-bold text-gray-900 text-sm dark:text-white">{s.topic || "Open Study Session"}</p>
								<p className="mt-0.5 text-gray-500 text-xs">{s.startTime} – {s.endTime} · {s.location}</p>
								{s.notes && <p className="mt-1 text-gray-400 text-xs line-clamp-1">{s.notes}</p>}
								<p className="mt-1 text-gray-400 text-xs">Max {s.maxAttendees} attendees</p>
							</div>
							<div className="flex gap-2">
								<button type="button" onClick={() => openEdit(s)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-400"><Edit3 size={14} /></button>
								<button type="button" onClick={() => deleteSession(s.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:bg-slate-700 dark:text-slate-400"><Trash2 size={14} /></button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Gallery Tab
───────────────────────────────────────────── */
function GalleryTab() {
	const { galleryPhotos, initGallery, updatePhotoCaption, togglePhotoVisibility } = useAdminStore();
	const [editingCaption, setEditingCaption] = useState<string | null>(null);
	const [captionVal, setCaptionVal] = useState("");

	// Gallery file map with correct extensions
	const GALLERY_FILES: { id: string; src: string }[] = [
		{ id: "photo-01", src: "/gallery/snl-image-1.png" },
		{ id: "photo-02", src: "/gallery/snl-image-2.jpg" },
		{ id: "photo-03", src: "/gallery/snl-image-3.jpg" },
		{ id: "photo-04", src: "/gallery/snl-image-4.jpg" },
		{ id: "photo-05", src: "/gallery/snl-image-5.webp" },
		{ id: "photo-06", src: "/gallery/snl-image-6.jpg" },
		{ id: "photo-07", src: "/gallery/snl-image-7.jpg" },
		{ id: "photo-08", src: "/gallery/snl-image-8.jpg" },
		{ id: "photo-09", src: "/gallery/snl-image-9.jpg" },
		{ id: "photo-10", src: "/gallery/snl-image-10.jpg" },
		{ id: "photo-11", src: "/gallery/snl-image-11.jpg" },
		{ id: "photo-12", src: "/gallery/snl-image-12.jpg" },
		{ id: "photo-13", src: "/gallery/snl-image-13.jpg" },
		{ id: "photo-14", src: "/gallery/snl-image-14.jpg" },
		{ id: "photo-15", src: "/gallery/snl-image-15.jpg" },
		{ id: "photo-16", src: "/gallery/snl-image-16.jpg" },
		{ id: "photo-17", src: "/gallery/snl-image-17.jpg" },
		{ id: "photo-18", src: "/gallery/snl-image-18.jpg" },
		{ id: "photo-19", src: "/gallery/snl-image-19.jpg" },
		{ id: "photo-20", src: "/gallery/snl-image-20.jpg" },
		{ id: "photo-21", src: "/gallery/snl-image-21.jpg" },
		{ id: "photo-22", src: "/gallery/snl-image-22.jpg" },
		{ id: "photo-23", src: "/gallery/snl-image-23.jpg" },
		{ id: "photo-24", src: "/gallery/snl-image-24.jpg" },
		{ id: "photo-25", src: "/gallery/snl-image-25.jpg" },
		{ id: "photo-26", src: "/gallery/snl-image-26.jpg" },
		{ id: "photo-27", src: "/gallery/snl-image-27.jpg" },
		{ id: "photo-28", src: "/gallery/snl-image-28.jpg" },
		{ id: "photo-29", src: "/gallery/snl-image-29.jpg" },
		{ id: "photo-30", src: "/gallery/snl-image-30.jpg" },
		{ id: "photo-31", src: "/gallery/snl-image-31.jpg" },
		{ id: "photo-32", src: "/gallery/snl-image-32.jpg" },
		{ id: "photo-33", src: "/gallery/snl-image-33.jpg" },
		{ id: "photo-34", src: "/gallery/snl-image-34.jpg" },
		{ id: "photo-35", src: "/gallery/snl-image-35.jpg" },
		{ id: "photo-36", src: "/gallery/snl-image-36.jpg" },
		{ id: "photo-37", src: "/gallery/snl-image-37.jpg" },
	];

	// Always re-seed gallery with correct paths on mount
	useEffect(() => {
		const needsInit = galleryPhotos.length === 0 || !galleryPhotos[0]?.src?.includes("snl-image");
		if (needsInit) {
			const files = GALLERY_FILES.map((f) => ({
				...f,
				caption: "",
				visible: true,
				uploadedAt: new Date().toISOString(),
			}));
			initGallery(files);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const openCaption = (id: string, current: string) => {
		setEditingCaption(id);
		setCaptionVal(current);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-gray-900 text-xl dark:text-white">Gallery Management</h2>
				<p className="text-gray-400 text-sm">{galleryPhotos.filter((p) => p.visible).length} / {galleryPhotos.length} visible</p>
			</div>

			{editingCaption && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#1e2130]">
						<h3 className="mb-4 font-bold text-gray-900 dark:text-white">Edit Caption</h3>
						<textarea
							value={captionVal}
							onChange={(e) => setCaptionVal(e.target.value)}
							rows={3}
							className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							placeholder="Add a caption..."
						/>
						<div className="mt-4 flex gap-3">
							<button type="button" onClick={() => setEditingCaption(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm dark:border-slate-700">Cancel</button>
							<button type="button" onClick={() => { updatePhotoCaption(editingCaption, captionVal); setEditingCaption(null); }} className="flex-1 rounded-xl bg-DEFUALT_BLACK py-2.5 font-semibold text-BRAND_COLOR text-sm">Save</button>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{galleryPhotos.map((photo) => (
					<div key={photo.id} className={`group relative overflow-hidden rounded-2xl ${!photo.visible ? "opacity-40" : ""}`}>
						<div className="aspect-square bg-gray-100 dark:bg-slate-800">
							<Image
								src={photo.src}
								alt={photo.caption || photo.id}
								fill
								className="object-cover"
								sizes="200px"
								onError={() => {}}
							/>
						</div>
						{/* Overlay controls */}
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
							<button
								type="button"
								onClick={() => togglePhotoVisibility(photo.id)}
								className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-white text-xs backdrop-blur transition hover:bg-white/40"
							>
								{photo.visible ? <EyeOff size={12} /> : <Eye size={12} />}
								{photo.visible ? "Hide" : "Show"}
							</button>
							<button
								type="button"
								onClick={() => openCaption(photo.id, photo.caption)}
								className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-white text-xs backdrop-blur transition hover:bg-white/40"
							>
								<Edit3 size={12} />
								Caption
							</button>
						</div>
						{photo.caption && (
							<div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
								<p className="truncate text-white text-xs">{photo.caption}</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// ─── User Photos Review Tab ───────────────────────────────────────────────────
function UserPhotosTab() {
	const { userPhotos, updatePhotoStatus, users } = useUserStore();
	const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

	const filtered = userPhotos.filter((p) => filter === "all" ? true : p.status === filter);
	const pendingCount = userPhotos.filter((p) => p.status === "pending").length;

	const getUserName = (userId: string) => {
		const user = users.find((u) => u.id === userId);
		return user ? (user.displayName || user.username) : "Unknown User";
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-gray-900 text-xl dark:text-white">User Photo Review</h2>
					<p className="text-gray-400 text-sm mt-0.5">
						Approve or reject user-submitted photos for the Global Gallery.
					</p>
				</div>
				{pendingCount > 0 && (
					<span className="rounded-full bg-yellow-100 px-3 py-1.5 font-bold text-yellow-700 text-sm dark:bg-yellow-900/30 dark:text-yellow-400">
						{pendingCount} pending
					</span>
				)}
			</div>

			{/* Filter tabs */}
			<div className="flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm dark:bg-[#1e2130]">
				{(["all", "pending", "approved", "rejected"] as const).map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-semibold text-sm transition capitalize ${
							filter === f
								? "bg-DEFUALT_BLACK text-BRAND_COLOR shadow"
								: "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
						}`}
					>
						{f === "pending" && <Clock3 size={13} />}
						{f === "approved" && <CheckCircle2 size={13} />}
						{f === "rejected" && <XCircle size={13} />}
						{f} {f !== "all" && `(${userPhotos.filter(p => p.status === f).length})`}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="rounded-2xl bg-gray-50 p-12 text-center dark:bg-[#1e2130]">
					<Users size={32} className="mx-auto mb-3 text-gray-300 dark:text-slate-600" />
					<p className="text-gray-400 text-sm">No {filter === "all" ? "" : filter} photos.</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{filtered.map((photo) => (
						<div key={photo.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1e2130]">
							{/* Photo */}
							<div className="relative aspect-square bg-gray-100 dark:bg-slate-800">
								<Image
									src={photo.src}
									alt={photo.caption || "User photo"}
									fill
									className="object-cover"
									sizes="200px"
								/>
								{/* Status badge overlay */}
								<div className="absolute top-2 left-2">
									{photo.status === "approved" && (
										<span className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-white text-[10px] font-bold shadow">
											<CheckCircle2 size={9} /> Approved
										</span>
									)}
									{photo.status === "rejected" && (
										<span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-white text-[10px] font-bold shadow">
											<XCircle size={9} /> Rejected
										</span>
									)}
									{photo.status === "pending" && (
										<span className="flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-yellow-900 text-[10px] font-bold shadow">
											<Clock3 size={9} /> Pending
										</span>
									)}
								</div>
							</div>
							{/* Info */}
							<div className="p-3">
								<p className="font-semibold text-xs text-gray-700 dark:text-slate-300 truncate">
									{getUserName(photo.userId)}
								</p>
								{photo.caption && (
									<p className="text-[11px] text-gray-500 dark:text-slate-400 truncate mt-0.5">{photo.caption}</p>
								)}
								<p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
									{new Date(photo.uploadedAt).toLocaleDateString()}
								</p>
								{/* Action buttons */}
								<div className="mt-2 flex gap-1.5">
									<button
										type="button"
										onClick={() => updatePhotoStatus(photo.id, "approved")}
										disabled={photo.status === "approved"}
										className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-50 py-1.5 text-green-700 text-xs font-semibold transition hover:bg-green-100 disabled:opacity-40 dark:bg-green-900/20 dark:text-green-400"
									>
										<Check size={11} /> Approve
									</button>
									<button
										type="button"
										onClick={() => updatePhotoStatus(photo.id, "rejected")}
										disabled={photo.status === "rejected"}
										className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 py-1.5 text-red-600 text-xs font-semibold transition hover:bg-red-100 disabled:opacity-40 dark:bg-red-900/20 dark:text-red-400"
									>
										<X size={11} /> Reject
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
