"use client";
/**
 * SeedTesterData
 * Seeds sample WAM + Calendar data for snl_tester01 on first login.
 * Runs once per browser session, then marks itself done in localStorage.
 */
import { useEffect } from "react";
import { useWAMStore } from "@stores/WAMStore";
import { useCalendarStore } from "@stores/calendarStore";
import { useAuthStore } from "@stores/authStore";

const SEED_KEY = "snl-tester-seeded-v3";
const TESTER_ID = "snl_tester01_seed";

export default function SeedTesterData() {
  const { userId } = useAuthStore();
  const { semesters, addSemester, addSubject, addAssignment } = useWAMStore();
  const { vEventLists, addVEvents } = useCalendarStore();

  useEffect(() => {
    if (userId !== TESTER_ID) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(SEED_KEY)) return;

    // WAM Sample Data
    if (semesters.length === 0) {
      const seedWAM = async () => {
        addSemester("Semester 1, 2024");
        await new Promise((r) => setTimeout(r, 150));
        const sem1 = useWAMStore.getState().semesters.find((s) => s.name === "Semester 1, 2024");
        if (sem1) {
          addSubject(sem1.id, "FIT2004", "Algorithms and Data Structures");
          addSubject(sem1.id, "FIT2099", "Object Oriented Design");
          addSubject(sem1.id, "MTH2010", "Multivariable Calculus");
          addSubject(sem1.id, "FIT2014", "Theory of Computation");
          await new Promise((r) => setTimeout(r, 150));
          const s1 = useWAMStore.getState().semesters.find((s) => s.id === sem1.id);
          if (s1 && s1.subjects.length >= 4) {
            const [a, b, c, d] = s1.subjects;
            addAssignment(s1.id, a.id, { name: "Assignment 1", userScore: 85, maxScore: 100, weight: 20 });
            addAssignment(s1.id, a.id, { name: "Assignment 2", userScore: 78, maxScore: 100, weight: 20 });
            addAssignment(s1.id, a.id, { name: "Final Exam", userScore: 72, maxScore: 100, weight: 60 });
            addAssignment(s1.id, b.id, { name: "Project Part 1", userScore: 88, maxScore: 100, weight: 30 });
            addAssignment(s1.id, b.id, { name: "Project Part 2", userScore: 82, maxScore: 100, weight: 40 });
            addAssignment(s1.id, b.id, { name: "Final Exam", userScore: 75, maxScore: 100, weight: 30 });
            addAssignment(s1.id, c.id, { name: "Test 1", userScore: 65, maxScore: 100, weight: 25 });
            addAssignment(s1.id, c.id, { name: "Test 2", userScore: 70, maxScore: 100, weight: 25 });
            addAssignment(s1.id, c.id, { name: "Final Exam", userScore: 68, maxScore: 100, weight: 50 });
            addAssignment(s1.id, d.id, { name: "Assignment 1", userScore: 90, maxScore: 100, weight: 25 });
            addAssignment(s1.id, d.id, { name: "Assignment 2", userScore: 85, maxScore: 100, weight: 25 });
            addAssignment(s1.id, d.id, { name: "Final Exam", userScore: 80, maxScore: 100, weight: 50 });
          }
        }

        addSemester("Semester 2, 2024");
        await new Promise((r) => setTimeout(r, 150));
        const sem2 = useWAMStore.getState().semesters.find((s) => s.name === "Semester 2, 2024");
        if (sem2) {
          addSubject(sem2.id, "FIT3155", "Advanced Algorithms");
          addSubject(sem2.id, "FIT3171", "Databases");
          addSubject(sem2.id, "FIT3143", "Parallel Computing");
          addSubject(sem2.id, "FIT3094", "AI, Agent and Multi-Agent Systems");
          await new Promise((r) => setTimeout(r, 150));
          const s2 = useWAMStore.getState().semesters.find((s) => s.id === sem2.id);
          if (s2 && s2.subjects.length >= 4) {
            const [a, b, c, d] = s2.subjects;
            addAssignment(s2.id, a.id, { name: "Assignment 1", userScore: 92, maxScore: 100, weight: 30 });
            addAssignment(s2.id, a.id, { name: "Final Exam", userScore: 88, maxScore: 100, weight: 70 });
            addAssignment(s2.id, b.id, { name: "Project", userScore: 86, maxScore: 100, weight: 40 });
            addAssignment(s2.id, b.id, { name: "Final Exam", userScore: 79, maxScore: 100, weight: 60 });
            addAssignment(s2.id, c.id, { name: "Lab Report", userScore: 75, maxScore: 100, weight: 30 });
            addAssignment(s2.id, c.id, { name: "Final Exam", userScore: 72, maxScore: 100, weight: 70 });
            addAssignment(s2.id, d.id, { name: "Assignment", userScore: 88, maxScore: 100, weight: 40 });
            addAssignment(s2.id, d.id, { name: "Final Exam", userScore: 84, maxScore: 100, weight: 60 });
          }
        }

        addSemester("Semester 1, 2025");
        await new Promise((r) => setTimeout(r, 150));
        const sem3 = useWAMStore.getState().semesters.find((s) => s.name === "Semester 1, 2025");
        if (sem3) {
          addSubject(sem3.id, "FIT4003", "Computer Networks");
          addSubject(sem3.id, "FIT4002", "Software Engineering Project");
          addSubject(sem3.id, "FIT3173", "Software Security");
          await new Promise((r) => setTimeout(r, 150));
          const s3 = useWAMStore.getState().semesters.find((s) => s.id === sem3.id);
          if (s3 && s3.subjects.length >= 3) {
            const [a, b, c] = s3.subjects;
            addAssignment(s3.id, a.id, { name: "Assignment", userScore: 80, maxScore: 100, weight: 30 });
            addAssignment(s3.id, a.id, { name: "Final Exam", userScore: 76, maxScore: 100, weight: 70 });
            addAssignment(s3.id, b.id, { name: "Sprint 1", userScore: 85, maxScore: 100, weight: 25 });
            addAssignment(s3.id, b.id, { name: "Sprint 2", userScore: 88, maxScore: 100, weight: 25 });
            addAssignment(s3.id, b.id, { name: "Final Demo", userScore: 90, maxScore: 100, weight: 50 });
            addAssignment(s3.id, c.id, { name: "Assignment", userScore: 78, maxScore: 100, weight: 40 });
            addAssignment(s3.id, c.id, { name: "Final Exam", userScore: 82, maxScore: 100, weight: 60 });
          }
        }
      };
      seedWAM();
    }

    // Calendar Sample Data
    if (vEventLists.length === 0) {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      monday.setHours(0, 0, 0, 0);

      const makeDate = (offsetDays: number, hour: number, minute = 0): Date => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + offsetDays);
        d.setHours(hour, minute, 0, 0);
        return d;
      };

      addVEvents([
        { title: "FIT4003 Lecture", start: makeDate(0, 9), end: makeDate(0, 11), resource: { id: "seed-0", color: "#FFDC73", description: "", location: "Lecture Theatre S3" } },
        { title: "FIT4002 Workshop", start: makeDate(0, 13), end: makeDate(0, 15), resource: { id: "seed-1", color: "#84cc16", description: "", location: "Room 101" } },
        { title: "FIT3173 Lecture", start: makeDate(1, 10), end: makeDate(1, 12), resource: { id: "seed-2", color: "#60a5fa", description: "", location: "Lecture Theatre E1" } },
        { title: "FIT4003 Tutorial", start: makeDate(1, 14), end: makeDate(1, 15), resource: { id: "seed-3", color: "#FFDC73", description: "", location: "Tutorial Room 5" } },
        { title: "FIT4002 Team Meeting", start: makeDate(2, 11), end: makeDate(2, 13), resource: { id: "seed-4", color: "#84cc16", description: "", location: "Library Study Room" } },
        { title: "FIT3173 Tutorial", start: makeDate(2, 15), end: makeDate(2, 16), resource: { id: "seed-5", color: "#60a5fa", description: "", location: "Tutorial Room 3" } },
        { title: "FIT4003 Lab", start: makeDate(3, 9), end: makeDate(3, 11), resource: { id: "seed-6", color: "#FFDC73", description: "", location: "Computer Lab 2" } },
        { title: "Study Group", start: makeDate(3, 14), end: makeDate(3, 17), resource: { id: "seed-7", color: "#f472b6", description: "", location: "Cafe Study Area" } },
        { title: "FIT4002 Sprint Review", start: makeDate(4, 10), end: makeDate(4, 12), resource: { id: "seed-8", color: "#84cc16", description: "", location: "Meeting Room B" } },
        { title: "SNL Saturday Session", start: makeDate(5, 13), end: makeDate(5, 18), resource: { id: "seed-9", color: "#FFDC73", description: "Weekly SNL study session", location: "o3space@brunswick" } },
      ]);
    }

    localStorage.setItem(SEED_KEY, "1");
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
