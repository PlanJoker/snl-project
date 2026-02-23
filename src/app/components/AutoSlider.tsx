"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface SlideItem {
	src: string;
	alt: string;
}

interface AutoSliderProps {
	items: SlideItem[];
	interval?: number; // ms between slides
}

export default function AutoSlider({ items, interval = 3500 }: AutoSliderProps) {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const goTo = useCallback(
		(index: number) => {
			if (isTransitioning) return;
			setIsTransitioning(true);
			setCurrent(index);
			setTimeout(() => setIsTransitioning(false), 600);
		},
		[isTransitioning],
	);

	const next = useCallback(() => {
		goTo((current + 1) % items.length);
	}, [current, items.length, goTo]);

	const prev = useCallback(() => {
		goTo((current - 1 + items.length) % items.length);
	}, [current, items.length, goTo]);

	// Auto-advance
	useEffect(() => {
		if (paused) return;
		timerRef.current = setTimeout(next, interval);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [current, paused, interval, next]);

	return (
		<div
			className="relative w-full overflow-hidden rounded-3xl"
			style={{ aspectRatio: "16/9" }}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{/* Slides */}
			{items.map((item, idx) => (
				<Link
					key={item.src}
					href="/gallery"
					className={`absolute inset-0 transition-opacity duration-700 ${
						idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
					}`}
					tabIndex={idx === current ? 0 : -1}
					aria-hidden={idx !== current}
				>
					<Image
						src={item.src}
						alt={item.alt}
						fill
						className="object-cover"
						priority={idx === 0}
						sizes="(max-width: 768px) 100vw, 80vw"
					/>
					{/* Overlay hint */}
					<div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
						<span className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/60 text-white font-semibold px-5 py-2 rounded-full text-sm backdrop-blur-sm">
							View Gallery →
						</span>
					</div>
				</Link>
			))}

			{/* Pause indicator */}
			{paused && (
				<div className="absolute top-3 right-3 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
					<span className="inline-block w-2 h-2 rounded-full bg-BRAND_COLOR" />
					Paused
				</div>
			)}

			{/* Prev / Next arrows */}
			<button
				type="button"
				onClick={(e) => { e.preventDefault(); prev(); }}
				className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition backdrop-blur-sm"
				aria-label="Previous"
			>
				‹
			</button>
			<button
				type="button"
				onClick={(e) => { e.preventDefault(); next(); }}
				className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition backdrop-blur-sm"
				aria-label="Next"
			>
				›
			</button>

			{/* Dot indicators */}
			<div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
				{items.map((_, idx) => (
					<button
						key={`dot-${idx}`}
						type="button"
						onClick={(e) => { e.preventDefault(); goTo(idx); }}
						className={`w-2 h-2 rounded-full transition-all duration-300 ${
							idx === current
								? "bg-BRAND_COLOR w-5"
								: "bg-white/50 hover:bg-white/80"
						}`}
						aria-label={`Go to slide ${idx + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
