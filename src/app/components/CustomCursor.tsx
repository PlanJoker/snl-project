"use client";

import { useEffect, useRef } from "react";

// import { useEffect, useState } from "react";

// interface Position {
// 	x: number;
// 	y: number;
// }

// interface CustomCursorProps {
// 	size?: number;
// 	color?: string;
// }

// const CustomCursor: React.FC<CustomCursorProps> = ({
// 	size = 16,
// 	color = "#FFDC73",
// }) => {
// 	return <div className="cursor-help" />;
// };

// // const CustomCursor: React.FC<CustomCursorProps> = ({
// // 	size = 24,
// // 	color = "#FFDC73",
// // }) => {
// // 	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
// // 	const [isVisible, setIsVisible] = useState<boolean>(false);
// // 	const [isHovering, setIsHovering] = useState<boolean>(false);

// // 	useEffect(() => {
// // 		const updatePosition = (e: MouseEvent): void => {
// // 			setPosition({ x: e.clientX, y: e.clientY });
// // 		};

// // 		const handleMouseEnter = (): void => setIsVisible(true);
// // 		const handleMouseLeave = (): void => setIsVisible(false);

// // 		// Hover detection for interactive elements
// // 		const handleElementHover = (e: MouseEvent): void => {
// // 			const target = e.target as HTMLElement;
// // 			const isInteractive = target.matches(
// // 				'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), .cursor-hover',
// // 			);
// // 			setIsHovering(isInteractive);
// // 		};

// // 		// Add event listeners
// // 		document.addEventListener("mousemove", updatePosition);
// // 		document.addEventListener("mouseenter", handleMouseEnter);
// // 		document.addEventListener("mouseleave", handleMouseLeave);
// // 		document.addEventListener("mouseover", handleElementHover);

// // 		// Hide default cursor completely - including on interactive elements
// // 		const style = document.createElement("style");
// // 		style.textContent = `
// //             *, *::before, *::after {
// //             cursor: none !important;
// //         }
// //         `;
// // 		document.head.appendChild(style);

// // 		// Cleanup function
// // 		return (): void => {
// // 			document.removeEventListener("mousemove", updatePosition);
// // 			document.removeEventListener("mouseenter", handleMouseEnter);
// // 			document.removeEventListener("mouseleave", handleMouseLeave);
// // 			document.removeEventListener("mouseover", handleElementHover);

// // 			// Remove the style when component unmounts
// // 			if (style.parentNode) {
// // 				style.parentNode.removeChild(style);
// // 			}

// // 			// Reset cursor for body
// // 			document.body.style.cursor = "auto";
// // 		};
// // 	}, []);

// // 	if (!isVisible) return null;

// // 	const currentSize: number = isHovering ? size * 1.5 : size;
// // 	const halfSize: number = currentSize / 2;

// // 	return (
// // 		<div
// // 			className="pointer-events-none fixed top-0 left-0 z-50 rounded-full transition-all duration-200 ease-out"
// // 			style={{
// // 				width: `${currentSize}px`,
// // 				height: `${currentSize}px`,
// // 				backgroundColor: color,
// // 				transform: `translate(${position.x - halfSize}px, ${position.y - halfSize}px)`,
// // 			}}
// // 		/>
// // 	);
// // };

// export default CustomCursor;

const CustomCursor: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleMouseMove = (event: MouseEvent) => {
			// Clear and redraw - this is extremely fast
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.arc(event.clientX, event.clientY, 8, 0, Math.PI * 2);
			ctx.fillStyle = "#FFDC73";
			ctx.fill();
		};

		document.addEventListener("mousemove", handleMouseMove);
		return () => document.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return <canvas ref={canvasRef} /* ... styles */ />;
};

export default CustomCursor;
