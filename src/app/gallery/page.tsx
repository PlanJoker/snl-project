"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Footer from "@components/layout/Footer";

// ─── All 37 gallery photos ────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
	{ src: "/gallery/snl-image-1.png",  alt: "SNL Session 1" },
	{ src: "/gallery/snl-image-2.jpg",  alt: "SNL Session 2" },
	{ src: "/gallery/snl-image-3.jpg",  alt: "SNL Session 3" },
	{ src: "/gallery/snl-image-4.jpg",  alt: "SNL Session 4" },
	{ src: "/gallery/snl-image-5.webp", alt: "SNL Session 5" },
	{ src: "/gallery/snl-image-6.jpg",  alt: "SNL Session 6" },
	{ src: "/gallery/snl-image-7.jpg",  alt: "SNL Session 7" },
	{ src: "/gallery/snl-image-8.jpg",  alt: "SNL Session 8" },
	{ src: "/gallery/snl-image-9.jpg",  alt: "SNL Session 9" },
	{ src: "/gallery/snl-image-10.jpg", alt: "SNL Session 10" },
	{ src: "/gallery/snl-image-11.jpg", alt: "SNL Session 11" },
	{ src: "/gallery/snl-image-12.jpg", alt: "SNL Session 12" },
	{ src: "/gallery/snl-image-13.jpg", alt: "SNL Session 13" },
	{ src: "/gallery/snl-image-14.jpg", alt: "SNL Session 14" },
	{ src: "/gallery/snl-image-15.jpg", alt: "SNL Session 15" },
	{ src: "/gallery/snl-image-16.jpg", alt: "SNL Session 16" },
	{ src: "/gallery/snl-image-17.jpg", alt: "SNL Session 17" },
	{ src: "/gallery/snl-image-18.jpg", alt: "SNL Session 18" },
	{ src: "/gallery/snl-image-19.jpg", alt: "SNL Session 19" },
	{ src: "/gallery/snl-image-20.jpg", alt: "SNL Session 20" },
	{ src: "/gallery/snl-image-21.jpg", alt: "SNL Session 21" },
	{ src: "/gallery/snl-image-22.jpg", alt: "SNL Session 22" },
	{ src: "/gallery/snl-image-23.jpg", alt: "SNL Session 23" },
	{ src: "/gallery/snl-image-24.jpg", alt: "SNL Session 24" },
	{ src: "/gallery/snl-image-25.jpg", alt: "SNL Session 25" },
	{ src: "/gallery/snl-image-26.jpg", alt: "SNL Session 26" },
	{ src: "/gallery/snl-image-27.jpg", alt: "SNL Session 27" },
	{ src: "/gallery/snl-image-28.jpg", alt: "SNL Session 28" },
	{ src: "/gallery/snl-image-29.jpg", alt: "SNL Session 29" },
	{ src: "/gallery/snl-image-30.jpg", alt: "SNL Session 30" },
	{ src: "/gallery/snl-image-31.jpg", alt: "SNL Session 31" },
	{ src: "/gallery/snl-image-32.jpg", alt: "SNL Session 32" },
	{ src: "/gallery/snl-image-33.jpg", alt: "SNL Session 33" },
	{ src: "/gallery/snl-image-34.jpg", alt: "SNL Session 34" },
	{ src: "/gallery/snl-image-35.jpg", alt: "SNL Session 35" },
	{ src: "/gallery/snl-image-36.jpg", alt: "SNL Session 36" },
	{ src: "/gallery/snl-image-37.jpg", alt: "SNL Session 37" },
];

export default function GalleryPage() {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
	const closeLightbox = useCallback(() => setLightboxIndex(null), []);

	const goPrev = useCallback(() => {
		setLightboxIndex((i) =>
			i === null ? null : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
		);
	}, []);

	const goNext = useCallback(() => {
		setLightboxIndex((i) =>
			i === null ? null : (i + 1) % GALLERY_PHOTOS.length
		);
	}, []);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (lightboxIndex === null) return;
			if (e.key === "ArrowLeft") goPrev();
			if (e.key === "ArrowRight") goNext();
			if (e.key === "Escape") closeLightbox();
		},
		[lightboxIndex, goPrev, goNext, closeLightbox]
	);

	return (
		<div
			className="min-h-screen bg-[#0D0D0D] text-white"
			onKeyDown={handleKeyDown}
			tabIndex={-1}
		>
			{/* ── Header ── */}
			<header className="relative overflow-hidden bg-DEFUALT_BLACK px-6 py-20 md:px-12 lg:px-24">
				{/* Decorative yellow blob */}
				<div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-BRAND_COLOR opacity-20 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-BRAND_COLOR opacity-10 blur-3xl" />

				<div className="relative mx-auto max-w-6xl">
					<Link
						href="/"
						className="mb-8 inline-flex items-center gap-2 text-gray-400 text-sm transition hover:text-BRAND_COLOR"
					>
						← Back to Home
					</Link>

					<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<div className="mb-3 flex items-center gap-3">
								<Images size={28} className="text-BRAND_COLOR" />
								<span className="font-semibold text-BRAND_COLOR text-sm uppercase tracking-widest">
									Saturday Normal Library
								</span>
							</div>
							<h1 className="font-black text-5xl leading-tight md:text-7xl">
								Our <span className="text-BRAND_COLOR">Moments</span>
							</h1>
							<p className="mt-4 max-w-xl text-gray-400 text-lg">
								Every Saturday, we study, connect, and grow together. Here are the memories we&apos;ve made along the way.
							</p>
						</div>
						<div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
							<span className="font-black text-4xl text-BRAND_COLOR">{GALLERY_PHOTOS.length}</span>
							<span className="text-gray-400 text-sm leading-tight">
								photos<br />captured
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* ── Masonry Grid ── */}
			<main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
				<div className="columns-2 gap-3 md:columns-3 lg:columns-4">
					{GALLERY_PHOTOS.map((photo, idx) => (
						<motion.div
							key={photo.src}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
							className="mb-3 break-inside-avoid"
						>
							<button
								type="button"
								onClick={() => openLightbox(idx)}
								className="group relative block w-full overflow-hidden rounded-2xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-BRAND_COLOR focus:ring-offset-2 focus:ring-offset-[#0D0D0D]"
							>
								<Image
									src={photo.src}
									alt={photo.alt}
									width={600}
									height={400}
									className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
								/>
								{/* Hover overlay */}
								<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
									<span className="translate-y-3 rounded-full bg-BRAND_COLOR px-4 py-1.5 font-semibold text-DEFUALT_BLACK text-xs opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
										View
									</span>
								</div>
								{/* Index badge */}
								<div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 font-mono text-white text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
									{idx + 1} / {GALLERY_PHOTOS.length}
								</div>
							</button>
						</motion.div>
					))}
				</div>
			</main>

			{/* ── Lightbox ── */}
			<AnimatePresence>
				{lightboxIndex !== null && (
					<motion.div
						key="lightbox"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
						onClick={closeLightbox}
					>
						{/* Close */}
						<button
							type="button"
							onClick={closeLightbox}
							className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
							aria-label="Close"
						>
							<X size={20} />
						</button>

						{/* Counter */}
						<div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-white text-sm backdrop-blur-sm">
							{lightboxIndex + 1} / {GALLERY_PHOTOS.length}
						</div>

						{/* Prev */}
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); goPrev(); }}
							className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-BRAND_COLOR hover:text-DEFUALT_BLACK"
							aria-label="Previous"
						>
							<ChevronLeft size={24} />
						</button>

						{/* Image */}
						<motion.div
							key={lightboxIndex}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.25 }}
							className="relative max-h-[85vh] max-w-[90vw]"
							onClick={(e) => e.stopPropagation()}
						>
							<Image
								src={GALLERY_PHOTOS[lightboxIndex].src}
								alt={GALLERY_PHOTOS[lightboxIndex].alt}
								width={1200}
								height={900}
								className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
								priority
							/>
						</motion.div>

						{/* Next */}
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); goNext(); }}
							className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-BRAND_COLOR hover:text-DEFUALT_BLACK"
							aria-label="Next"
						>
							<ChevronRight size={24} />
						</button>

						{/* Thumbnail strip */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto px-4 max-w-[90vw]">
							{GALLERY_PHOTOS.map((p, i) => (
								<button
									key={p.src}
									type="button"
									onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
									className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
										i === lightboxIndex
											? "ring-2 ring-BRAND_COLOR ring-offset-1 ring-offset-black opacity-100 scale-110"
											: "opacity-40 hover:opacity-70"
									}`}
								>
									<Image
										src={p.src}
										alt={p.alt}
										fill
										className="object-cover"
										sizes="48px"
									/>
								</button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ── Footer CTA ── */}
			<section className="bg-BRAND_COLOR px-6 py-20 text-center md:px-12">
				<h2 className="font-black text-4xl text-DEFUALT_BLACK md:text-5xl">
					Join us every Saturday
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-DEFUALT_BLACK/70 text-lg">
					Be part of Melbourne&apos;s most vibrant student study community. Your story starts here.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Link
						href="/forall/wam-calculator"
						className="rounded-2xl bg-DEFUALT_BLACK px-8 py-3 font-semibold text-BRAND_COLOR transition hover:opacity-80"
					>
						Try our tools
					</Link>
					<Link
						href="/"
						className="rounded-2xl border-2 border-DEFUALT_BLACK px-8 py-3 font-semibold text-DEFUALT_BLACK transition hover:bg-DEFUALT_BLACK hover:text-BRAND_COLOR"
					>
						Back to Home
					</Link>
				</div>
			</section>

			<Footer />
		</div>
	);
}
