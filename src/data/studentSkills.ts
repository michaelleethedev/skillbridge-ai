import type { StudentSkill } from "@/types";

/**
 * Per-student skill mastery records. Maps to `student_skills`.
 * `mastery` is the current value; `previousMastery` powers the trend arrows.
 */
export const studentSkills: StudentSkill[] = [
  // Angel (Reading, Needs Support)
  { id: "ss-1", studentId: "stu-angel", skillId: "sk-read-fluency", mastery: 62, previousMastery: 55, updatedOn: "2026-06-09" },
  { id: "ss-2", studentId: "stu-angel", skillId: "sk-read-comprehension", mastery: 48, previousMastery: 50, updatedOn: "2026-06-09" },
  { id: "ss-3", studentId: "stu-angel", skillId: "sk-read-vocab", mastery: 65, previousMastery: 60, updatedOn: "2026-06-02" },
  { id: "ss-4", studentId: "stu-angel", skillId: "sk-read-inference", mastery: 55, previousMastery: 52, updatedOn: "2026-06-02" },

  // Judith (Math, On Track)
  { id: "ss-5", studentId: "stu-judith", skillId: "sk-math-multiplication", mastery: 90, previousMastery: 85, updatedOn: "2026-06-08" },
  { id: "ss-6", studentId: "stu-judith", skillId: "sk-math-fractions", mastery: 78, previousMastery: 70, updatedOn: "2026-06-08" },
  { id: "ss-7", studentId: "stu-judith", skillId: "sk-math-word-problems", mastery: 80, previousMastery: 78, updatedOn: "2026-06-01" },
  { id: "ss-8", studentId: "stu-judith", skillId: "sk-math-place-value", mastery: 88, previousMastery: 86, updatedOn: "2026-06-01" },

  // Bruce (Math, High Priority)
  { id: "ss-9", studentId: "stu-bruce", skillId: "sk-math-fractions", mastery: 32, previousMastery: 35, updatedOn: "2026-06-10" },
  { id: "ss-10", studentId: "stu-bruce", skillId: "sk-math-place-value", mastery: 40, previousMastery: 38, updatedOn: "2026-06-10" },
  { id: "ss-11", studentId: "stu-bruce", skillId: "sk-math-multiplication", mastery: 50, previousMastery: 48, updatedOn: "2026-06-03" },
  { id: "ss-12", studentId: "stu-bruce", skillId: "sk-math-word-problems", mastery: 38, previousMastery: 40, updatedOn: "2026-06-03" },

  // Aliyah (Reading, Improving)
  { id: "ss-13", studentId: "stu-aliyah", skillId: "sk-read-fluency", mastery: 64, previousMastery: 55, updatedOn: "2026-06-07" },
  { id: "ss-14", studentId: "stu-aliyah", skillId: "sk-read-decoding", mastery: 70, previousMastery: 62, updatedOn: "2026-06-07" },
  { id: "ss-15", studentId: "stu-aliyah", skillId: "sk-read-vocab", mastery: 68, previousMastery: 64, updatedOn: "2026-05-31" },

  // Mateo (Phonics, Needs Support)
  { id: "ss-16", studentId: "stu-mateo", skillId: "sk-phon-letter-sounds", mastery: 70, previousMastery: 60, updatedOn: "2026-06-06" },
  { id: "ss-17", studentId: "stu-mateo", skillId: "sk-phon-blending", mastery: 44, previousMastery: 40, updatedOn: "2026-06-06" },
  { id: "ss-18", studentId: "stu-mateo", skillId: "sk-phon-cvc", mastery: 42, previousMastery: 45, updatedOn: "2026-05-30" },

  // Sophia (Writing, On Track)
  { id: "ss-19", studentId: "stu-sophia", skillId: "sk-write-paragraph", mastery: 76, previousMastery: 70, updatedOn: "2026-06-05" },
  { id: "ss-20", studentId: "stu-sophia", skillId: "sk-write-narrative", mastery: 84, previousMastery: 80, updatedOn: "2026-06-05" },
  { id: "ss-21", studentId: "stu-sophia", skillId: "sk-write-spelling", mastery: 82, previousMastery: 82, updatedOn: "2026-05-29" },

  // Elijah (Reading, High Priority)
  { id: "ss-22", studentId: "stu-elijah", skillId: "sk-read-decoding", mastery: 38, previousMastery: 36, updatedOn: "2026-06-09" },
  { id: "ss-23", studentId: "stu-elijah", skillId: "sk-read-fluency", mastery: 42, previousMastery: 44, updatedOn: "2026-06-09" },
  { id: "ss-24", studentId: "stu-elijah", skillId: "sk-read-inference", mastery: 46, previousMastery: 42, updatedOn: "2026-06-02" },
  { id: "ss-25", studentId: "stu-elijah", skillId: "sk-read-comprehension", mastery: 50, previousMastery: 48, updatedOn: "2026-06-02" },

  // Damian (Math, Improving)
  { id: "ss-26", studentId: "stu-damian", skillId: "sk-math-fractions", mastery: 66, previousMastery: 55, updatedOn: "2026-06-08" },
  { id: "ss-27", studentId: "stu-damian", skillId: "sk-math-multiplication", mastery: 80, previousMastery: 74, updatedOn: "2026-06-08" },
  { id: "ss-28", studentId: "stu-damian", skillId: "sk-math-word-problems", mastery: 70, previousMastery: 66, updatedOn: "2026-06-01" },

  // Olivia (Math, On Track)
  { id: "ss-29", studentId: "stu-olivia", skillId: "sk-math-addition", mastery: 92, previousMastery: 88, updatedOn: "2026-06-04" },
  { id: "ss-30", studentId: "stu-olivia", skillId: "sk-math-place-value", mastery: 80, previousMastery: 74, updatedOn: "2026-06-04" },
  { id: "ss-31", studentId: "stu-olivia", skillId: "sk-math-number-sense", mastery: 88, previousMastery: 85, updatedOn: "2026-05-28" },

  // Noah (Reading, Improving)
  { id: "ss-32", studentId: "stu-noah", skillId: "sk-phon-letter-sounds", mastery: 66, previousMastery: 58, updatedOn: "2026-06-03" },
  { id: "ss-33", studentId: "stu-noah", skillId: "sk-read-decoding", mastery: 60, previousMastery: 52, updatedOn: "2026-06-03" },
  { id: "ss-34", studentId: "stu-noah", skillId: "sk-read-vocab", mastery: 64, previousMastery: 60, updatedOn: "2026-05-27" },
];
