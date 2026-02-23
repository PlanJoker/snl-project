import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Announcement {
	id: string;
	title: string;
	content: string;
	pinned: boolean;
	createdAt: string;
}

export interface Session {
	id: string;
	date: string;       // YYYY-MM-DD
	startTime: string;  // HH:MM
	endTime: string;
	location: string;
	topic: string;
	maxAttendees: number;
	notes: string;
}

export interface GalleryPhoto {
	id: string;
	src: string;
	caption: string;
	visible: boolean;
	uploadedAt: string;
}

interface AdminStore {
	announcements: Announcement[];
	sessions: Session[];
	galleryPhotos: GalleryPhoto[];

	// Announcements
	addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
	updateAnnouncement: (id: string, a: Partial<Announcement>) => void;
	deleteAnnouncement: (id: string) => void;

	// Sessions
	addSession: (s: Omit<Session, "id">) => void;
	updateSession: (id: string, s: Partial<Session>) => void;
	deleteSession: (id: string) => void;

	// Gallery
	initGallery: (photos: GalleryPhoto[]) => void;
	updatePhotoCaption: (id: string, caption: string) => void;
	togglePhotoVisibility: (id: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useAdminStore = create<AdminStore>()(
	persist(
		(set) => ({
			announcements: [
				{
					id: uid(),
					title: "Welcome to SNL! 🎉",
					content: "Saturday Normal Library is now open every Saturday from 1pm to 6pm at o3space@brunswick. Come study with us!",
					pinned: true,
					createdAt: new Date().toISOString(),
				},
			],
			sessions: [
				{
					id: uid(),
					date: (() => {
						const d = new Date();
						const day = d.getDay();
						const diff = (6 - day + 7) % 7 || 7;
						d.setDate(d.getDate() + diff);
						return d.toISOString().split("T")[0];
					})(),
					startTime: "13:00",
					endTime: "18:00",
					location: "o3space@brunswick",
					topic: "Open Study Session",
					maxAttendees: 30,
					notes: "Bring your own study materials. Coffee available!",
				},
			],
			galleryPhotos: [],

			addAnnouncement: (a) =>
				set((s) => ({
					announcements: [
						{ ...a, id: uid(), createdAt: new Date().toISOString() },
						...s.announcements,
					],
				})),
			updateAnnouncement: (id, a) =>
				set((s) => ({
					announcements: s.announcements.map((x) =>
						x.id === id ? { ...x, ...a } : x,
					),
				})),
			deleteAnnouncement: (id) =>
				set((s) => ({
					announcements: s.announcements.filter((x) => x.id !== id),
				})),

			addSession: (s) =>
				set((st) => ({
					sessions: [...st.sessions, { ...s, id: uid() }],
				})),
			updateSession: (id, s) =>
				set((st) => ({
					sessions: st.sessions.map((x) => (x.id === id ? { ...x, ...s } : x)),
				})),
			deleteSession: (id) =>
				set((st) => ({
					sessions: st.sessions.filter((x) => x.id !== id),
				})),

			initGallery: (photos) => set({ galleryPhotos: photos }),
			updatePhotoCaption: (id, caption) =>
				set((s) => ({
					galleryPhotos: s.galleryPhotos.map((p) =>
						p.id === id ? { ...p, caption } : p,
					),
				})),
			togglePhotoVisibility: (id) =>
				set((s) => ({
					galleryPhotos: s.galleryPhotos.map((p) =>
						p.id === id ? { ...p, visible: !p.visible } : p,
					),
				})),
		}),
		{ name: "snl-admin" },
	),
);
