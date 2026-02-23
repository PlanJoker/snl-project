import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
	isLoggedIn: boolean;
	isAdmin: boolean;
	userId: string | null;
	login: (admin?: boolean, userId?: string | null) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			isAdmin: false,
			userId: null,
			login: (admin = false, userId = null) =>
				set({ isLoggedIn: true, isAdmin: admin, userId }),
			logout: () => set({ isLoggedIn: false, isAdmin: false, userId: null }),
		}),
		{ name: "snl-auth" },
	),
);
