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
	semesterId: string;   // links to WAMStore semester
	semesterName: string;
	targetWAM: number;    // 0–100
	targetGrade: string;  // e.g. "H1", "H2A"
	note: string;
}

export interface UserState {
	// All registered users (simple client-side DB)
	users: UserProfile[];
	// Currently logged-in user id
	currentUserId: string | null;
	// Study goals per user: { userId: StudyGoal[] }
	studyGoals: Record<string, StudyGoal[]>;

	// Auth actions
	register: (profile: Omit<UserProfile, "id" | "joinedAt"> & { password: string }) => { success: boolean; error?: string };
	loginUser: (username: string, password: string) => { success: boolean; isAdmin?: boolean; error?: string };
	logoutUser: () => void;
	getCurrentUser: () => UserProfile | null;

	// Study goal actions
	addGoal: (goal: Omit<StudyGoal, "id">) => void;
	updateGoal: (goalId: string, updates: Partial<StudyGoal>) => void;
	removeGoal: (goalId: string) => void;
	getGoals: () => StudyGoal[];
}

// Passwords stored alongside users (in a real app, never do this client-side)
// We keep a separate map: { userId: hashedPassword } — here just plain for demo
let _passwords: Record<string, string> = {};

const uid = () => Math.random().toString(36).slice(2, 10);

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			users: [],
			currentUserId: null,
			studyGoals: {},

			register: ({ password, ...profile }) => {
				const state = get();
				// Check duplicate username
				if (state.users.some((u) => u.username === profile.username)) {
					return { success: false, error: "Username already taken." };
				}
				// Check duplicate email
				if (profile.email && state.users.some((u) => u.email === profile.email)) {
					return { success: false, error: "Email already registered." };
				}
				const id = uid();
				const newUser: UserProfile = {
					...profile,
					id,
					joinedAt: new Date().toISOString(),
				};
				// Store password in memory map (persisted via separate key below)
				_passwords[id] = password;
				// Persist passwords alongside store
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
				// Admin shortcut
				if (username === "snl_forever" && password === "snl?snl!123") {
					return { success: true, isAdmin: true };
				}
				const state = get();
				const user = state.users.find((u) => u.username === username);
				if (!user) return { success: false, error: "User not found." };

				// Load passwords
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
				set({
					studyGoals: {
						...studyGoals,
						[currentUserId]: [...userGoals, { ...goal, id }],
					},
				});
			},

			updateGoal: (goalId, updates) => {
				const { currentUserId, studyGoals } = get();
				if (!currentUserId) return;
				const userGoals = studyGoals[currentUserId] ?? [];
				set({
					studyGoals: {
						...studyGoals,
						[currentUserId]: userGoals.map((g) =>
							g.id === goalId ? { ...g, ...updates } : g,
						),
					},
				});
			},

			removeGoal: (goalId) => {
				const { currentUserId, studyGoals } = get();
				if (!currentUserId) return;
				const userGoals = studyGoals[currentUserId] ?? [];
				set({
					studyGoals: {
						...studyGoals,
						[currentUserId]: userGoals.filter((g) => g.id !== goalId),
					},
				});
			},

			getGoals: () => {
				const { currentUserId, studyGoals } = get();
				if (!currentUserId) return [];
				return studyGoals[currentUserId] ?? [];
			},
		}),
		{ name: "snl-users" },
	),
);
