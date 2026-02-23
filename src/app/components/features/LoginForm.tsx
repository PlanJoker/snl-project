"use client";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import { useAuthStore } from "@stores/authStore";
import { useRouter } from "next/navigation";
import { type FC, type FormEvent, useState } from "react";

const MOCK_ID = "user01";
const MOCK_PW = "16apr";

export default function LoginForm() {
	const [id, setId] = useState("");
	const [pw, setPw] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { login } = useAuthStore(); // Access the login function

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (id === MOCK_ID && pw === MOCK_PW) {
			login(); // Update the global state
			router.push("/auth"); // Redirect after login
		} else {
			setError("Please try ID or password again!");
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
			{error && <p className="text-red-500 text-sm">{error}</p>}
			<Button type="submit">Login</Button>
		</form>
	);
}
