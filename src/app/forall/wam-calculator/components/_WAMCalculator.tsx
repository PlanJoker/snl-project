"use client";
import React, { useState } from "react";

type Assignment = {
	obtained: number;
	total: number;
	weight: number;
};

type SubjectData = {
	normalisedGrades: number[];
	weights: number[];
	wam: number;
};

export default function WAMCalculator() {
	const [subjects, setSubjects] = useState<Record<string, SubjectData>>({});
	const [numSubjects, setNumSubjects] = useState<number>(0);
	const [currentSubject, setCurrentSubject] = useState<string>("");
	const [numAssign, setNumAssign] = useState<number>(0);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [results, setResults] = useState<number | null>(null);

	const handleAddSubject = () => {
		const newSubjects = { ...subjects };
		newSubjects[currentSubject] = {
			normalisedGrades: assignments.map((a) => a.obtained / a.total),
			weights: assignments.map((a) => a.weight / 1020),
			wam: computeWAM(
				assignments.map((a) => a.obtained / a.total),
				assignments.map((a) => a.weight / 1020),
			),
		};
		setSubjects(newSubjects);
		setResults(computeResults(newSubjects));
		setCurrentSubject("");
		setAssignments([]);
	};

	const computeWAM = (
		normalisedGrades: number[],
		weights: number[],
	): number => {
		const weightedScores = normalisedGrades.map((ng, i) => ng * weights[i]);
		return weightedScores.reduce((sum, score) => sum + score, 0) * 100; // Convert to percentage
	};

	const computeResults = (subjects: Record<string, SubjectData>): number => {
		const subjectKeys = Object.keys(subjects);
		if (subjectKeys.length === 0) return 0;
		return (
			subjectKeys
				.map((subject) => subjects[subject].wam)
				.reduce((sum, wam) => sum + wam, 0) / subjectKeys.length
		);
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-center mb-4">WAM Calculator</h2>
			<div className="mb-4">
				<label className="block font-semibold">
					Enter the number of subjects:
				</label>
				<input
					type="number"
					className="w-full p-2 border rounded-md"
					value={numSubjects}
					onChange={(e) => setNumSubjects(Number.parseInt(e.target.value, 10))}
				/>
			</div>
			<div className="mb-4">
				<label className="block font-semibold">Enter the subject code:</label>
				<input
					type="text"
					className="w-full p-2 border rounded-md"
					value={currentSubject}
					onChange={(e) => setCurrentSubject(e.target.value)}
				/>
			</div>
			<div className="mb-4">
				<label className="block font-semibold">
					Enter the number of assignments/exams:
				</label>
				<input
					type="number"
					className="w-full p-2 border rounded-md"
					value={numAssign}
					onChange={(e) => setNumAssign(Number.parseInt(e.target.value, 10))}
				/>
			</div>
			<div>
				{Array.from({ length: numAssign }).map((_, i) => (
					<div key={i} className="mb-4 p-4 bg-white rounded-md shadow-sm">
						<label className="block font-semibold">
							Assignment {i + 1} (obtained/total):
						</label>
						<input
							type="text"
							className="w-full p-2 border rounded-md mb-2"
							onChange={(e) => {
								const [obtained, total] = e.target.value.split("/").map(Number);
								const updatedAssignments = [...assignments];
								updatedAssignments[i] = {
									...updatedAssignments[i],
									obtained,
									total,
								};
								setAssignments(updatedAssignments);
							}}
						/>
						<label className="block font-semibold">Weightage (%):</label>
						<input
							type="number"
							className="w-full p-2 border rounded-md"
							onChange={(e) => {
								const weight = Number.parseFloat(e.target.value);
								const updatedAssignments = [...assignments];
								updatedAssignments[i] = { ...updatedAssignments[i], weight };
								setAssignments(updatedAssignments);
							}}
						/>
					</div>
				))}
			</div>
			<button
				className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
				onClick={handleAddSubject}
			>
				Add Subject
			</button>
			<h3 className="text-xl font-bold mt-6">Results:</h3>
			{Object.entries(subjects).map(([subject, data]) => (
				<div key={subject} className="p-4 bg-white rounded-md shadow-sm mt-2">
					<p className="font-semibold">Subject Code: {subject}</p>
					<p>Weighted Average Mean: {data.wam.toFixed(2)}</p>
				</div>
			))}
			<h3 className="text-xl font-bold mt-6">
				Overall Average WAM: {results !== null ? results.toFixed(2) : "N/A"}
			</h3>
		</div>
	);
}
