import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
	isLoggedIn: boolean;
	isAdmin: boolean;
	login: (admin?: boolean) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			isAdmin: false,
			login: (admin = false) => set({ isLoggedIn: true, isAdmin: admin }),
			logout: () => set({ isLoggedIn: false, isAdmin: false }),
		}),
		{ name: "snl-auth" },
	),
);
