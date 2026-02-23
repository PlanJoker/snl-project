"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginForm from "@components/features/LoginForm";
import { useAuthStore } from "@stores/authStore";

export default function AuthPage() {
const router = useRouter();
const { isLoggedIn, isAdmin } = useAuthStore();

// If already logged in, redirect appropriately
useEffect(() => {
if (isLoggedIn) {
router.replace(isAdmin ? "/admin" : "/user/dashboard");
}
}, [isLoggedIn, isAdmin, router]);

if (isLoggedIn) return null;

return (
<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFFBE6] to-[#FFF3B0] dark:from-[#0f1117] dark:to-[#1a1d27] px-4">
<div className="w-full max-w-md">
{/* Logo + Title */}
<div className="mb-8 flex flex-col items-center gap-3">
<a href="/">
<Image
src="/snlnewlogo.png"
alt="SNL Logo"
width={80}
height={80}
className="object-contain drop-shadow-md"
/>
</a>
<div className="text-center">
<h1 className="font-black text-2xl text-gray-900 dark:text-white">
Saturday Normal Library
</h1>
<p className="mt-1 text-gray-500 text-sm dark:text-slate-400">
Sign in to access your personal dashboard
</p>
</div>
</div>

{/* Card */}
<div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-[#1e2130]">
<LoginForm />
</div>

{/* Footer note */}
<p className="mt-6 text-center text-gray-400 text-xs dark:text-slate-600">
SNL meets every Saturday 1pm–6pm at o3space@brunswick
</p>
</div>
</div>
);
}
