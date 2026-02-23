// src/app > wam_calculator > ScoreChart.tsx
"use client";

import React from "react";
import { Cell, Pie, PieChart } from "recharts";

type ScoreChartProps = {
	subjectWAM: number;
	overallWAM: number;
	grade: string;
};

export default function ScoreChart({
	subjectWAM,
	overallWAM,
	grade,
}: ScoreChartProps) {
	const total = subjectWAM + overallWAM;
	const data = [
		{ name: "Subject WAM", value: subjectWAM },
		{ name: "Overall WAM", value: overallWAM },
		{ name: "Remaining", value: Math.max(0, 100 - total) },
	];

	const COLORS = ["#305BAB", "#BD0A0A", "#e5e7eb"]; // Subject = Dark-blue, Overall = Margenta, Remaining = gray

	return (
		<div className="relative w-40 h-40 flex items-center justify-center">
			{/* Pie Chart */}
			<PieChart width={120} height={120}>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					innerRadius={30}
					outerRadius={50}
					startAngle={90}
					endAngle={-270}
					dataKey="value"
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
			</PieChart>

			{/* Inner Score Circle */}
			<div className="absolute w-16 h-16 rounded-full border-1 border-black flex items-center justify-center">
				<div className="text-center leading-tight">
					<p className="text-xs text-gray-600">Score</p>
					<p className="font-bold text-sm text-blue-700">{grade}</p>
				</div>
			</div>
		</div>
	);
}
