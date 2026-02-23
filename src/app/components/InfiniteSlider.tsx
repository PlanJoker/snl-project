import type React from "react";

interface SliderItem {
	id: number;
	src: string;
	alt?: string;
}

interface InfiniteSliderProps {
	items: SliderItem[];
	width?: number;
	height?: number;
	duration?: number;
	reverse?: boolean;
	gap?: number;
	useMask?: boolean;
	className?: string;
}

export default function InfiniteSlider({
	items,
	width = 100,
	height = 50,
	duration = 10,
	reverse = false,
	gap = 0,
	useMask = true,
	className = "",
}: InfiniteSliderProps) {
	const quantity = items.length;

	// Inline styles for the slider container
	const sliderStyle: React.CSSProperties = {
		"--width": `${width}px`,
		"--height": `${height}px`,
		"--quantity": quantity,
		"--duration": `${duration}s`,
		"--gap": `${gap}px`,
	} as React.CSSProperties;

	return (
		<div className={`relative w-full overflow-hidden ${className}`}>
			<style jsx>{`
				.slider {
					width: 100%;
					height: var(--height);
					overflow: hidden;
				}

				.slider.with-mask {
					mask-image: linear-gradient(
						to right,
						transparent,
						#000 10% 90%,
						transparent
					);
					-webkit-mask-image: linear-gradient(
						to right,
						transparent,
						#000 10% 90%,
						transparent
					);
				}
				
				.slider-list {
					display: flex;
					width: 100%;
					min-width: calc((var(--width) + var(--gap)) * var(--quantity));
					position: relative;
				}
				
				.slider-item {
					width: var(--width);
					height: var(--height);
					position: absolute;
					left: 100%;
					animation: autoRun var(--duration) linear infinite;
					transition: filter 0.5s;
					animation-delay: calc((var(--duration) / var(--quantity)) * (var(--position) - 1) - var(--duration)) !important;
				}
				
				.slider-item img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				
				@keyframes autoRun {
					from {
						left: 100%;
					}
					to {
            			left: calc((var(--width) + var(--gap)) * -1);
					}
				}
				
				@keyframes reversePlay {
					from {
					    left: calc((var(--width) + var(--gap)) * -1);
					}
					to {
						left: 100%;
					}
				}
				
				.slider:hover .slider-item {
					animation-play-state: paused !important;
					filter: grayscale(1);
				}
				
				.slider .slider-item:hover {
					filter: grayscale(0);
				}
				
				.slider[data-reverse="true"] .slider-item {
					animation-name: reversePlay;
				}
			`}</style>

			<div
				className={`slider ${useMask ? "with-mask" : ""}`}
				style={sliderStyle}
				data-reverse={reverse}
			>
				<div className="slider-list">
					{items.map((item, index) => (
						<div
							key={item.id}
							className="slider-item"
							style={
								{
									"--position": index + 1,
								} as React.CSSProperties
							}
						>
							<img className="rounded-xl" src={item.src} alt={item.alt || ""} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
