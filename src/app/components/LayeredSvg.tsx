import type React from "react";
import { cloneElement, type ReactElement } from "react";

interface LayeredSvgProps {
	children: ReactElement<React.SVGProps<SVGSVGElement>>;
	layerOffset?: number;
	layerOpacity?: number;
	layerColor?: string;
	className?: string;
}

const LayeredSvg: React.FC<LayeredSvgProps> = ({
	children,
	layerOffset = 100,
	layerOpacity = 0.3,
	layerColor = "#000000",
	className = "",
}) => {
	// Extract original SVG dimensions
	const originalWidth = Number.parseInt(children.props.width as string) || 100;
	const originalHeight =
		Number.parseInt(children.props.height as string) || 100;

	// Calculate new dimensions for the background layer
	const layerWidth = originalWidth + layerOffset;
	const layerHeight = originalHeight + layerOffset;

	// Create the background layer SVG
	const backgroundLayer = cloneElement(children, {
		width: layerWidth,
		height: layerHeight,
		style: {
			...children.props.style,
			opacity: layerOpacity,
			filter: `drop-shadow(0 0 0 ${layerColor})`,
			transform: "scale(1)",
		},
		className: `${children.props.className || ""} layered-svg-background`,
	});

	// Create the foreground SVG (original)
	const foregroundLayer = cloneElement(children, {
		...children.props,
		className: `${children.props.className || ""} layered-svg-foreground`,
		style: {
			...children.props.style,
			position: "relative",
			zIndex: 2,
		},
	});

	return (
		<div className={`relative inline-block ${className}`}>
			{/* Background layer - larger and more transparent */}
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{
					opacity: layerOpacity,
					filter: `brightness(0.8) saturate(0.8)`,
				}}
			>
				{backgroundLayer}
			</div>

			{/* Foreground layer - original SVG */}
			<div
				className="relative z-10 flex items-center justify-center"
				style={{
					width: layerWidth,
					height: layerHeight,
				}}
			>
				{foregroundLayer}
			</div>
		</div>
	);
};

export default LayeredSvg;
