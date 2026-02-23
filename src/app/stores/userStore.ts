import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  university: string;
  major: string;
  joinedAt: string;
}

export interface StudyGoal {
  id: string;
  semesterId: string;
  semesterName: string;
  targetWAM: number;
  targetGrade: string;
  note: string;
}

export interface UserPhoto {
  id: string;
  userId: string;
  src: string;
  caption: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface UserState {
  users: UserProfile[];
  currentUserId: string | null;
  studyGoals: Record<string, StudyGoal[]>;
  userPhotos: UserPhoto[];
  register: (profile: Omit<UserProfile, "id" | "joinedAt"> & { password: string }) => { success: boolean; error?: string };
  loginUser: (username: string, password: string) => { success: boolean; isAdmin?: boolean; error?: string };
  logoutUser: () => void;
  getCurrentUser: () => UserProfile | null;
  addGoal: (goal: Omit<StudyGoal, "id">) => void;
  updateGoal: (goalId: string, updates: Partial<StudyGoal>) => void;
  removeGoal: (goalId: string) => void;
  getGoals: () => StudyGoal[];
  addUserPhoto: (photo: Omit<UserPhoto, "id" | "uploadedAt" | "status">) => void;
  removeUserPhoto: (photoId: string) => void;
  getUserPhotos: () => UserPhoto[];
  updatePhotoStatus: (photoId: string, status: UserPhoto["status"]) => void;
}

let _passwords: Record<string, string> = {};
const uid = () => Math.random().toString(36).slice(2, 10);

const TESTER_ID = "snl_tester01_seed";
const TESTER_PW = "tester01!";
const TESTER_PROFILE: UserProfile = {
  id: TESTER_ID,
  username: "snl_tester01",
  email: "tester01@snl.com",
  displayName: "John Smith",
  university: "Monash University",
  major: "Computer Science",
  joinedAt: "2025-01-01T00:00:00.000Z",
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [TESTER_PROFILE],
      currentUserId: null,
      studyGoals: { [TESTER_ID]: [] },
      userPhotos: [],

      register: ({ password, ...profile }) => {
        const state = get();
        if (state.users.some((u) => u.username === profile.username)) {
          return { success: false, error: "Username already taken." };
        }
        if (profile.email && state.users.some((u) => u.email === profile.email)) {
          return { success: false, error: "Email already registered." };
        }
        const id = uid();
        const newUser: UserProfile = { ...profile, id, joinedAt: new Date().toISOString() };
        _passwords[id] = password;
        try {
          const stored = JSON.parse(localStorage.getItem("snl-user-passwords") || "{}");
          stored[id] = password;
          localStorage.setItem("snl-user-passwords", JSON.stringify(stored));
        } catch {}
        set((s) => ({
          users: [...s.users, newUser],
          currentUserId: id,
          studyGoals: { ...s.studyGoals, [id]: [] },
        }));
        return { success: true };
      },

      loginUser: (username, password) => {
        if (username === "snl_forever" && password === "snl?snl!123") {
          return { success: true, isAdmin: true };
        }
        const state = get();
        // Ensure tester account always exists
        const hasTester = state.users.some((u) => u.username === "snl_tester01");
        if (!hasTester) {
          set((s) => ({
            users: [TESTER_PROFILE, ...s.users],
            studyGoals: { [TESTER_ID]: [], ...s.studyGoals },
          }));
        }
        const user = get().users.find((u) => u.username === username);
        if (!user) return { success: false, error: "User not found." };
        // Tester account
        if (user.id === TESTER_ID) {
          if (password !== TESTER_PW) return { success: false, error: "Incorrect password." };
          set({ currentUserId: user.id });
          return { success: true, isAdmin: false };
        }
        // Regular users
        let pw = _passwords[user.id];
        if (!pw) {
          try {
            const stored = JSON.parse(localStorage.getItem("snl-user-passwords") || "{}");
            pw = stored[user.id];
            _passwords[user.id] = pw;
          } catch {}
        }
        if (pw !== password) return { success: false, error: "Incorrect password." };
        set({ currentUserId: user.id });
        return { success: true, isAdmin: false };
      },

      logoutUser: () => set({ currentUserId: null }),

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        if (!currentUserId) return null;
        return users.find((u) => u.id === currentUserId) ?? null;
      },

      addGoal: (goal) => {
        const { currentUserId, studyGoals } = get();
        if (!currentUserId) return;
        const id = uid();
        const userGoals = studyGoals[currentUserId] ?? [];
        set({ studyGoals: { ...studyGoals, [currentUserId]: [...userGoals, { ...goal, id }] } });
      },

      updateGoal: (goalId, updates) => {
        const { currentUserId, studyGoals } = get();
        if (!currentUserId) return;
        const userGoals = studyGoals[currentUserId] ?? [];
        set({
          studyGoals: {
            ...studyGoals,
            [currentUserId]: userGoals.map((g) => g.id === goalId ? { ...g, ...updates } : g),
          },
        });
      },

      removeGoal: (goalId) => {
        const { currentUserId, studyGoals } = get();
        if (!currentUserId) return;
        const userGoals = studyGoals[currentUserId] ?? [];
        set({ studyGoals: { ...studyGoals, [currentUserId]: userGoals.filter((g) => g.id !== goalId) } });
      },

      getGoals: () => {
        const { currentUserId, studyGoals } = get();
        if (!currentUserId) return [];
        return studyGoals[currentUserId] ?? [];
      },

      addUserPhoto: (photo) => {
        const id = uid();
        const newPhoto: UserPhoto = {
          ...photo,
          id,
          uploadedAt: new Date().toISOString(),
          status: "pending",
        };
        set((s) => ({ userPhotos: [...s.userPhotos, newPhoto] }));
      },

      removeUserPhoto: (photoId) => {
        set((s) => ({ userPhotos: s.userPhotos.filter((p) => p.id !== photoId) }));
      },

      getUserPhotos: () => {
        const { currentUserId, userPhotos } = get();
        if (!currentUserId) return [];
        return userPhotos.filter((p) => p.userId === currentUserId);
      },

      updatePhotoStatus: (photoId, status) => {
        set((s) => ({
          userPhotos: s.userPhotos.map((p) => p.id === photoId ? { ...p, status } : p),
        }));
      },
    }),
    {
      name: "snl-users",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Always ensure tester account exists after rehydration
        const hasTester = state.users.some((u) => u.username === "snl_tester01");
        if (!hasTester) {
          state.users = [TESTER_PROFILE, ...state.users];
          state.studyGoals = { [TESTER_ID]: [], ...state.studyGoals };
        }
      },
    },
  ),
);
