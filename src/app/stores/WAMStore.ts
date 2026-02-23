import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types
export interface Assignment {
  id: string; // need string to use crypto.randomUUID()
  name: string;
  userScore: number | null;
  maxScore: number | null;
  weight: number | null;
}

export interface Subject {
  id: string; // need string to use crypto.randomUUID()
  code: string;
  name: string;
  mark: number | null;
  creditPoints: number | null;
  assignments: Assignment[];
}

export interface Semester {
  id: string; // need string to use crypto.randomUUID()
  name: string;
  subjects: Subject[];
}

interface WAMStore {
  semesters: Semester[];
  
  // Semester actions
  addSemester: (name: string) => void;
  getSemester: (semesterId: string) => Semester | undefined;
  removeSemester: (semesterId: string) => void;
  updateSemester: (semesterId: string, name: string) => void;
  
  // Subject actions
  addSubject: (semesterId: string, code:string, name: string) => void;
  getSubject: (semesterId: string, subjectId: string) => Subject | undefined;
  removeSubject: (semesterId: string, subjectId: string) => void;
  updateSubject: (semesterId: string, subjectId: string, updates: Partial<Omit<Subject, 'id' | 'assignments'>>) => void;
  
  // Assignment actions
  addAssignment: (semesterId: string, subjectId: string, assignment: Omit<Assignment, 'id'>) => void;
  getAssignment: (semesterId: string, subjectId: string, assignmentId: string) => Assignment | undefined;
  removeAssignment: (semesterId: string, subjectId: string, assignmentId: string) => void;
  updateAssignment: (semesterId: string, subjectId: string, assignmentId: string, assignment: Partial<Assignment>) => void;
  
  // Utility functions
  calculateSubjectGrade: (semesterId: string, subjectId: string) => number | null;
  calculateSemesterGPA: (semesterId: string) => number | null;
}

export const useWAMStore = create<WAMStore>()( // combination of currying, middleware
  devtools(
    persist( (set, get) => ({
        // ▼ From here, every thing are elements of objects

        semesters: [],

        // Semester actions
        addSemester: (name: string) =>
          set((state) => ({
            semesters: [
              ...state.semesters,
              {
                id: crypto.randomUUID(),
                name,
                subjects: []
              }
            ]
        })),

        getSemester: (semesterId: string) => {
            return get().semesters.find(semester => semester.id === semesterId)
        },

        removeSemester: (semesterId: string) =>
          set((state) => ({
            semesters: state.semesters.filter(semester => semester.id !== semesterId)
          })),

        updateSemester: (semesterId: string, name: string) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId ? { ...semester, name } : semester
            )
          })),

        // Subject actions
        addSubject: (semesterId: string, code:string ,name: string) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId
                ? {
                    ...semester,
                    subjects: semester.subjects.length < 4
                      ? [
                          ...semester.subjects,
                          {
                            id: crypto.randomUUID(),
                            code,
                            name,
                            mark: null,
                            creditPoints: null,
                            assignments: []
                          }
                        ]
                      : semester.subjects // Don't add if already 4 subjects
                  }
                : semester
            )
          })),

        getSubject: (semesterId: string, subjectId: string) => {
        const semester = get().getSemester(semesterId)
        return semester?.subjects.find(subject => subject.id === subjectId)
        },

        removeSubject: (semesterId: string, subjectId: string) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId
                ? {
                    ...semester,
                    subjects: semester.subjects.filter(subject => subject.id !== subjectId)
                  }
                : semester
            )
          })),

        updateSubject: (semesterId: string, subjectId: string, updates: Partial<Omit<Subject, 'id' | 'assignments'>>) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId
                ? {
                    ...semester,
                    subjects: semester.subjects.map(subject =>
                      subject.id === subjectId ? { ...subject, ...updates } : subject
                    )
                  }
                : semester
            )
          })),

        // Assignment actions
        addAssignment: (semesterId: string, subjectId: string, assignment: Omit<Assignment, 'id'>) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId
                ? {
                    ...semester,
                    subjects: semester.subjects.map(subject =>
                      subject.id === subjectId
                        ? {
                            ...subject,
                            assignments: [
                              ...subject.assignments,
                              {
                                ...assignment,
                                id: crypto.randomUUID()
                              }
                            ]
                          }
                        : subject
                    )
                  }
                : semester
            )
          })),

        getAssignment: (semesterId: string, subjectId: string, assignmentId: string) => {
        const subject = get().getSubject(semesterId, subjectId)
        return subject?.assignments.find(assignment => assignment.id === assignmentId)
        },

        removeAssignment: (semesterId: string, subjectId: string, assignmentId: string) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId
                ? {
                    ...semester,
                    subjects: semester.subjects.map(subject =>
                      subject.id === subjectId
                        ? {
                            ...subject,
                            assignments: subject.assignments.filter(assignment => assignment.id !== assignmentId)
                          }
                        : subject
                    )
                  }
                : semester
            )
          })),

        updateAssignment: (semesterId: string, subjectId: string, assignmentId: string, assignment: Partial<Assignment>) =>
          set((state) => ({
            semesters: state.semesters.map(semester =>
              semester.id === semesterId
                ? {
                    ...semester,
                    subjects: semester.subjects.map(subject =>
                      subject.id === subjectId
                        ? {
                            ...subject,
                            assignments: subject.assignments.map(a =>
                              a.id === assignmentId ? { ...a, ...assignment } : a
                            )
                          }
                        : subject
                    )
                  }
                : semester
            )
          })),

        // Utility functions
        calculateSubjectGrade: (semesterId: string, subjectId: string) => {
          const subject = get().getSubject(semesterId, subjectId)
          if (!subject || subject.assignments.length === 0) return null

          const validAssignments = subject.assignments.filter(
            a => a.userScore !== null && a.maxScore !== null && a.weight !== null
          )

          if (validAssignments.length === 0) return null

          const totalWeightedScore = validAssignments.reduce(
            (sum, a) => sum + (a.userScore! / a.maxScore!) * a.weight!, 0
          )
          const totalWeight = validAssignments.reduce((sum, a) => sum + a.weight!, 0)

          return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : null
        },

        calculateSemesterGPA: (semesterId: string) => {
          const semester = get().getSemester(semesterId)
          if (!semester || semester.subjects.length === 0) return null

          const subjectGrades = semester.subjects
            .map(subject => get().calculateSubjectGrade(semesterId, subject.id))
            .filter(grade => grade !== null) as number[]

          if (subjectGrades.length === 0) return null

          return subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length
        }
      }),
      {
        name: 'wam-storage'
      }
    )
  )
)