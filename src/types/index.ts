/**
 * Core domain models for SkillBridge AI.
 *
 * These interfaces mirror the planned Supabase schema (see README) so the app
 * can swap the local mock data layer for a real database with minimal changes.
 *
 * Planned tables: users, students, sessions, skills, student_skills,
 * ai_reports, practice_plans, goals.
 */

export type Subject =
  | "Reading"
  | "Math"
  | "Writing"
  | "Phonics"
  | "Science";

export type SupportLevel =
  | "On Track"
  | "Improving"
  | "Needs Support"
  | "High Priority";

export type Grade = 1 | 2 | 3 | 4 | 5;

/** Application user (tutor / program admin). Maps to `users`. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "tutor" | "admin";
  avatarColor: string;
}

/** A student tracked in the program. Maps to `students`. */
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: Grade;
  subjectFocus: Subject;
  supportLevel: SupportLevel;
  avatarColor: string;
  strengths: string[];
  needsSupport: string[];
  /** Rolling average of skill mastery, 0-100. */
  averageMastery: number;
  guardianName: string;
  guardianEmail: string;
  enrolledOn: string; // ISO date
  lastSessionOn: string; // ISO date
}

/** A reusable skill definition. Maps to `skills`. */
export interface Skill {
  id: string;
  name: string;
  subject: Subject;
  /** Grade band this skill typically belongs to. */
  gradeBand: string;
}

/** A student's mastery of a particular skill. Maps to `student_skills`. */
export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  /** Mastery percentage, 0-100. */
  mastery: number;
  /** Mastery from the previous assessment, used to show trend. */
  previousMastery: number;
  updatedOn: string; // ISO date
}

/** A tutoring session record. Maps to `sessions`. */
export interface Session {
  id: string;
  studentId: string;
  tutorName: string;
  date: string; // ISO date
  subject: Subject;
  skillFocus: string;
  notes: string;
  /** Performance score for the session, 0-100. */
  performanceScore: number;
  nextSteps: string;
}

/** Structured result of the AI Learning Gap Analyzer. Maps to `ai_reports`. */
export interface AIReport {
  id: string;
  studentId: string;
  createdOn: string; // ISO date
  sourceNote: string;
  detectedGap: string;
  likelyCause: string;
  recommendedNextStep: string;
  practiceActivity: string;
  parentUpdate: string;
  tutorActionPlan: string[];
  confidence: number; // 0-100
}

/** A generated practice plan. Maps to `practice_plans`. */
export interface PracticePlan {
  id: string;
  studentId: string;
  createdOn: string; // ISO date
  skillFocus: string;
  warmUp: string;
  guidedPractice: string;
  independentPractice: string;
  exitTicket: string;
  nextSessionFocus: string;
}

export type GoalStatus = "Not Started" | "In Progress" | "Achieved";

/** A learning goal for a student. Maps to `goals`. */
export interface Goal {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: GoalStatus;
  targetDate: string; // ISO date
  progress: number; // 0-100
}

/** Parent/admin progress report. Composed from sessions + skills + goals. */
export interface ProgressReport {
  id: string;
  studentId: string;
  createdOn: string; // ISO date
  period: string;
  strengths: string[];
  needsSupport: string[];
  recentProgress: string;
  recommendedNextSteps: string[];
}
