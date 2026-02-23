"use client";
import React from "react";
import { useWAMStore } from "@/app/stores/WAMStore";
import SemesterCard from "./components/SemesterCard";
import { Plus } from "lucide-react";

export default function WAMPage() {
const { semesters, addSemester, calculateSemesterGPA } = useWAMStore();

const handleAddSemester = () => {
const semesterNum = semesters.length + 1;
addSemester(`Semester ${semesterNum}`);
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
</div>

{/* Semester Cards */}
<div className="flex flex-col gap-4">
{semesters.map((semester) => (
<SemesterCard key={semester.id} semesterId={semester.id} />
))}
</div>

{/* Add Semester Button */}
<button
onClick={handleAddSemester}
className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 py-4 font-medium text-gray-500 transition hover:border-BRAND_COLOR hover:text-DEFUALT_BLACK"
type="button"
>
<Plus size={20} />
Add Semester
</button>
</div>
);
}
