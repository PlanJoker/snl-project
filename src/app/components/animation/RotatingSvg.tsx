import { motion } from "framer-motion";
import Image from "next/image";

interface RotatingSvgProps {
	className?: string;
	src: string;
	alt: string;
	width?: number;
	height?: number;
	duration?: number; // Added duration prop for customizable speed
}

const RotatingSvg: React.FC<RotatingSvgProps> = ({
	className,
	src,
	alt,
	width = 100,
	height = 100,
	duration = 2,
}) => {
	return (
		<motion.div
			className={className}
			animate={{
				rotate: 360,
			}}
			transition={{
				duration,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
			style={{
				width: width,
				height: height,
				display: "inline-block",
			}}
		>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				style={{ width: "100%", height: "100%" }}
			/>
		</motion.div>
	);
};

export default RotatingSvg;
