"use client";
import React from "react";
import { useWAMStore } from "@/app/stores/WAMStore";
import SemesterCard from "./components/SemesterCard";
import { Plus, Sparkles, Trash2 } from "lucide-react";

// ─── Example Data ────────────────────────────────────────────────────────────
type ExampleAssignment = { name: string; userScore: number; maxScore: number; weight: number };
type ExampleSubject = { code: string; name: string; creditPoints: number; assignments: ExampleAssignment[] };
type ExampleSemester = { name: string; subjects: ExampleSubject[] };

const EXAMPLE_DATA: ExampleSemester[] = [
	{
		name: "Semester 1 (Year 1)",
		subjects: [
			{
				code: "COMP10001",
				name: "Foundations of Computing",
				creditPoints: 12.5,
				assignments: [
					{ name: "Project 1 – Turtle Graphics", userScore: 18, maxScore: 20, weight: 10 },
					{ name: "Project 2 – Text Analysis", userScore: 22, maxScore: 25, weight: 15 },
					{ name: "Mid-Semester Test", userScore: 28, maxScore: 35, weight: 20 },
					{ name: "Final Exam", userScore: 52, maxScore: 60, weight: 55 },
				],
			},
			{
				code: "MAST10006",
				name: "Calculus 2",
				creditPoints: 12.5,
				assignments: [
					{ name: "Assignment 1", userScore: 14, maxScore: 15, weight: 10 },
					{ name: "Assignment 2", userScore: 13, maxScore: 15, weight: 10 },
					{ name: "Mid-Semester Exam", userScore: 38, maxScore: 50, weight: 30 },
					{ name: "Final Exam", userScore: 68, maxScore: 90, weight: 50 },
				],
			},
			{
				code: "ECON10004",
				name: "Introductory Microeconomics",
				creditPoints: 12.5,
				assignments: [
					{ name: "Tutorial Participation", userScore: 8, maxScore: 10, weight: 10 },
					{ name: "Assignment", userScore: 17, maxScore: 20, weight: 20 },
					{ name: "Final Exam", userScore: 55, maxScore: 70, weight: 70 },
				],
			},
		],
	},
	{
		name: "Semester 2 (Year 1)",
		subjects: [
			{
				code: "COMP20003",
				name: "Algorithms and Data Structures",
				creditPoints: 12.5,
				assignments: [
					{ name: "Assignment 1 – Sorting", userScore: 19, maxScore: 20, weight: 15 },
					{ name: "Assignment 2 – Graph Algorithms", userScore: 16, maxScore: 20, weight: 15 },
					{ name: "Mid-Semester Test", userScore: 30, maxScore: 40, weight: 20 },
					{ name: "Final Exam", userScore: 62, maxScore: 80, weight: 50 },
				],
			},
			{
				code: "MAST10007",
				name: "Linear Algebra",
				creditPoints: 12.5,
				assignments: [
					{ name: "Assignment 1", userScore: 12, maxScore: 15, weight: 10 },
					{ name: "Assignment 2", userScore: 14, maxScore: 15, weight: 10 },
					{ name: "Mid-Semester Exam", userScore: 42, maxScore: 50, weight: 30 },
					{ name: "Final Exam", userScore: 72, maxScore: 90, weight: 50 },
				],
			},
			{
				code: "INFO20003",
				name: "Database Systems",
				creditPoints: 12.5,
				assignments: [
					{ name: "Workshop Participation", userScore: 9, maxScore: 10, weight: 10 },
					{ name: "Assignment 1 – ER Modelling", userScore: 23, maxScore: 25, weight: 20 },
					{ name: "Assignment 2 – SQL", userScore: 21, maxScore: 25, weight: 20 },
					{ name: "Final Exam", userScore: 38, maxScore: 50, weight: 50 },
				],
			},
		],
	},
	{
		name: "Semester 1 (Year 2)",
		subjects: [
			{
				code: "COMP30020",
				name: "Declarative Programming",
				creditPoints: 12.5,
				assignments: [
					{ name: "Project 1 – Haskell", userScore: 17, maxScore: 20, weight: 20 },
					{ name: "Project 2 – Prolog", userScore: 15, maxScore: 20, weight: 20 },
					{ name: "Final Exam", userScore: 48, maxScore: 60, weight: 60 },
				],
			},
			{
				code: "SWEN20003",
				name: "Object Oriented Software Development",
				creditPoints: 12.5,
				assignments: [
					{ name: "Project 1 – Shadow Leap", userScore: 28, maxScore: 30, weight: 20 },
					{ name: "Project 2A – Shadow Dimension", userScore: 18, maxScore: 20, weight: 15 },
					{ name: "Project 2B – Shadow Dimension", userScore: 32, maxScore: 40, weight: 25 },
					{ name: "Final Exam", userScore: 34, maxScore: 40, weight: 40 },
				],
			},
		],
	},
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function WAMPage() {
	const { semesters, calculateSemesterGPA } = useWAMStore();

	const handleAddSemester = () => {
		const semesterNum = semesters.length + 1;
		useWAMStore.getState().addSemester(`Semester ${semesterNum}`);
	};

	const handleLoadExample = () => {
		// Reset all data first
		useWAMStore.setState({ semesters: [] });

		for (const semData of EXAMPLE_DATA) {
			const semId = crypto.randomUUID();
			useWAMStore.setState((state) => ({
				semesters: [
					...state.semesters,
					{ id: semId, name: semData.name, subjects: [] },
				],
			}));

			for (const subData of semData.subjects) {
				const subId = crypto.randomUUID();
				useWAMStore.setState((state) => ({
					semesters: state.semesters.map((sem) =>
						sem.id === semId
							? {
									...sem,
									subjects: [
										...sem.subjects,
										{
											id: subId,
											code: subData.code,
											name: subData.name,
											mark: null,
											creditPoints: subData.creditPoints,
											assignments: subData.assignments.map((a) => ({
												id: crypto.randomUUID(),
												name: a.name,
												userScore: a.userScore,
												maxScore: a.maxScore,
												weight: a.weight,
											})),
										},
									],
								}
							: sem
					),
				}));
			}
		}
	};

	const handleClearAll = () => {
		useWAMStore.setState({ semesters: [] });
	};

	// Calculate overall WAM across all semesters
	const allGrades = semesters
		.map((sem) => calculateSemesterGPA(sem.id))
		.filter((g): g is number => g !== null);
	const overallWAM =
		allGrades.length > 0
			? allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length
			: null;

	const calculateGrade = (wam: number): string => {
		if (wam >= 80) return "H1";
		if (wam >= 75) return "H2A";
		if (wam >= 70) return "H2B";
		if (wam >= 65) return "H3";
		if (wam >= 50) return "P";
		return "N";
	};

	const totalSubjects = semesters.reduce(
		(sum, sem) => sum + sem.subjects.length,
		0,
	);

	return (
		<div className="flex h-full w-full flex-col gap-4 p-2">
			{/* Header Card */}
			<div className="rounded-2xl border border-BRAND_COLOR bg-DEFUALT_BLACK p-5 text-DEFUALT_WHITE shadow-sm">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="font-bold text-2xl text-BRAND_COLOR">
							SNL WAM Calculator
						</h1>
						<p className="mt-1 text-gray-300 text-sm">
							Track your Weighted Average Mark across all semesters. Add
							semesters and subjects to calculate your overall WAM.
						</p>
					</div>
					{/* Overall WAM Display */}
					<div className="flex items-center gap-6 rounded-xl bg-white/10 px-6 py-3">
						<div className="text-center">
							<p className="text-gray-400 text-xs uppercase tracking-wider">
								Overall WAM
							</p>
							<p className="font-bold text-3xl text-BRAND_COLOR">
								{overallWAM !== null ? overallWAM.toFixed(1) : "—"}
							</p>
						</div>
						<div className="text-center">
							<p className="text-gray-400 text-xs uppercase tracking-wider">
								Grade
							</p>
							<p className="font-bold text-2xl text-white">
								{overallWAM !== null ? calculateGrade(overallWAM) : "—"}
							</p>
						</div>
						<div className="text-center">
							<p className="text-gray-400 text-xs uppercase tracking-wider">
								Subjects
							</p>
							<p className="font-bold text-2xl text-white">{totalSubjects}</p>
						</div>
					</div>
				</div>

				{/* Example / Clear Buttons */}
				<div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
					<button
						type="button"
						onClick={handleLoadExample}
						className="flex items-center gap-2 rounded-xl bg-BRAND_COLOR px-4 py-2 font-semibold text-DEFUALT_BLACK text-sm transition hover:opacity-80"
					>
						<Sparkles size={15} />
						Load Example Data
					</button>
					{semesters.length > 0 && (
						<button
							type="button"
							onClick={handleClearAll}
							className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 font-medium text-gray-300 text-sm transition hover:border-red-400 hover:text-red-400"
						>
							<Trash2 size={15} />
							Clear All
						</button>
					)}
					<p className="ml-auto text-gray-500 text-xs hidden md:block">
						Example: 3 semesters · 8 subjects · UniMelb CS curriculum
					</p>
				</div>
			</div>

			{/* Empty State */}
			{semesters.length === 0 && (
				<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
					<div className="mb-4 text-5xl">🎓</div>
					<p className="font-semibold text-gray-700 text-lg">No semesters yet</p>
					<p className="mt-1 text-gray-400 text-sm">
						Add a semester manually or load the example data to get started.
					</p>
					<div className="mt-6 flex gap-3">
						<button
							type="button"
							onClick={handleLoadExample}
							className="flex items-center gap-2 rounded-xl bg-DEFUALT_BLACK px-5 py-2.5 font-semibold text-BRAND_COLOR text-sm transition hover:opacity-80"
						>
							<Sparkles size={15} />
							Load Example
						</button>
						<button
							type="button"
							onClick={handleAddSemester}
							className="flex items-center gap-2 rounded-xl border-2 border-gray-300 px-5 py-2.5 font-medium text-gray-600 text-sm transition hover:border-DEFUALT_BLACK hover:text-DEFUALT_BLACK"
						>
							<Plus size={15} />
							Add Semester
						</button>
					</div>
				</div>
			)}

			{/* Semester Cards */}
			<div className="flex flex-col gap-4">
				{semesters.map((semester) => (
					<SemesterCard key={semester.id} semesterId={semester.id} />
				))}
			</div>

			{/* Add Semester Button (when semesters exist) */}
			{semesters.length > 0 && (
				<button
					onClick={handleAddSemester}
					className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 py-4 font-medium text-gray-500 transition hover:border-BRAND_COLOR hover:text-DEFUALT_BLACK"
					type="button"
				>
					<Plus size={20} />
					Add Semester
				</button>
			)}
		</div>
	);
}
