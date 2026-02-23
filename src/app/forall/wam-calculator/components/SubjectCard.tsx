"use client";
import { useState } from "react";
import { useWAMStore } from "@/app/stores/WAMStore";
import ScoreChart from "./ScoreChart";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

interface SubjectCardProps {
semesterId: string;
subjectId: string;
className?: string;
}

interface AssignmentRowProps {
semesterId: string;
subjectId: string;
assignmentId: string;
}

function AssignmentRow({ semesterId, subjectId, assignmentId }: AssignmentRowProps) {
const assignment = useWAMStore((state) =>
state.getAssignment(semesterId, subjectId, assignmentId),
);
const updateAssignment = useWAMStore((state) => state.updateAssignment);
const removeAssignment = useWAMStore((state) => state.removeAssignment);

if (!assignment) return null;

return (
<div className="grid grid-cols-[1fr_80px_80px_70px_32px] gap-1 items-center text-sm">
<input
className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:border-BRAND_COLOR focus:outline-none"
placeholder="Assignment name"
value={assignment.name}
onChange={(e) =>
updateAssignment(semesterId, subjectId, assignmentId, { name: e.target.value })
}
/>
<input
className="rounded border border-gray-200 bg-white px-2 py-1 text-center text-sm focus:border-BRAND_COLOR focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
type="number"
min="0"
step="0.1"
placeholder="Score"
value={assignment.userScore ?? ""}
onChange={(e) =>
updateAssignment(semesterId, subjectId, assignmentId, {
userScore: e.target.value === "" ? null : Number(e.target.value),
})
}
/>
<input
className="rounded border border-gray-200 bg-white px-2 py-1 text-center text-sm focus:border-BRAND_COLOR focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
type="number"
min="0"
step="0.1"
placeholder="Max"
value={assignment.maxScore ?? ""}
onChange={(e) =>
updateAssignment(semesterId, subjectId, assignmentId, {
maxScore: e.target.value === "" ? null : Number(e.target.value),
})
}
/>
<input
className="rounded border border-gray-200 bg-white px-2 py-1 text-center text-sm focus:border-BRAND_COLOR focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
type="number"
min="0"
max="100"
step="1"
placeholder="%"
value={assignment.weight ?? ""}
onChange={(e) =>
updateAssignment(semesterId, subjectId, assignmentId, {
weight: e.target.value === "" ? null : Number(e.target.value),
})
}
/>
<button
type="button"
onClick={() => removeAssignment(semesterId, subjectId, assignmentId)}
className="flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
>
<Trash2 size={14} />
</button>
</div>
);
}

const calculateGrade = (wam: number): string => {
if (wam >= 80) return "H1";
if (wam >= 75) return "H2A";
if (wam >= 70) return "H2B";
if (wam >= 65) return "H3";
if (wam >= 50) return "P";
if (wam >= 45) return "N*";
return "N";
};

export default function SubjectCard({
semesterId,
subjectId,
className,
}: SubjectCardProps) {
const subject = useWAMStore((state) =>
state.getSubject(semesterId, subjectId),
);
const updateSubject = useWAMStore((state) => state.updateSubject);
const removeSubject = useWAMStore((state) => state.removeSubject);
const addAssignment = useWAMStore((state) => state.addAssignment);
const calculateSubjectGrade = useWAMStore((state) => state.calculateSubjectGrade);

const [isExpanded, setIsExpanded] = useState(false);

if (!subject) return null;

const subjectWAM = calculateSubjectGrade(semesterId, subjectId);
const grade = subjectWAM !== null ? calculateGrade(subjectWAM) : null;

const totalWeight = subject.assignments.reduce(
(sum, a) => sum + (a.weight ?? 0),
0,
);

const handleAddAssignment = () => {
addAssignment(semesterId, subjectId, {
name: "",
userScore: null,
maxScore: null,
weight: null,
});
setIsExpanded(true);
};

const handleRemoveSubject = () => {
removeSubject(semesterId, subjectId);
};

return (
<div
className={clsx(
"flex flex-col rounded-xl bg-BRAND_COLOR shadow-sm overflow-hidden",
className,
)}
>
{/* Subject Header */}
<div className="flex items-start gap-3 p-3">
{/* Score Chart */}
<div className="flex-shrink-0">
{subjectWAM !== null ? (
<ScoreChart
subjectWAM={Math.round(subjectWAM)}
overallWAM={0}
grade={grade || "—"}
/>
) : (
<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-DEFUALT_BLACK/20 bg-white/30">
<span className="text-DEFUALT_BLACK/50 text-xs font-medium text-center">No data</span>
</div>
)}
</div>

{/* Subject Info */}
<div className="flex flex-1 flex-col gap-1 min-w-0">
<input
className="w-full bg-transparent font-bold text-xl text-DEFUALT_BLACK placeholder-DEFUALT_BLACK/40 focus:outline-none"
name="subjectCode"
value={subject.code}
placeholder="Subject Code"
onChange={(e) =>
updateSubject(semesterId, subjectId, { code: e.target.value })
}
/>
<input
className="w-full bg-transparent text-DEFUALT_BLACK/70 text-sm placeholder-DEFUALT_BLACK/40 focus:outline-none"
name="subjectName"
value={subject.name}
placeholder="Subject Name"
onChange={(e) =>
updateSubject(semesterId, subjectId, { name: e.target.value })
}
/>
<div className="flex gap-3 text-xs text-DEFUALT_BLACK/70 mt-1">
<span>
WAM: <strong>{subjectWAM !== null ? subjectWAM.toFixed(1) : "—"}</strong>
</span>
<span>
Grade: <strong>{grade || "—"}</strong>
</span>
<span className={clsx(totalWeight > 100 ? "text-red-600 font-bold" : "")}>
Weight: <strong>{totalWeight.toFixed(0)}%</strong>
{totalWeight > 100 && " ⚠️"}
</span>
</div>
</div>

{/* Actions */}
<div className="flex flex-col gap-1">
<button
type="button"
onClick={() => setIsExpanded(!isExpanded)}
className="rounded-lg bg-DEFUALT_BLACK/10 p-1 text-DEFUALT_BLACK hover:bg-DEFUALT_BLACK/20 transition-colors"
>
{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
</button>
<button
type="button"
onClick={handleRemoveSubject}
className="rounded-lg bg-DEFUALT_BLACK/10 p-1 text-DEFUALT_BLACK hover:bg-red-500 hover:text-white transition-colors"
>
<Trash2 size={16} />
</button>
</div>
</div>

{/* Assignments Section */}
{isExpanded && (
<div className="border-t border-DEFUALT_BLACK/10 bg-white/60 p-3">
{subject.assignments.length > 0 && (
<>
{/* Column Headers */}
<div className="grid grid-cols-[1fr_80px_80px_70px_32px] gap-1 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
<span>Name</span>
<span className="text-center">Score</span>
<span className="text-center">Max</span>
<span className="text-center">Weight%</span>
<span />
</div>
{/* Assignment Rows */}
<div className="flex flex-col gap-1 mb-3">
{subject.assignments.map((assignment) => (
<AssignmentRow
key={assignment.id}
semesterId={semesterId}
subjectId={subjectId}
assignmentId={assignment.id}
/>
))}
</div>
</>
)}

<button
type="button"
onClick={handleAddAssignment}
className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-2 text-gray-500 text-sm hover:border-DEFUALT_BLACK hover:text-DEFUALT_BLACK transition-colors"
>
<Plus size={14} />
Add Assignment
</button>
</div>
)}
</div>
);
}
