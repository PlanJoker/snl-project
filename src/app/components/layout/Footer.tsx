"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, Phone, Clock, MapPin, Send, X } from "lucide-react";

const Footer: React.FC = () => {
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);
	const [showQR, setShowQR] = useState(false);

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			setSubscribed(true);
			setEmail("");
		}
	};

	return (
		<>
			<footer className="relative w-full bg-[#0D1117] rounded-t-[2.5rem] overflow-hidden">
				{/* Decorative blobs */}
				<div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-BRAND_COLOR opacity-5 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-BRAND_COLOR opacity-5 blur-3xl" />

				<div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 md:px-12 lg:px-24">

					{/* ── Top section ── */}
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">

						{/* Brand column */}
						<div className="flex flex-col gap-6 lg:col-span-1">
							<Link href="/" className="inline-block">
								<Image
									src="/snlnewlogo.png"
									alt="SNL Logo"
									width={80}
									height={80}
									className="object-contain"
								/>
							</Link>
							<p className="text-gray-400 text-sm leading-relaxed">
								Saturday Normal Library — a dedicated study space for Melbourne&apos;s ambitious students, every Saturday.
							</p>

							{/* Social icons — KakaoTalk + Instagram */}
							<div className="flex gap-3">
								{/* KakaoTalk */}
								<Link
									href="https://invite.kakao.com/tc/qNm8xFLrYR"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="KakaoTalk"
									className="group flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FEE500]"
								>
									{/* KakaoTalk speech-bubble icon */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="17"
										height="17"
										className="fill-white group-hover:fill-[#3C1E1E]"
									>
										<path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.7 4.3-2.8c.9.2 1.8.3 2.7.3 5.523 0 10-3.477 10-7.8S17.523 3 12 3zm-3.5 9.5c-.828 0-1.5-.672-1.5-1.5S7.672 9.5 8.5 9.5 10 10.172 10 11s-.672 1.5-1.5 1.5zm3.5 0c-.828 0-1.5-.672-1.5-1.5S11.172 9.5 12 9.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm3.5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
									</svg>
								</Link>

								{/* Instagram — click to show QR */}
								<button
									type="button"
									onClick={() => setShowQR(true)}
									aria-label="Instagram QR Code"
									className="group flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888]"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										width="15"
										height="15"
										className="fill-white"
									>
										<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0H8zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
									</svg>
								</button>
							</div>
						</div>

						{/* Contact column */}
						<div className="flex flex-col gap-4 lg:col-span-1">
							<h3 className="font-bold text-BRAND_COLOR text-sm uppercase tracking-widest">Contact Us</h3>
						<ul className="flex flex-col gap-5">
							<li>
								<a
									href="mailto:playground.space93@gmail.com"
										className="flex items-start gap-3 text-gray-300 text-sm transition hover:text-BRAND_COLOR"
									>
										<Mail size={16} className="mt-0.5 flex-shrink-0 text-BRAND_COLOR" />
										playground.space93@gmail.com
									</a>
								</li>
								<li>
									<a
										href="tel:+61403557390"
										className="flex items-center gap-3 text-gray-300 text-sm transition hover:text-BRAND_COLOR"
									>
										<Phone size={16} className="flex-shrink-0 text-BRAND_COLOR" />
										+61 40 355 7390
									</a>
								</li>
							</ul>
						</div>

						{/* Hours & Location column */}
						<div className="flex flex-col gap-4 lg:col-span-1">
							<h3 className="font-bold text-BRAND_COLOR text-sm uppercase tracking-widest">When &amp; Where</h3>
							<ul className="flex flex-col gap-3">
								<li className="flex items-start gap-3 text-gray-300 text-sm">
									<Clock size={16} className="mt-0.5 flex-shrink-0 text-BRAND_COLOR" />
									<span>
										<span className="font-semibold text-white">Every Saturday</span>
										<br />
										1:00 pm – 6:00 pm
									</span>
								</li>
								<li className="flex items-start gap-3 text-gray-300 text-sm">
									<MapPin size={16} className="mt-0.5 flex-shrink-0 text-BRAND_COLOR" />
									<span>
										<span className="font-semibold text-white">o3space@brunswick</span>
										<br />
										Brunswick, Melbourne VIC
									</span>
								</li>
							</ul>
						</div>

						{/* Newsletter column */}
						<div className="flex flex-col gap-4 lg:col-span-1">
							<h3 className="font-bold text-BRAND_COLOR text-sm uppercase tracking-widest">Stay Updated</h3>
							<p className="text-gray-400 text-sm">Get notified about upcoming SNL sessions and events.</p>
							{subscribed ? (
								<div className="rounded-xl border border-BRAND_COLOR/30 bg-BRAND_COLOR/10 px-4 py-3 font-semibold text-BRAND_COLOR text-sm">
									Thanks for subscribing! 🎉
								</div>
							) : (
								<form onSubmit={handleSubscribe} className="flex flex-col gap-2">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Your email address"
										required
										className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm placeholder-gray-500 transition focus:border-BRAND_COLOR focus:outline-none"
									/>
									<button
										type="submit"
										className="flex items-center justify-center gap-2 rounded-xl bg-BRAND_COLOR px-4 py-3 font-semibold text-DEFUALT_BLACK text-sm transition hover:bg-yellow-300"
									>
										<Send size={14} />
										Subscribe to news
									</button>
								</form>
							)}
						</div>
					</div>

					{/* ── Nav links row ── */}
					<div className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8">
						<nav className="flex flex-wrap gap-6">
							{[
								{ href: "/#about", label: "About us" },
								{ href: "/gallery", label: "Gallery" },
								{ href: "/forall/wam-calculator", label: "WAM Calculator" },
								{ href: "/forall/calendar", label: "Calendar" },
							].map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-gray-400 text-sm transition hover:text-BRAND_COLOR"
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>

					{/* ── Bottom bar ── */}
					<div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 md:flex-row md:items-center">
						<p className="text-gray-500 text-xs">
							© {new Date().getFullYear()} Saturday Normal Library. All Rights Reserved.
						</p>
						<Link
							href="/privacy"
							className="text-gray-500 text-xs transition hover:text-BRAND_COLOR"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</footer>

			{/* ── Instagram QR Modal ── */}
			{showQR && (
				<div
					className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
					onClick={() => setShowQR(false)}
				>
					<div
						className="relative mx-4 flex flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<button
							type="button"
							onClick={() => setShowQR(false)}
							className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
						>
							<X size={16} />
						</button>

						{/* Header */}
						<div className="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="22" height="22" className="fill-[#E1306C]">
								<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0H8zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
							</svg>
							<span className="font-bold text-gray-800 text-lg">Follow us on Instagram</span>
						</div>

						{/* QR Code */}
						<div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-inner">
							<Image
								src="/instagram_qr.png"
								alt="SNL Instagram QR Code"
								width={220}
								height={220}
								className="rounded-xl"
							/>
						</div>

						{/* Handle */}
						<p className="font-bold text-gray-700 text-xl tracking-wider">@SNL.STUDY</p>
						<p className="text-center text-gray-400 text-sm">
							Scan the QR code with your phone camera<br />to follow SNL on Instagram
						</p>

						{/* Direct link button */}
						<Link
							href="https://instagram.com/snl.study"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-1 rounded-xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] px-6 py-2.5 font-semibold text-sm text-white transition hover:opacity-90"
						>
							Open Instagram
						</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default Footer;
