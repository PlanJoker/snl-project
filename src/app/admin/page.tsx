"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@stores/authStore";
import { useAdminStore, type Announcement, type Session } from "@stores/adminStore";
import { useThemeStore } from "@stores/themeStore";
import {
	Megaphone, CalendarDays, Images, Plus, Trash2, Edit3,
	Pin, PinOff, Eye, EyeOff, LogOut, Shield, X, Check, ChevronRight,
	Users, CheckCircle2, XCircle, Clock3, Upload,
	Calculator, Home, Settings, Moon, Sun, Lock,
} from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

type Tab = "announcements" | "sessions" | "gallery" | "user-photos";

export default function AdminPage() {
	const { isLoggedIn, isAdmin, logout } = useAuthStore();
	const router = useRouter();
	const { userSubmittedPhotos } = useAdminStore();
	const [tab, setTab] = useState<Tab>("announcements");
	const pendingCount = userSubmittedPhotos.filter((p) => p.status === "pending").length;

	useEffect(() => {
		if (!isLoggedIn || !isAdmin) {
			router.replace("/");
		}
	}, [isLoggedIn, isAdmin, router]);

		if (!isLoggedIn || !isAdmin) return null;
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
			<AdminSideNav />
			<AdminMobileTabBar />
			<div className="pb-24 md:pb-0 md:ml-64">
			<div className="px-4 pt-20 pb-6 sm:px-6 sm:pt-24 sm:pb-8">
				{/* Tab nav */}
				<div className="mb-6 flex gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm dark:bg-[#1e2130] sm:mb-8 sm:gap-2">
					{([
						{ id: "announcements", icon: <Megaphone size={15} />, label: "Announcements" },
						{ id: "sessions", icon: <CalendarDays size={15} />, label: "Sessions" },
						{ id: "gallery", icon: <Images size={15} />, label: "Gallery" },
						{ id: "user-photos", icon: <Users size={15} />, label: "Photo Review", badge: pendingCount },
					] as { id: Tab; icon: React.ReactNode; label: string; badge?: number }[]).map((t) => (
						<button
							key={t.id}
							type="button"
							onClick={() => setTab(t.id)}
							className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-semibold text-xs transition sm:gap-2 sm:text-sm ${
								tab === t.id
									? "bg-DEFUALT_BLACK text-BRAND_COLOR shadow"
									: "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
							}`}
						>
							{t.icon}
							<span className="hidden sm:inline">{t.label}</span>
							<span className="sm:hidden">{t.label.split(" ")[0]}</span>
							{t.badge != null && t.badge > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
									{t.badge}
								</span>
							)}
						</button>
					))}
				</div>

			{tab === "announcements" && <AnnouncementsTab />}
			{tab === "sessions" && <SessionsTab />}
			{tab === "gallery" && <GalleryTab />}
			{tab === "user-photos" && <UserPhotosTab />}
			</div>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Announcements Tab
───────────────────────────────────────────── */
function AnnouncementsTab() {
	const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdminStore();
	const [creating, setCreating] = useState(false);
	const [editing, setEditing] = useState<Announcement | null>(null);
	const blank = { title: "", content: "", pinned: false };
	const [form, setForm] = useState(blank);

	const openCreate = () => { setForm(blank); setCreating(true); };
	const openEdit = (a: Announcement) => { setForm({ title: a.title, content: a.content, pinned: a.pinned }); setEditing(a); };
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
					New
				</button>
			</div>

			{(creating || editing) && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1e2130] sm:p-8">
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
							<button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 font-semibold text-gray-600 text-sm transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400">Cancel</button>
							<button type="button" onClick={handleSave} disabled={!form.title || !form.content} className="flex-1 rounded-xl bg-DEFUALT_BLACK py-2.5 font-semibold text-BRAND_COLOR text-sm transition hover:bg-[#023d39] disabled:opacity-40">
								{editing ? "Save Changes" : "Post"}
							</button>
						</div>
					</div>
				</div>
			)}

			{announcements.length === 0 && (
				<div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center text-gray-400 dark:border-slate-700">
					No announcements yet. Create your first one!
				</div>
			)}
			<div className="space-y-3">
				{announcements.map((a) => (
					<div key={a.id} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1e2130] sm:p-5">
						{a.pinned ? <Pin size={16} className="mt-0.5 flex-shrink-0 text-BRAND_COLOR" /> : <Megaphone size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />}
						<div className="flex-1 min-w-0">
							<p className="font-bold text-gray-900 text-sm dark:text-white">{a.title}</p>
							<p className="mt-1 text-gray-500 text-sm line-clamp-2 dark:text-slate-400">{a.content}</p>
							<p className="mt-2 text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</p>
						</div>
						<div className="flex gap-2">
							<button type="button" onClick={() => updateAnnouncement(a.id, { pinned: !a.pinned })} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-BRAND_COLOR hover:text-DEFUALT_BLACK dark:bg-slate-700 dark:text-slate-400" title={a.pinned ? "Unpin" : "Pin"}>
								{a.pinned ? <PinOff size={14} /> : <Pin size={14} />}
							</button>
							<button type="button" onClick={() => openEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-400"><Edit3 size={14} /></button>
							<button type="button" onClick={() => deleteAnnouncement(a.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-100 hover:text-red-600 dark:bg-slate-700 dark:text-slate-400"><Trash2 size={14} /></button>
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
	const [creating, setCreating] = useState(false);
	const [editing, setEditing] = useState<Session | null>(null);
	const blank: Omit<Session, "id"> = { date: "", startTime: "13:00", endTime: "18:00", location: "", topic: "", maxAttendees: 30, notes: "" };
	const [form, setForm] = useState<Omit<Session, "id">>(blank);
	const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

	const openCreate = () => { setForm(blank); setCreating(true); };
	const openEdit = (s: Session) => { const { id: _id, ...rest } = s; setForm(rest); setEditing(s); };
	const handleSave = () => {
		if (editing) { updateSession(editing.id, form); setEditing(null); }
		else { addSession(form); setCreating(false); }
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-gray-900 text-xl dark:text-white">Sessions</h2>
				<button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-DEFUALT_BLACK px-4 py-2 font-semibold text-BRAND_COLOR text-sm transition hover:bg-[#023d39]">
					<Plus size={16} />New Session
				</button>
			</div>

			{(creating || editing) && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1e2130] max-h-[90vh] overflow-y-auto sm:p-8">
						<h3 className="mb-5 font-bold text-gray-900 text-lg dark:text-white">{editing ? "Edit Session" : "New Session"}</h3>
						<div className="space-y-4">
							{([
								{ label: "Date", key: "date", type: "date" },
								{ label: "Start Time", key: "startTime", type: "time" },
								{ label: "End Time", key: "endTime", type: "time" },
								{ label: "Location", key: "location", type: "text" },
								{ label: "Topic / Theme", key: "topic", type: "text" },
								{ label: "Max Attendees", key: "maxAttendees", type: "number" },
							] as { label: string; key: keyof Omit<Session, "id">; type: string }[]).map(({ label, key, type }) => (
								<div key={key}>
									<label className="mb-1 block font-semibold text-gray-700 text-sm dark:text-slate-300">{label}</label>
									<input type={type} value={String(form[key] ?? "")} onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
								</div>
							))}
							<div>
								<label className="mb-1 block font-semibold text-gray-700 text-sm dark:text-slate-300">Notes</label>
								<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
							</div>
						</div>
						<div className="mt-6 flex gap-3">
							<button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 font-semibold text-gray-600 text-sm dark:border-slate-700 dark:text-slate-400">Cancel</button>
							<button type="button" onClick={handleSave} disabled={!form.date || !form.topic} className="flex-1 rounded-xl bg-DEFUALT_BLACK py-2.5 font-semibold text-BRAND_COLOR text-sm hover:bg-[#023d39] disabled:opacity-40">{editing ? "Save" : "Create"}</button>
						</div>
					</div>
				</div>
			)}

			{sorted.length === 0 && (
				<div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center text-gray-400 dark:border-slate-700">No sessions scheduled yet.</div>
			)}
			<div className="space-y-3">
				{sorted.map((s) => {
					const isPast = new Date(s.date) < new Date(new Date().toDateString());
					return (
						<div key={s.id} className={`flex items-start gap-3 rounded-2xl p-4 shadow-sm sm:gap-4 sm:p-5 ${isPast ? "bg-gray-50 opacity-60 dark:bg-slate-900" : "bg-white dark:bg-[#1e2130]"}`}>
							<div className="flex-shrink-0 rounded-xl bg-DEFUALT_BLACK px-3 py-2 text-center">
								<p className="font-bold text-BRAND_COLOR text-xs">{new Date(s.date + "T00:00").toLocaleDateString("en-AU", { month: "short" }).toUpperCase()}</p>
								<p className="font-bold text-white text-xl leading-none">{new Date(s.date + "T00:00").getDate()}</p>
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-bold text-gray-900 text-sm dark:text-white">{s.topic || "Open Study Session"}</p>
								<p className="mt-0.5 text-gray-500 text-xs">{s.startTime} – {s.endTime} · {s.location}</p>
								{s.notes && <p className="mt-1 text-gray-400 text-xs line-clamp-1">{s.notes}</p>}
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
	const { galleryPhotos, initGallery, addGalleryPhoto, deleteGalleryPhoto, updatePhotoCaption, togglePhotoVisibility } = useAdminStore();
	const [editingCaption, setEditingCaption] = useState<string | null>(null);
	const [captionVal, setCaptionVal] = useState("");
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const GALLERY_FILES = Array.from({ length: 37 }, (_, i) => ({
		id: `photo-${i + 1}`,
		src: `/gallery/snl-image-${i + 1}.jpg`,
	}));

	useEffect(() => {
		const needsInit = galleryPhotos.length === 0 || !galleryPhotos.some((p) => p.src?.includes("snl-image"));
		if (needsInit) {
			const files = GALLERY_FILES.map((f) => ({
				...f,
				caption: "",
				visible: true,
				uploadedAt: new Date().toISOString(),
				source: "admin" as const,
			}));
			initGallery(files);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onload = (ev) => {
				const src = ev.target?.result as string;
				addGalleryPhoto({ src, caption: file.name.replace(/\.[^.]+$/, ""), visible: true, source: "admin" });
			};
			reader.readAsDataURL(file);
		});
		setUploading(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const openCaption = (id: string, current: string) => { setEditingCaption(id); setCaptionVal(current); };

	const adminPhotos = galleryPhotos.filter((p) => p.source !== "user");
	const userPhotos = galleryPhotos.filter((p) => p.source === "user");

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold text-gray-900 text-xl dark:text-white">Gallery Management</h2>
					<p className="text-gray-400 text-sm mt-0.5">
						{galleryPhotos.filter((p) => p.visible).length} visible · {galleryPhotos.length} total
					</p>
				</div>
				<div className="flex items-center gap-3">
					<input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading}
						className="flex items-center gap-2 rounded-xl bg-DEFUALT_BLACK px-4 py-2 font-semibold text-BRAND_COLOR text-sm transition hover:bg-[#023d39] disabled:opacity-50"
					>
						<Upload size={15} />
						Upload Photos
					</button>
				</div>
			</div>

			{/* Caption edit modal */}
			{editingCaption && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1e2130] sm:p-8">
						<h3 className="mb-4 font-bold text-gray-900 dark:text-white">Edit Caption</h3>
						<textarea value={captionVal} onChange={(e) => setCaptionVal(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-BRAND_COLOR focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Add a caption..." />
						<div className="mt-4 flex gap-3">
							<button type="button" onClick={() => setEditingCaption(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm dark:border-slate-700">Cancel</button>
							<button type="button" onClick={() => { updatePhotoCaption(editingCaption, captionVal); setEditingCaption(null); }} className="flex-1 rounded-xl bg-DEFUALT_BLACK py-2.5 font-semibold text-BRAND_COLOR text-sm">Save</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete confirm modal */}
			{confirmDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1e2130]">
						<h3 className="mb-2 font-bold text-gray-900 dark:text-white">Delete Photo?</h3>
						<p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
						<div className="flex gap-3">
							<button type="button" onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm dark:border-slate-700">Cancel</button>
							<button type="button" onClick={() => { deleteGalleryPhoto(confirmDelete); setConfirmDelete(null); }} className="flex-1 rounded-xl bg-red-500 py-2.5 font-semibold text-white text-sm hover:bg-red-600">Delete</button>
						</div>
					</div>
				</div>
			)}

			{/* Admin-uploaded photos */}
			<div>
				<h3 className="mb-3 font-semibold text-gray-700 text-sm dark:text-slate-300">
					SNL Photos ({adminPhotos.length})
				</h3>
				<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
					{adminPhotos.map((photo) => (
						<div key={photo.id} className={`group relative overflow-hidden rounded-xl ${!photo.visible ? "opacity-40" : ""}`}>
							<div className="aspect-square bg-gray-100 dark:bg-slate-800 relative">
								<Image src={photo.src} alt={photo.caption || photo.id} fill className="object-cover" sizes="150px" onError={() => {}} />
							</div>
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 transition group-hover:opacity-100">
								<button type="button" onClick={() => togglePhotoVisibility(photo.id)} className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-white text-[11px] backdrop-blur transition hover:bg-white/40">
									{photo.visible ? <EyeOff size={10} /> : <Eye size={10} />}
									{photo.visible ? "Hide" : "Show"}
								</button>
								<button type="button" onClick={() => openCaption(photo.id, photo.caption)} className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-white text-[11px] backdrop-blur transition hover:bg-white/40">
									<Edit3 size={10} /> Caption
								</button>
								<button type="button" onClick={() => setConfirmDelete(photo.id)} className="flex items-center gap-1 rounded-lg bg-red-500/70 px-2 py-1 text-white text-[11px] backdrop-blur transition hover:bg-red-500">
									<Trash2 size={10} /> Delete
								</button>
							</div>
							{photo.caption && (
								<div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1">
									<p className="truncate text-white text-[10px]">{photo.caption}</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* User-approved photos */}
			{userPhotos.length > 0 && (
				<div>
					<h3 className="mb-3 font-semibold text-gray-700 text-sm dark:text-slate-300">
						Member Photos — Approved ({userPhotos.length})
					</h3>
					<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
						{userPhotos.map((photo) => (
							<div key={photo.id} className={`group relative overflow-hidden rounded-xl ${!photo.visible ? "opacity-40" : ""}`}>
								<div className="aspect-square bg-gray-100 dark:bg-slate-800 relative">
									<Image src={photo.src} alt={photo.caption || "Member photo"} fill className="object-cover" sizes="150px" />
									<div className="absolute top-1 left-1">
										<span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold text-white">Member</span>
									</div>
								</div>
								<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 transition group-hover:opacity-100">
									<button type="button" onClick={() => togglePhotoVisibility(photo.id)} className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-white text-[11px] backdrop-blur transition hover:bg-white/40">
										{photo.visible ? <EyeOff size={10} /> : <Eye size={10} />}
										{photo.visible ? "Hide" : "Show"}
									</button>
									<button type="button" onClick={() => setConfirmDelete(photo.id)} className="flex items-center gap-1 rounded-lg bg-red-500/70 px-2 py-1 text-white text-[11px] backdrop-blur transition hover:bg-red-500">
										<Trash2 size={10} /> Delete
									</button>
								</div>
								{photo.caption && (
									<div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1">
										<p className="truncate text-white text-[10px]">{photo.caption}</p>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

/* ─────────────────────────────────────────────
   User Photos Review Tab
───────────────────────────────────────────── */
function UserPhotosTab() {
	const { userSubmittedPhotos, reviewUserPhoto, deleteSubmittedPhoto } = useAdminStore();
	const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
	const [lightbox, setLightbox] = useState<string | null>(null);

	const filtered = userSubmittedPhotos.filter((p) =>
		filter === "all" ? true : p.status === filter,
	);
	const pendingCount = userSubmittedPhotos.filter((p) => p.status === "pending").length;
	const lightboxPhoto = userSubmittedPhotos.find((p) => p.id === lightbox);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold text-gray-900 text-xl dark:text-white">User Photo Review</h2>
					<p className="text-gray-400 text-sm mt-0.5">
						Approve or reject user-submitted photos for the Global Gallery.
					</p>
				</div>
				{pendingCount > 0 && (
					<span className="self-start rounded-full bg-yellow-100 px-3 py-1.5 font-bold text-yellow-700 text-sm dark:bg-yellow-900/30 dark:text-yellow-400">
						{pendingCount} pending
					</span>
				)}
			</div>

			{/* Filter tabs */}
			<div className="flex gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm dark:bg-[#1e2130]">
				{(["all", "pending", "approved", "rejected"] as const).map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-semibold text-xs transition capitalize sm:text-sm ${
							filter === f
								? "bg-DEFUALT_BLACK text-BRAND_COLOR shadow"
								: "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
						}`}
					>
						{f === "pending" && <Clock3 size={12} />}
						{f === "approved" && <CheckCircle2 size={12} />}
						{f === "rejected" && <XCircle size={12} />}
						<span className="hidden sm:inline">{f}</span>
						<span className="sm:hidden">{f.slice(0, 4)}</span>
						{f !== "all" && (
							<span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-700">
								{userSubmittedPhotos.filter((p) => p.status === f).length}
							</span>
						)}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="rounded-2xl bg-gray-50 p-12 text-center dark:bg-[#1e2130]">
					<Users size={32} className="mx-auto mb-3 text-gray-300 dark:text-slate-600" />
					<p className="text-gray-400 text-sm">No {filter === "all" ? "" : filter} photos.</p>
					{filter === "pending" && (
						<p className="mt-1 text-gray-300 text-xs dark:text-slate-600">
							When users upload photos, they will appear here for review.
						</p>
					)}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{filtered.map((photo) => (
						<div key={photo.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1e2130]">
							{/* Photo */}
							<div
								className="relative aspect-square cursor-pointer bg-gray-100 dark:bg-slate-800"
								onClick={() => setLightbox(photo.id)}
							>
								<Image src={photo.src} alt={photo.caption || "User photo"} fill className="object-cover" sizes="200px" />
								{/* Status badge */}
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
								<div className="absolute top-2 right-2">
									<button
										type="button"
										onClick={(e) => { e.stopPropagation(); deleteSubmittedPhoto(photo.id); }}
										className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-red-500"
									>
										<Trash2 size={10} />
									</button>
								</div>
							</div>
							{/* Info */}
							<div className="p-3">
								<p className="font-semibold text-xs text-gray-700 dark:text-slate-300 truncate">
									{photo.displayName || photo.username}
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
										onClick={() => reviewUserPhoto(photo.id, "approved")}
										disabled={photo.status === "approved"}
										className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-50 py-1.5 text-green-700 text-xs font-semibold transition hover:bg-green-100 disabled:opacity-40 dark:bg-green-900/20 dark:text-green-400"
									>
										<Check size={11} /> Approve
									</button>
									<button
										type="button"
										onClick={() => reviewUserPhoto(photo.id, "rejected")}
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

			{/* Lightbox */}
			{lightboxPhoto && (
				<div
					className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
					onClick={() => setLightbox(null)}
				>
					<div className="relative max-h-[90vh] max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
						<button type="button" onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white">
							<X size={24} />
						</button>
						<div className="relative aspect-square w-full overflow-hidden rounded-2xl">
							<Image src={lightboxPhoto.src} alt={lightboxPhoto.caption || "Photo"} fill className="object-contain" sizes="600px" />
						</div>
						<div className="mt-3 flex items-center justify-between">
							<div>
								<p className="font-semibold text-white text-sm">{lightboxPhoto.displayName || lightboxPhoto.username}</p>
								{lightboxPhoto.caption && <p className="text-gray-400 text-xs mt-0.5">{lightboxPhoto.caption}</p>}
							</div>
							<div className="flex gap-2">
								<button type="button" onClick={() => { reviewUserPhoto(lightboxPhoto.id, "approved"); setLightbox(null); }} disabled={lightboxPhoto.status === "approved"} className="flex items-center gap-1.5 rounded-xl bg-green-500 px-4 py-2 font-semibold text-white text-sm disabled:opacity-40 hover:bg-green-600">
									<Check size={14} /> Approve
								</button>
								<button type="button" onClick={() => { reviewUserPhoto(lightboxPhoto.id, "rejected"); setLightbox(null); }} disabled={lightboxPhoto.status === "rejected"} className="flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white text-sm disabled:opacity-40 hover:bg-red-600">
									<X size={14} /> Reject
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// ─── Admin Side Navigation ────────────────────────────────────────────────────
function AdminSideNav() {
const pathname = usePathname();
const { isLoggedIn, logout } = useAuthStore();
const router = useRouter();

const navItem = (href: string, icon: React.ReactNode, label: string) => {
const active = pathname === href || pathname.startsWith(href + "/");
return (
<Link href={href} className={clsx("flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition", {
"bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm shadow-yellow-500/50": active,
"hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR": !active
})}>
{icon}
{label}
</Link>
);
};

return (
<div className="sidebar-nav fixed top-7 bottom-7 left-4 z-50 hidden w-56 flex-col items-center gap-1 rounded-[36px] bg-DEFUALT_WHITE px-3 py-4 font-semibold shadow-sm dark:bg-[#1e2130] dark:shadow-black/40 md:flex">
<Link href="/" className="mb-16 mt-[15px] flex w-full items-center">
<Image src="/snlnewlogo.png" alt="SNL Logo" width={72} height={72} className="object-contain" />
</Link>
<Link href={isLoggedIn ? "/user/dashboard" : "/auth"} className={clsx("flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition", {
"bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm shadow-yellow-500/50": pathname === "/user/dashboard",
"hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR hover:shadow-sm hover:shadow-yellow-500/50 dark:text-slate-300 dark:hover:text-BRAND_COLOR": pathname !== "/user/dashboard"
})}>
<Home size={24} />
Home
</Link>
{navItem("/forall/wam-calculator", <Calculator size={24} />, "Calculator")}
{navItem("/forall/calendar", <CalendarDays size={24} />, "Calendar")}
{navItem("/gallery", <Images size={24} />, "Gallery")}
{navItem("/admin", <span className="text-BRAND_COLOR text-xs font-black">ADM</span>, "Admin")}
<div className="flex-1" />
<button
type="button"
onClick={() => { logout(); router.push("/"); }}
className="flex h-9 w-full items-center gap-2 rounded-xl px-2 py-5 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400"
>
<LogOut size={24} />
Logout
</button>
</div>
);
}

// ─── Admin Mobile Tab Bar ─────────────────────────────────────────────────────
function AdminMobileTabBar() {
const pathname = usePathname();
const { isLoggedIn, logout } = useAuthStore();
const router = useRouter();

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
<nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t border-gray-100 bg-white px-2 shadow-lg dark:border-slate-700 dark:bg-[#1e2130] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
{tabItem("/user/dashboard", <Home size={20} />, "Home")}
{tabItem("/forall/wam-calculator", <Calculator size={20} />, "Calc")}
{tabItem("/forall/calendar", <CalendarDays size={20} />, "Calendar")}
{tabItem("/gallery", <Images size={20} />, "Gallery")}
{tabItem("/admin", <span className="text-[8px] font-black text-BRAND_COLOR">ADM</span>, "Admin")}
</nav>
);
}
