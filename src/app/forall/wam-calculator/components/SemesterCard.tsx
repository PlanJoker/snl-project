"use client";
import { ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";
import SubjectCard from "./SubjectCard";
import { useWAMStore } from "@/app/stores/WAMStore";
import clsx from "clsx";

interface SemesterCardProps {
semesterId: string;
}

export default function SemesterCard({ semesterId }: SemesterCardProps) {
const { getSemester, removeSemester, updateSemester, addSubject, calculateSemesterGPA } = useWAMStore();
const semester = getSemester(semesterId);
const [isEditingTitle, setIsEditingTitle] = useState(false);
const [editTitle, setEditTitle] = useState(semester?.name || "");
const [isCollapsed, setIsCollapsed] = useState(false);

if (!semester) return null;

const semesterGPA = calculateSemesterGPA(semesterId);

const handleRenameToggle = () => {
if (isEditingTitle) {
if (!editTitle.trim()) {
alert("Semester title cannot be empty.");
return;
}
updateSemester(semesterId, editTitle.trim());
} else {
setEditTitle(semester.name);
}
setIsEditingTitle(!isEditingTitle);
};

const handleAddSubject = () => {
addSubject(semesterId, "", "");
};

const handleDeleteSemester = () => {
if (confirm(`Delete "${semester.name}"?`)) {
removeSemester(semesterId);
}
};

const calculateGrade = (wam: number): string => {
if (wam >= 80) return "H1";
if (wam >= 75) return "H2A";
if (wam >= 70) return "H2B";
if (wam >= 65) return "H3";
if (wam >= 50) return "P";
return "N";
};

return (
<div className="w-full rounded-2xl border bg-white shadow-sm">
{/* Header */}
<div className="flex items-center justify-between rounded-t-2xl bg-DEFUALT_BLACK px-4 py-3">
<div className="flex items-center gap-2">
{isEditingTitle ? (
<input
type="text"
value={editTitle}
onChange={(e) => setEditTitle(e.target.value)}
className="rounded border border-gray-400 bg-white px-2 py-1 font-semibold text-black text-lg"
onKeyDown={(e) => e.key === "Enter" && handleRenameToggle()}
/>
) : (
<h2 className="font-semibold text-BRAND_COLOR text-lg uppercase">
{semester.name}
</h2>
)}
<button
onClick={handleRenameToggle}
className="text-gray-400 hover:text-BRAND_COLOR transition-colors"
type="button"
>
{isEditingTitle ? <Save size={16} /> : <Pencil size={16} />}
</button>
</div>
<div className="flex items-center gap-3">
{semesterGPA !== null && (
<div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1">
<span className="text-gray-300 text-sm">WAM:</span>
<span className="font-bold text-BRAND_COLOR">{semesterGPA.toFixed(1)}</span>
<span className="text-gray-300 text-sm">({calculateGrade(semesterGPA)})</span>
</div>
)}
<button
onClick={() => setIsCollapsed(!isCollapsed)}
className="text-gray-400 hover:text-white transition-colors"
type="button"
>
{isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
</button>
<button
onClick={handleDeleteSemester}
className="text-gray-400 hover:text-red-400 transition-colors"
type="button"
>
<Trash2 size={18} />
</button>
</div>
</div>

{/* Content */}
{!isCollapsed && (
<div className="p-4">
{/* Subjects Grid */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
{semester.subjects.map((subject) => (
<SubjectCard
key={subject.id}
semesterId={semesterId}
subjectId={subject.id}
/>
))}
</div>

{/* Add Subject Button */}
<button
onClick={handleAddSubject}
className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-gray-400 text-sm transition hover:border-BRAND_COLOR hover:text-DEFUALT_BLACK"
type="button"
>
<Plus size={16} />
Add Subject
</button>
</div>
)}
</div>
);
}
