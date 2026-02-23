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
date: string;
startTime: string;
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
source?: "admin" | "user";
}

export interface SubmittedPhoto {
id: string;
userId: string;
username: string;
displayName: string;
src: string;
caption: string;
uploadedAt: string;
status: "pending" | "approved" | "rejected";
}

interface AdminStore {
announcements: Announcement[];
sessions: Session[];
galleryPhotos: GalleryPhoto[];
userSubmittedPhotos: SubmittedPhoto[];
addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
updateAnnouncement: (id: string, a: Partial<Announcement>) => void;
deleteAnnouncement: (id: string) => void;
addSession: (s: Omit<Session, "id">) => void;
updateSession: (id: string, s: Partial<Session>) => void;
deleteSession: (id: string) => void;
initGallery: (photos: GalleryPhoto[]) => void;
addGalleryPhoto: (photo: Omit<GalleryPhoto, "id" | "uploadedAt">) => void;
deleteGalleryPhoto: (id: string) => void;
updatePhotoCaption: (id: string, caption: string) => void;
togglePhotoVisibility: (id: string) => void;
submitUserPhoto: (photo: Omit<SubmittedPhoto, "id" | "uploadedAt" | "status">) => void;
reviewUserPhoto: (id: string, action: "approved" | "rejected") => void;
deleteSubmittedPhoto: (id: string) => void;
getPendingCount: () => number;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useAdminStore = create<AdminStore>()(
persist(
(set, get) => ({
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
userSubmittedPhotos: [],

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

addGalleryPhoto: (photo) =>
set((s) => ({
galleryPhotos: [
...s.galleryPhotos,
{
...photo,
id: uid(),
uploadedAt: new Date().toISOString(),
source: photo.source ?? "admin",
},
],
})),

deleteGalleryPhoto: (id) =>
set((s) => ({
galleryPhotos: s.galleryPhotos.filter((p) => p.id !== id),
})),

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

submitUserPhoto: (photo) =>
set((s) => ({
userSubmittedPhotos: [
...s.userSubmittedPhotos,
{
...photo,
id: uid(),
uploadedAt: new Date().toISOString(),
status: "pending",
},
],
})),

reviewUserPhoto: (id, action) =>
set((s) => {
const updated = s.userSubmittedPhotos.map((p) =>
p.id === id ? { ...p, status: action } : p,
);
if (action === "approved") {
const photo = s.userSubmittedPhotos.find((p) => p.id === id);
if (photo) {
const newGalleryPhoto: GalleryPhoto = {
id: uid(),
src: photo.src,
caption: photo.caption || `Photo by ${photo.displayName}`,
visible: true,
uploadedAt: photo.uploadedAt,
source: "user",
};
return {
userSubmittedPhotos: updated,
galleryPhotos: [...s.galleryPhotos, newGalleryPhoto],
};
}
}
return { userSubmittedPhotos: updated };
}),

deleteSubmittedPhoto: (id) =>
set((s) => ({
userSubmittedPhotos: s.userSubmittedPhotos.filter((p) => p.id !== id),
})),

getPendingCount: () =>
get().userSubmittedPhotos.filter((p) => p.status === "pending").length,
}),
{ name: "snl-admin" },
),
);
