"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AIReport, PracticePlan, ProgressReport, Session, Student, StudentSkill, SupportLevel } from "@/types";
import {
  aiReports as seedAIReports,
  goals,
  practicePlans as seedPracticePlans,
  progressReports as seedProgressReports,
  sessions as seedSessions,
  skills,
  skillsById,
  studentSkills as seedStudentSkills,
  students as seedStudents,
} from "@/data";

export type DemoRole = "Tutor" | "Program Lead" | "Administrator";

export interface DemoActivity {
  id: string;
  createdOn: string;
  label: string;
  detail: string;
  studentId?: string;
}

export interface DemoState {
  role: DemoRole;
  students: Student[];
  studentSkills: StudentSkill[];
  sessions: Session[];
  aiReports: AIReport[];
  practicePlans: PracticePlan[];
  progressReports: ProgressReport[];
  activity: DemoActivity[];
}

interface DemoContextValue extends DemoState {
  setRole: (role: DemoRole) => void;
  addStudent: (student: Student) => void;
  updateStudent: (studentId: string, patch: Partial<Student>) => void;
  archiveStudent: (studentId: string) => void;
  restoreStudent: (studentId: string) => void;
  addSession: (session: Session) => void;
  updateSkillMastery: (studentId: string, skillName: string, mastery: number) => void;
  saveAIReport: (report: AIReport) => void;
  savePracticePlan: (plan: PracticePlan) => void;
  saveProgressReport: (report: ProgressReport) => void;
  resetDemo: () => void;
  getStudentById: (studentId: string) => Student | undefined;
  getStudentSkills: (studentId: string) => Array<StudentSkill & { skill?: (typeof skills)[number] }>;
  getStudentSessions: (studentId: string) => Session[];
  getStudentReports: (studentId: string) => AIReport[];
  getStudentPracticePlans: (studentId: string) => PracticePlan[];
  getStudentProgressReports: (studentId: string) => ProgressReport[];
  dashboardStats: {
    totalStudents: number;
    needingSupport: number;
    sessionsThisWeek: number;
    averageMastery: number;
    reportsGenerated: number;
    activePlans: number;
  };
}

const STORAGE_KEY = "skillbridge-demo-state-v1";
const ARCHIVE_PREFIX = "[Archived] ";

const initialActivity: DemoActivity[] = [
  {
    id: "act-demo-ready",
    createdOn: new Date().toISOString(),
    label: "Interactive demo loaded",
    detail: "Fictional students, sessions, skills, plans, and reports are ready to explore.",
  },
];

function createInitialState(): DemoState {
  return {
    role: "Tutor",
    students: seedStudents,
    studentSkills: seedStudentSkills,
    sessions: seedSessions,
    aiReports: seedAIReports,
    practicePlans: seedPracticePlans,
    progressReports: seedProgressReports,
    activity: initialActivity,
  };
}

const DemoContext = createContext<DemoContextValue | null>(null);

function isArchived(student: Student) {
  return student.needsSupport.includes(`${ARCHIVE_PREFIX}demo`);
}

function supportFromMastery(mastery: number): SupportLevel {
  if (mastery < 50) return "High Priority";
  if (mastery < 65) return "Needs Support";
  if (mastery < 78) return "Improving";
  return "On Track";
}

function isoWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${week}`;
}

function recomputeStudent(student: Student, allSkills: StudentSkill[], sessions: Session[]) {
  const mine = allSkills.filter((s) => s.studentId === student.id);
  const averageMastery = mine.length
    ? Math.round(mine.reduce((sum, s) => sum + s.mastery, 0) / mine.length)
    : student.averageMastery;
  const latestSession = sessions
    .filter((s) => s.studentId === student.id)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  return {
    ...student,
    averageMastery,
    supportLevel: supportFromMastery(averageMastery),
    lastSessionOn: latestSession?.date ?? student.lastSessionOn,
  };
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(createInitialState);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      setState({ ...createInitialState(), ...JSON.parse(stored) });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addActivity = (label: string, detail: string, studentId?: string) => {
    const item: DemoActivity = {
      id: `act-${Date.now()}`,
      createdOn: new Date().toISOString(),
      label,
      detail,
      studentId,
    };
    return item;
  };

  const value = useMemo<DemoContextValue>(() => {
    const activeStudents = state.students.filter((s) => !isArchived(s));
    const studentsById = Object.fromEntries(state.students.map((s) => [s.id, s]));
    const latest = state.sessions.reduce(
      (max, s) => (+new Date(s.date) > +new Date(max) ? s.date : max),
      state.sessions[0]?.date ?? new Date().toISOString(),
    );
    const latestWeek = isoWeek(new Date(latest));
    const averageMastery = Math.round(
      activeStudents.reduce((sum, s) => sum + s.averageMastery, 0) / Math.max(1, activeStudents.length),
    );

    return {
      ...state,
      setRole: (role) =>
        setState((prev) => ({
          ...prev,
          role,
          activity: [addActivity("Role switched", `Demo perspective changed to ${role}.`), ...prev.activity].slice(0, 20),
        })),
      addStudent: (student) =>
        setState((prev) => ({
          ...prev,
          students: [student, ...prev.students],
          activity: [addActivity("Student added", `${student.firstName} ${student.lastName} was added to the demo roster.`, student.id), ...prev.activity].slice(0, 20),
        })),
      updateStudent: (studentId, patch) =>
        setState((prev) => ({
          ...prev,
          students: prev.students.map((s) => (s.id === studentId ? { ...s, ...patch } : s)),
          activity: [addActivity("Student updated", "Student profile details were edited.", studentId), ...prev.activity].slice(0, 20),
        })),
      archiveStudent: (studentId) =>
        setState((prev) => ({
          ...prev,
          students: prev.students.map((s) =>
            s.id === studentId && !isArchived(s)
              ? { ...s, needsSupport: [...s.needsSupport, `${ARCHIVE_PREFIX}demo`] }
              : s,
          ),
          activity: [addActivity("Student archived", "The student is hidden from active roster counts.", studentId), ...prev.activity].slice(0, 20),
        })),
      restoreStudent: (studentId) =>
        setState((prev) => ({
          ...prev,
          students: prev.students.map((s) =>
            s.id === studentId
              ? { ...s, needsSupport: s.needsSupport.filter((n) => n !== `${ARCHIVE_PREFIX}demo`) }
              : s,
          ),
          activity: [addActivity("Student restored", "The student is active again in the demo roster.", studentId), ...prev.activity].slice(0, 20),
        })),
      addSession: (session) =>
        setState((prev) => {
          const sessions = [session, ...prev.sessions];
          const studentSkills = prev.studentSkills.map((skill) => {
            if (skill.studentId !== session.studentId) return skill;
            const skillName = skillsById[skill.skillId]?.name ?? "";
            if (!skillName.toLowerCase().includes(session.skillFocus.toLowerCase().slice(0, 8))) return skill;
            const nextMastery = Math.max(0, Math.min(100, Math.round((skill.mastery + session.performanceScore) / 2)));
            return { ...skill, previousMastery: skill.mastery, mastery: nextMastery, updatedOn: session.date };
          });
          const students = prev.students.map((student) =>
            student.id === session.studentId ? recomputeStudent(student, studentSkills, sessions) : student,
          );
          return {
            ...prev,
            sessions,
            studentSkills,
            students,
            activity: [addActivity("Session saved", `${session.skillFocus} session logged with a ${session.performanceScore}% score.`, session.studentId), ...prev.activity].slice(0, 20),
          };
        }),
      updateSkillMastery: (studentId, skillName, mastery) =>
        setState((prev) => {
          let touched = false;
          const studentSkills = prev.studentSkills.map((skill) => {
            if (skill.studentId !== studentId) return skill;
            const name = skillsById[skill.skillId]?.name ?? "";
            if (!name.toLowerCase().includes(skillName.toLowerCase().slice(0, 8))) return skill;
            touched = true;
            return { ...skill, previousMastery: skill.mastery, mastery, updatedOn: new Date().toISOString().slice(0, 10) };
          });
          const students = prev.students.map((student) =>
            student.id === studentId ? recomputeStudent(student, studentSkills, prev.sessions) : student,
          );
          return {
            ...prev,
            studentSkills,
            students,
            activity: [addActivity(touched ? "Skill updated" : "Skill observation saved", `${skillName} marked at ${mastery}% mastery.`, studentId), ...prev.activity].slice(0, 20),
          };
        }),
      saveAIReport: (report) =>
        setState((prev) => ({
          ...prev,
          aiReports: [report, ...prev.aiReports],
          activity: [addActivity("AI analysis saved", report.detectedGap, report.studentId), ...prev.activity].slice(0, 20),
        })),
      savePracticePlan: (plan) =>
        setState((prev) => ({
          ...prev,
          practicePlans: [plan, ...prev.practicePlans],
          activity: [addActivity("Practice plan saved", `Plan saved for ${plan.skillFocus}.`, plan.studentId), ...prev.activity].slice(0, 20),
        })),
      saveProgressReport: (report) =>
        setState((prev) => ({
          ...prev,
          progressReports: [report, ...prev.progressReports],
          activity: [addActivity("Progress report created", `${report.period} report saved.`, report.studentId), ...prev.activity].slice(0, 20),
        })),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setState(createInitialState());
      },
      getStudentById: (studentId) => studentsById[studentId],
      getStudentSkills: (studentId) =>
        state.studentSkills
          .filter((s) => s.studentId === studentId)
          .map((s) => ({ ...s, skill: skillsById[s.skillId] })),
      getStudentSessions: (studentId) =>
        state.sessions
          .filter((s) => s.studentId === studentId)
          .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
      getStudentReports: (studentId) => state.aiReports.filter((r) => r.studentId === studentId),
      getStudentPracticePlans: (studentId) => state.practicePlans.filter((p) => p.studentId === studentId),
      getStudentProgressReports: (studentId) => state.progressReports.filter((r) => r.studentId === studentId),
      dashboardStats: {
        totalStudents: activeStudents.length,
        needingSupport: activeStudents.filter((s) => s.supportLevel === "Needs Support" || s.supportLevel === "High Priority").length,
        sessionsThisWeek: state.sessions.filter((s) => isoWeek(new Date(s.date)) === latestWeek).length,
        averageMastery,
        reportsGenerated: state.aiReports.length + state.progressReports.length,
        activePlans: state.practicePlans.length,
      },
    };
  }, [state]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}

export function studentIsArchived(student: Student) {
  return isArchived(student);
}
