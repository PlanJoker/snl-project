"use client";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import { useAuthStore } from "@stores/authStore";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

// Admin credentials
const ADMIN_ID = "snl forever";
const ADMIN_PW = "snl?snl!123";

// Legacy user (kept for backward compatibility)
const LEGACY_ID = "user01";
const LEGACY_PW = "16apr";

export default function LoginForm() {
	const [id, setId] = useState("");
	const [pw, setPw] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { login } = useAuthStore();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const isAdmin = id === ADMIN_ID && pw === ADMIN_PW;
		const isLegacy = id === LEGACY_ID && pw === LEGACY_PW;

		if (isAdmin || isLegacy) {
			login();
			router.push("/auth");
		} else {
			setError("Incorrect ID or password. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full space-y-4">
			<Input
				label="ID"
				type="text"
				value={id}
				onChange={(e) => setId(e.target.value)}
				required
			/>
			<Input
				label="Password"
				type="password"
				value={pw}
				onChange={(e) => setPw(e.target.value)}
				required
			/>
			{error && (
				<p className="rounded-lg bg-red-50 px-3 py-2 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
					{error}
				</p>
			)}
			<Button type="submit">Login</Button>
		</form>
	);
}
