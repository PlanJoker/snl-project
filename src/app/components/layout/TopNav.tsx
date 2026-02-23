"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";
import LoginForm from "@components/features/LoginForm";
import Modal from "@components/ui/Modal";
import { useAuthStore } from "@stores/authStore"; // Import the store
import clsx from "clsx";

// import { useAuth } from './AuthContext';

gsap.registerPlugin(useGSAP);

export default function TopNav() {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isMenuClicked, setIsMenuClicked] = useState(false);

	const { isLoggedIn, logout } = useAuthStore(); // Access the login state
	const router = useRouter(); // Initialize router

	const containerRef = useRef<HTMLDivElement>(null);

	// const { login } = useAuth();
	// const handleLogin = async (credentials) => {
	//   await login(credentials);
	//   // Update UI based on state
	// };
	// // Render login form or button

	// Close the modal when isLoggedIn becomes true
	useEffect(() => {
		if (isLoggedIn) {
			setIsLoginModalOpen(false);
		}
	}, [isLoggedIn]);

	// Define logout handler
	const handleLogout = () => {
		logout(); // Set isLoggedIn to false in authStore
		setIsLoginModalOpen(false); // Close the modal
		router.push("/"); // Redirect to main page
	};

	const pathname = usePathname();

	// Don't render on specific pages
	if (pathname.startsWith("/forall") || pathname.startsWith("/user")) {
		return null;
	}

	return (
		<nav
			ref={containerRef}
			className="fixed z-50 flex h-16 w-full items-center justify-between bg-transparent px-6 py-2 text-black"
			style={{ cursor: "url(/cursors/default.svg), pointer" }}
		>
			{/* Logo on the left */}
			<Link href="/" className="ml-2 flex items-center">
				<Image
					src="/logo06.svg"
					alt="Logo"
					// width={300}
					// height={48}
					width={128}
					height={128}
					// className="absolute top-4"
				/>
			</Link>

			{/* Login Modal */}
			<Modal
				isOpen={isLoginModalOpen}
				onClose={() => setIsLoginModalOpen(false)}
			>
				<h2 className="mb-4 text-center font-bold text-2xl">Login</h2>
				<LoginForm />
			</Modal>

			<div className="relative flex gap-8">
				<button
					onClick={() => setIsMenuClicked(!isMenuClicked)}
					className="relative rounded-2xl bg-black px-4 py-2 font-semibold text-white transition-opacity hover:opacity-80"
					type="button"
				>
					try out
					{isMenuClicked ? <MenuButtonGroups /> : null}
				</button>

				{/* Log In/Logout Button */}
				<button
					onClick={isLoggedIn ? handleLogout : () => setIsLoginModalOpen(true)}
					className="rounded-2xl bg-black px-4 py-2 font-semibold text-white transition-opacity hover:opacity-80"
					type="button"
				>
					{isLoggedIn ? "Logout" : "Log In"}
				</button>
			</div>
		</nav>
	);
}

function MenuButtonGroups() {
	// const containerRef = useRef<HTMLDivElement>(null);
	// const { contextSafe } = useGSAP(
	// 	() => {
	// 		gsap
	// 			.timeline()
	// 			.from("#wamCalculator", {
	// 				duration: 1.5,
	// 				ease: "back.out(1.7)",
	// 				// y: -50, // Slides down from -50px
	// 				opacity: 0, // Fades in from 0 opacity
	// 			})
	// 			// 2. Calendar slides down and fades in, starting AFTER #wamCalculator's animation is complete
	// 			.from("#calendar", {
	// 				duration: 1.5,
	// 				ease: "back.out(1.7)",
	// 				// y: -50, // Slides down from -50px
	// 				opacity: 0, // Fades in from 0 opacity
	// 			});
	// 	},
	// 	{ scope: containerRef },
	// );

	return (
		<div
			// ref={containerRef}
			className="absolute top-full right-0 mt-[2px] flex flex-col items-end gap-[2px]"
		>
			<LinkButton id="wamCalculator" href="/forall/wam-calculator">
				Wam Calculator
			</LinkButton>
			<LinkButton
				id="calendar"
				className="relative left-[14px]"
				href="/forall/calendar"
			>
				Calendar
			</LinkButton>
		</div>
	);
}

interface LinkButtonProps {
	children: React.ReactNode;
	id: string;
	className?: string;
	href: string;
}

function LinkButton({ children, id, className, href }: LinkButtonProps) {
	return (
		<Link
			id={id}
			className={clsx(
				"w-fit text-nowrap rounded-2xl bg-black px-4 py-2 font-semibold text-white transition-opacity hover:text-BRAND_COLOR hover:opacity-80",
				className,
			)}
			href={href}
		>
			{children}
		</Link>
	);
}
