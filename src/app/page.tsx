"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import TestimonialCarousel from "@components/TestimonialCarousel";
import Footer from "@components/layout/Footer";
import InfiniteSlider from "./components/InfiniteSlider";
import { Rock_Salt } from "next/font/google";
import { BookOpen, Calendar, Calculator, Users } from "lucide-react";

const rockSalt = Rock_Salt({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
});

const sliderItems = [
	{ id: 1, src: "/images/snl_meeting1.png", alt: "SNL Meeting 1" },
	{ id: 2, src: "/images/snl_meeting2.png", alt: "SNL Meeting 2" },
	{ id: 3, src: "/images/snl_meeting3.png", alt: "SNL Meeting 3" },
	{ id: 4, src: "/images/snl_meeting4.png", alt: "SNL Meeting 4" },
	{ id: 5, src: "/images/snl_meeting1.png", alt: "SNL Meeting 1" },
	{ id: 6, src: "/images/snl_meeting2.png", alt: "SNL Meeting 2" },
	{ id: 7, src: "/images/snl_meeting3.png", alt: "SNL Meeting 3" },
	{ id: 8, src: "/images/snl_meeting4.png", alt: "SNL Meeting 4" },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 40 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
			transition={{ duration: 0.7, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export default function Home() {
	return (
		<div className="flex w-full flex-col overflow-x-hidden bg-[#F8F8FF]">
			{/* Hero Section */}
			<section className="relative flex h-dvh w-full items-end justify-center overflow-hidden">
				<motion.div
					className="absolute top-20 left-1/2 -translate-x-1/2 w-[140%] aspect-square"
					animate={{ rotate: 360 }}
					transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
				>
					<svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" role="graphics-symbol">
						<path d="M36.6921 609.191C7.29432 444.608 34.6343 348.462 167.512 185.957C300.39 23.4516 629.352 57.2502 719.603 91.0485C809.854 124.847 998 258.028 998 502.8C998 747.572 841.31 951.583 593.486 960.694C345.663 969.805 66.0899 773.775 36.6921 609.191Z" fill="#FFDC73" fillOpacity="0.33" />
						<path d="M64.0081 698.234C-1.49261 528.031 47.6679 265.253 156 160C264.332 54.7474 620.765 25.1195 713.118 59.6863C805.472 94.253 998 230.463 998 480.8C998 731.137 819.291 984.225 565.695 993.543C312.099 1002.86 129.509 868.438 64.0081 698.234Z" fill="#FFDC73" fillOpacity="0.25" />
					</svg>
				</motion.div>
				<div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-b from-transparent to-[#FFDC73]" />
				<div className="relative z-10 mb-32 flex w-full max-w-4xl flex-col items-center gap-4 px-6 text-center">
					<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-medium text-lg text-black/70 md:text-2xl">
						Study group made for students by students
					</motion.p>
					<motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="font-black text-[42px] leading-tight text-black md:text-[72px] md:leading-[1.05]">
						Where Melbourne&apos;s Enthusiastic Young Professionals Study, Network &amp; Dream Together
					</motion.h1>
					<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="max-w-xl text-base text-black/60 md:text-lg">
						A dedicated time &amp; space every Saturday for students to invest in their dreams despite their busy schedules.
					</motion.p>
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-4 flex gap-4">
						<Link href="/forall/wam-calculator" className="rounded-2xl bg-DEFUALT_BLACK px-6 py-3 font-semibold text-BRAND_COLOR transition hover:opacity-80">
							Try our tools
						</Link>
						<a href="#about" className="rounded-2xl border-2 border-DEFUALT_BLACK bg-transparent px-6 py-3 font-semibold text-DEFUALT_BLACK transition hover:bg-DEFUALT_BLACK hover:text-white">
							Learn more
						</a>
					</motion.div>
				</div>
			</section>

			{/* Page 2 - About */}
			<section id="about" className="page2 relative min-h-dvh w-full flex flex-col items-start justify-center bg-BRAND_COLOR px-6 py-16 md:px-12 lg:px-24">
				<div className="mx-auto w-full max-w-6xl">
					<AnimatedSection>
						<div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
							<div>
								<h2 className="mb-3 font-bold text-5xl text-black md:text-7xl">Connect with people who pursue the same goals and transformation</h2>
								<span className={rockSalt.className + " block font-bold text-[#012E2B] text-lg md:text-2xl mt-4"}>— COME ON IT&apos;S US</span>
							</div>
							<div>
								<p className="mt-4 mb-8 font-medium text-black text-lg md:text-xl">Make your Saturday count! Every week, meet new goals and new people. SNL is where learning and community grow together.</p>
								<div className="grid grid-cols-2 gap-4">
									{[{icon: BookOpen, title: "Study Space", desc: "Dedicated space every Saturday"},{icon: Users, title: "Community", desc: "Network with like-minded peers"},{icon: Calendar, title: "Calendar", desc: "Manage your schedule"},{icon: Calculator, title: "WAM Calc", desc: "Track your grades"}].map((item) => (
										<div key={item.title} className="rounded-2xl bg-white/40 p-4 backdrop-blur-sm">
											<item.icon size={24} className="mb-2 text-DEFUALT_BLACK" />
											<h3 className="font-bold text-DEFUALT_BLACK">{item.title}</h3>
											<p className="text-sm text-DEFUALT_BLACK/70">{item.desc}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</AnimatedSection>
				</div>
				<div className="mt-12 w-full">
					<InfiniteSlider items={sliderItems} width={300} height={180} duration={50} reverse={false} gap={-26} useMask={false} />
				</div>
				<AnimatedSection className="mt-8 w-full max-w-6xl mx-auto">
					<h2 className="font-bold text-5xl text-black md:text-7xl">fight procrastination</h2>
				</AnimatedSection>
			</section>

			{/* Page 3 - Networking */}
			<section className="page3 sticky top-0 z-20 h-dvh w-full overflow-hidden bg-black px-6 py-24 md:px-12 lg:px-24">
				<div className="mx-auto max-w-6xl text-white">
					<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-10">
						<div className="md:col-span-6">
							<h2 className="font-semibold text-4xl leading-tight md:text-5xl">Networking for your <br />successful future career</h2>
						</div>
						<div className="mt-2 md:col-span-4">
							<p className="font-medium text-base text-white/60 md:text-xl">Because LinkedIn Stalking Only Gets You So Far! <br />Plus, think of it as good karma.</p>
						</div>
					</div>
				</div>
				<div className="relative mx-auto mt-16 flex max-w-6xl flex-col items-center justify-center">
					<div className="relative mx-auto w-full max-w-[1200px]">
						<div className="relative">
							<Image src="/decoration/phoneMockup.png" alt="Phone Mockup" width={1200} height={1600} className="h-auto w-full" priority />
							<div className="absolute right-[5%] bottom-[40%] max-w-[60%] rounded-[20px] bg-[#E6E5EB] p-3 font-medium text-black text-sm leading-relaxed shadow-md md:right-[10%] md:bottom-[40%] md:rounded-[24px] md:p-6 md:text-xl">
								Expand your university and career network by connecting with accomplished study members!
								<svg className="absolute right-[12px] bottom-[-10px] h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="graphics-symbol img"><path d="M0 0 C8 20, 20 20, 20 20 L20 0 Z" fill="#E6E5EB" /></svg>
							</div>
							<div className="absolute bottom-[10%] left-[5%] max-w-[60%] rounded-[20px] bg-[#FFDC73] p-3 font-medium text-black text-sm leading-relaxed shadow-md md:bottom-[14%] md:left-[10%] md:rounded-[24px] md:p-6 md:text-xl">
								We invite you to sponsor and support your juniors on their journey to success.
								<svg className="absolute bottom-[-10px] left-[12px] h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="graphics-symbol img"><path d="M20 0 C12 20, 0 20, 0 20 L0 0 Z" fill="#FFDC73" /></svg>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Page 4 - Study Tools */}
			<section className="page4 relative min-h-dvh w-full bg-black px-6 py-24 text-white md:px-12 lg:px-24">
				<div className="mx-auto max-w-6xl">
					<AnimatedSection>
						<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
							<div className="flex flex-col space-y-6">
								<h2 className="font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">Manage Your Study Plan with Ease</h2>
								<div className="space-y-4 text-gray-300">
									<p className="text-xl md:text-2xl">How well are you managing your uni study plan?</p>
								</div>
								<div className="flex gap-4">
									<Link href="/forall/wam-calculator" className="rounded-2xl bg-BRAND_COLOR px-6 py-3 font-semibold text-DEFUALT_BLACK transition hover:opacity-80">WAM Calculator</Link>
									<Link href="/forall/calendar" className="rounded-2xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Calendar</Link>
								</div>
							</div>
							<div className="relative mt-8 flex justify-center md:mt-0 md:justify-end">
								<div className="relative w-full max-w-[320px] md:max-w-[400px]">
									<Image src="/decoration/phone.png" alt="iPhone Mockup" width={400} height={800} className="h-auto w-full" priority />
								</div>
							</div>
						</div>
					</AnimatedSection>
				</div>
			</section>

			{/* Page 5 - Community */}
			<section className="page5 relative min-h-dvh w-full bg-[#F8F8FF] px-6 py-24 md:px-12 lg:px-24">
				<div className="relative mx-auto mb-16 max-w-6xl">
					<div className="absolute inset-0 flex items-center justify-center">
						<h1 className={rockSalt.className + " font-bold text-[#FFD800] text-[80px] opacity-60 md:text-[100px] lg:text-[150px] select-none"}>MELB</h1>
					</div>
					<AnimatedSection>
						<div className="relative z-10 py-8 text-center">
							<h2 className="mx-auto max-w-5xl font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">Share your Uni &amp; Career Story with One-Uni Community in</h2>
						</div>
					</AnimatedSection>
				</div>
				<AnimatedSection>
					<div className="mx-auto max-w-5xl">
						<Image src="/decoration/board.png" alt="University Community Board" width={1200} height={800} className="h-auto w-full rounded-lg shadow-xl" priority />
					</div>
				</AnimatedSection>
			</section>

			{/* Page 6 - Testimonials */}
			<section className="page6 relative min-h-dvh w-full bg-[#F8F8FF] px-6 py-24 md:px-12 lg:px-24">
				<div className="mx-auto max-w-6xl">
					<AnimatedSection>
						<div className="mb-12">
							<h2 className="font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">Connect &amp; Develop</h2>
							<h3 className="mt-2 font-bold text-3xl md:text-4xl lg:text-5xl">For your dream to come true</h3>
						</div>
					</AnimatedSection>
					<AnimatedSection>
						<TestimonialCarousel />
					</AnimatedSection>
				</div>
			</section>

			<Footer />
		</div>
	);
}
