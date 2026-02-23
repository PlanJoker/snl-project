"use client";

import { useAuthStore } from "@stores/authStore";
import { useUserStore } from "@stores/userStore";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Eye, EyeOff, UserPlus, LogIn, ChevronDown } from "lucide-react";

const ADMIN_ID = "snl_forever";
const ADMIN_PW = "snl?snl!123";

// Melbourne / Victoria universities list (image provided by user)
const UNIVERSITY_OPTIONS = [
	"Deakin University",
	"La Trobe University",
	"Monash University",
	"RMIT University",
	"Swinburne University of Technology",
	"University of Divinity",
	"University of Melbourne",
	"Victoria University",
	"Australian Catholic University",
	"Charles Darwin University",
	"CQUniversity",
	"Federation University Australia",
	"James Cook University",
	"Southern Cross University",
	"University of New South Wales",
	"University of Queensland",
	"University of Sydney",
	"Others",
] as const;

type Tab = "login" | "signup";

export default function LoginForm() {
	const [tab, setTab] = useState<Tab>("login");
	const router = useRouter();
	const { login } = useAuthStore();
	const { loginUser, register } = useUserStore();

	// Login state
	const [loginId, setLoginId] = useState("");
	const [loginPw, setLoginPw] = useState("");
	const [showLoginPw, setShowLoginPw] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);

	// Signup state
	const [signupUsername, setSignupUsername] = useState("");
	const [signupEmail, setSignupEmail] = useState("");
	const [signupDisplayName, setSignupDisplayName] = useState("");
	const [signupUniversitySelect, setSignupUniversitySelect] = useState("");
	const [signupUniversityCustom, setSignupUniversityCustom] = useState("");
	const [signupMajor, setSignupMajor] = useState("");
	const [signupPw, setSignupPw] = useState("");
	const [signupPwConfirm, setSignupPwConfirm] = useState("");
	const [showSignupPw, setShowSignupPw] = useState(false);
	const [signupError, setSignupError] = useState<string | null>(null);
	const [signupSuccess, setSignupSuccess] = useState(false);

	const handleLogin = (e: FormEvent) => {
		e.preventDefault();
		setLoginError(null);

		// Admin
		if (loginId === ADMIN_ID && loginPw === ADMIN_PW) {
			login(true, undefined);
			router.push("/admin");
			return;
		}

		// Regular user
		const result = loginUser(loginId, loginPw);
		if (result.success) {
			const userId = useUserStore.getState().currentUserId;
			login(false, userId);
			router.push("/user/dashboard");
		} else {
			setLoginError(result.error ?? "Login failed.");
		}
	};

	const handleSignup = (e: FormEvent) => {
		e.preventDefault();
		setSignupError(null);

		if (!signupUsername.trim()) {
			setSignupError("Username is required.");
			return;
		}
		if (signupPw.length < 6) {
			setSignupError("Password must be at least 6 characters.");
			return;
		}
		if (signupPw !== signupPwConfirm) {
			setSignupError("Passwords do not match.");
			return;
		}

		// Resolve final university value
		const finalUniversity =
			signupUniversitySelect === "Others"
				? signupUniversityCustom.trim()
				: signupUniversitySelect;

		const result = register({
			username: signupUsername.trim(),
			email: signupEmail.trim(),
			displayName: signupDisplayName.trim() || signupUsername.trim(),
			university: finalUniversity,
			major: signupMajor.trim(),
			password: signupPw,
		});

		if (result.success) {
			const userId = useUserStore.getState().currentUserId;
			login(false, userId);
			setSignupSuccess(true);
			setTimeout(() => router.push("/user/dashboard"), 1200);
		} else {
			setSignupError(result.error ?? "Registration failed.");
		}
	};

	const inputClass =
		"w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-BRAND_COLOR focus:ring-2 focus:ring-BRAND_COLOR/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-BRAND_COLOR";

	const selectClass =
		"w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-BRAND_COLOR focus:ring-2 focus:ring-BRAND_COLOR/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-BRAND_COLOR appearance-none cursor-pointer";

	return (
		<div className="w-full">
			{/* Tab switcher */}
			<div className="mb-6 flex rounded-2xl bg-gray-100 p-1 dark:bg-slate-800">
				<button
					type="button"
					onClick={() => { setTab("login"); setLoginError(null); }}
					className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-sm transition ${
						tab === "login"
							? "bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm"
							: "text-gray-500 hover:text-gray-700 dark:text-slate-400"
					}`}
				>
					<LogIn size={16} />
					Log In
				</button>
				<button
					type="button"
					onClick={() => { setTab("signup"); setSignupError(null); }}
					className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-sm transition ${
						tab === "signup"
							? "bg-DEFUALT_BLACK text-BRAND_COLOR shadow-sm"
							: "text-gray-500 hover:text-gray-700 dark:text-slate-400"
					}`}
				>
					<UserPlus size={16} />
					Sign Up
				</button>
			</div>

			{/* ── Login Form ── */}
			{tab === "login" && (
				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							Username
						</label>
						<input
							type="text"
							value={loginId}
							onChange={(e) => setLoginId(e.target.value)}
							placeholder="Enter your username"
							required
							className={inputClass}
						/>
					</div>
					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							Password
						</label>
						<div className="relative">
							<input
								type={showLoginPw ? "text" : "password"}
								value={loginPw}
								onChange={(e) => setLoginPw(e.target.value)}
								placeholder="Enter your password"
								required
								className={`${inputClass} pr-10`}
							/>
							<button
								type="button"
								onClick={() => setShowLoginPw(!showLoginPw)}
								className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
							>
								{showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
					</div>
					{loginError && (
						<p className="rounded-xl bg-red-50 px-4 py-2.5 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
							{loginError}
						</p>
					)}
					<button
						type="submit"
						className="w-full rounded-xl bg-DEFUALT_BLACK py-3 font-bold text-BRAND_COLOR transition hover:opacity-80"
					>
						Log In
					</button>
					<p className="text-center text-gray-400 text-xs dark:text-slate-500">
						Don&apos;t have an account?{" "}
						<button
							type="button"
							onClick={() => setTab("signup")}
							className="font-semibold text-BRAND_COLOR hover:underline"
						>
							Sign up here
						</button>
					</p>
				</form>
			)}

			{/* ── Sign Up Form ── */}
			{tab === "signup" && (
				<form onSubmit={handleSignup} className="space-y-3">
					{signupSuccess && (
						<div className="rounded-xl bg-green-50 px-4 py-3 text-center font-semibold text-green-700 text-sm dark:bg-green-900/20 dark:text-green-400">
							Account created! Redirecting to your dashboard...
						</div>
					)}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
								Username <span className="text-red-400">*</span>
							</label>
							<input
								type="text"
								value={signupUsername}
								onChange={(e) => setSignupUsername(e.target.value)}
								placeholder="e.g. john_doe"
								required
								className={inputClass}
							/>
						</div>
						<div>
							<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
								Display Name
							</label>
							<input
								type="text"
								value={signupDisplayName}
								onChange={(e) => setSignupDisplayName(e.target.value)}
								placeholder="e.g. John"
								className={inputClass}
							/>
						</div>
					</div>
					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							Email
						</label>
						<input
							type="email"
							value={signupEmail}
							onChange={(e) => setSignupEmail(e.target.value)}
							placeholder="your@email.com"
							className={inputClass}
						/>
					</div>

					{/* University dropdown */}
					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							University
						</label>
						<div className="relative">
							<select
								value={signupUniversitySelect}
								onChange={(e) => {
									setSignupUniversitySelect(e.target.value);
									if (e.target.value !== "Others") setSignupUniversityCustom("");
								}}
								className={selectClass}
							>
								<option value="">— Select your university —</option>
								{UNIVERSITY_OPTIONS.map((uni) => (
									<option key={uni} value={uni}>
										{uni}
									</option>
								))}
							</select>
							<ChevronDown
								size={16}
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Custom university input — shown only when "Others" is selected */}
					{signupUniversitySelect === "Others" && (
						<div>
							<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
								University Name <span className="text-red-400">*</span>
							</label>
							<input
								type="text"
								value={signupUniversityCustom}
								onChange={(e) => setSignupUniversityCustom(e.target.value)}
								placeholder="Enter your university name"
								required
								className={inputClass}
							/>
						</div>
					)}

					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							Major
						</label>
						<input
							type="text"
							value={signupMajor}
							onChange={(e) => setSignupMajor(e.target.value)}
							placeholder="e.g. Computer Science"
							className={inputClass}
						/>
					</div>

					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							Password <span className="text-red-400">*</span>
						</label>
						<div className="relative">
							<input
								type={showSignupPw ? "text" : "password"}
								value={signupPw}
								onChange={(e) => setSignupPw(e.target.value)}
								placeholder="Min. 6 characters"
								required
								className={`${inputClass} pr-10`}
							/>
							<button
								type="button"
								onClick={() => setShowSignupPw(!showSignupPw)}
								className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
							>
								{showSignupPw ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
					</div>
					<div>
						<label className="mb-1.5 block font-medium text-sm dark:text-slate-200">
							Confirm Password <span className="text-red-400">*</span>
						</label>
						<input
							type="password"
							value={signupPwConfirm}
							onChange={(e) => setSignupPwConfirm(e.target.value)}
							placeholder="Re-enter password"
							required
							className={inputClass}
						/>
					</div>
					{signupError && (
						<p className="rounded-xl bg-red-50 px-4 py-2.5 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
							{signupError}
						</p>
					)}
					<button
						type="submit"
						className="w-full rounded-xl bg-DEFUALT_BLACK py-3 font-bold text-BRAND_COLOR transition hover:opacity-80"
					>
						Create Account
					</button>
					<p className="text-center text-gray-400 text-xs dark:text-slate-500">
						Already have an account?{" "}
						<button
							type="button"
							onClick={() => setTab("login")}
							className="font-semibold text-BRAND_COLOR hover:underline"
						>
							Log in
						</button>
					</p>
				</form>
			)}
		</div>
	);
}
