"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Verifying() {
	const router = useRouter();

	useEffect(() => {
		// Set a timer to redirect after 2 seconds
		const timer = setTimeout(() => {
			router.push("/user");
		}, 5000);

		// Cleanup timer on component unmount
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="text-center">
				<DotLottieReact
					src="loading-animation.lottie"
					className="mx-auto mb-4 h-[250px] w-[250px]"
					loop
					autoplay
				/>
				<p className="font-semibold text-gray-700 text-lg">Verifying...</p>
			</div>
		</div>
	);
}
