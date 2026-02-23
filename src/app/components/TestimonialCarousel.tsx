"use client";

import type React from "react";
import { useState } from "react";

interface Testimonial {
	quote: string;
	author: string;
	position: string;
}

const TestimonialCarousel: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState<number>(0);

	const testimonials: Testimonial[] = [
		{
			quote:
				"Saturday Night Learning has transformed my university experience. The dedicated study space and supportive community have helped me stay consistent with my study goals even during the busiest weeks.",
			author: "Emily Zhang",
			position: "Business Analytics Student, UniMelb",
		},
		{
			quote:
				"Finding a reliable place to study was always a challenge until I joined this study group. Not only did my productivity increase, but I've also made valuable connections that have opened doors to internship opportunities.",
			author: "James Wilson",
			position: "Computer Science Graduate, RMIT",
		},
		{
			quote:
				"As an international student, this study group became my second family. The weekly sessions gave my study routine structure, and the mentorship from seniors helped me navigate the challenges of university life.",
			author: "Sofia Rodriguez",
			position: "Marketing Student, Monash University",
		},
		{
			quote:
				"The connections I've made through Saturday Night Learning have been instrumental in my career development. I landed my first internship through a recommendation from someone I met at these sessions.",
			author: "David Chen",
			position: "Engineering Student, UniMelb",
		},
		{
			quote:
				"I never thought studying on a Saturday night could be so productive and enjoyable. The community aspect, combined with the focused environment, has significantly improved my academic performance.",
			author: "Aisha Patel",
			position: "Psychology Student, La Trobe University",
		},
	];

	const nextSlide = (): void => {
		setCurrentSlide((prev) =>
			prev === testimonials.length - 1 ? 0 : prev + 1,
		);
	};

	const prevSlide = (): void => {
		setCurrentSlide((prev) =>
			prev === 0 ? testimonials.length - 1 : prev - 1,
		);
	};

	const goToSlide = (index: number): void => {
		setCurrentSlide(index);
	};

	return (
		<div className="relative w-full rounded-3xl bg-[#1A1B25] p-6 md:p-12 overflow-hidden">
			<div className="relative min-h-[300px] md:min-h-[250px]">
				<div className="transition-all duration-300 ease-in-out">
					<div className="flex flex-col items-start justify-between gap-8">
						{/* Quote Container */}
						<div className="w-full relative">
							{/* Speech Bubble */}
							<div className="relative rounded-3xl border-2 border-[#FFD800] p-6 md:p-8 text-white">
								<p className="text-lg md:text-xl">
									"{testimonials[currentSlide].quote}"
								</p>
							</div>

							{/* Speech Bubble Arrow - Repositioned */}
							<div className="relative">
								<div
									className="relative h-4 w-4 rotate-45 border-b-2 border-r-2 border-[#FFD800] bg-[#1A1B25]"
									style={{
										left: "3rem",
										top: "-0.5rem",
										marginTop: "12px", // Fine adjustment to connect with border
									}}
								></div>
							</div>

							{/* Author Information */}
							<div className="ml-12 mt-4 text-white">
								<h4 className="text-xl font-bold text-[#FFD800]">
									{testimonials[currentSlide].author}
								</h4>
								<p className="text-white text-opacity-80">
									{testimonials[currentSlide].position}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Navigation Controls */}
				<div className="flex justify-between items-center mt-8 mb-4 w-full">
					<button
						onClick={prevSlide}
						className="text-white opacity-70 hover:opacity-100 transition-opacity p-4"
						aria-label="Previous testimonial"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					<button
						onClick={nextSlide}
						className="text-white opacity-70 hover:opacity-100 transition-opacity p-4"
						aria-label="Next testimonial"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>

				{/* Dots Navigation */}
				<div className="flex justify-center gap-3 mt-2">
					{testimonials.map((_, index: number) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`w-3 h-3 rounded-full transition-all ${
								currentSlide === index ? "bg-[#FFD800]" : "bg-white opacity-30"
							}`}
							aria-label={`Go to testimonial ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default TestimonialCarousel;
