import type { Skill } from "@/types";

/**
 * Reusable skill catalog. In production this maps to the `skills` table and is
 * shared across all students via `student_skills`.
 */
export const skills: Skill[] = [
  // Reading
  { id: "sk-read-decoding", name: "Decoding & Word Attack", subject: "Reading", gradeBand: "K-2" },
  { id: "sk-read-fluency", name: "Reading Fluency", subject: "Reading", gradeBand: "1-3" },
  { id: "sk-read-comprehension", name: "Reading Comprehension", subject: "Reading", gradeBand: "2-5" },
  { id: "sk-read-vocab", name: "Vocabulary", subject: "Reading", gradeBand: "1-5" },
  { id: "sk-read-inference", name: "Inferencing", subject: "Reading", gradeBand: "3-5" },

  // Phonics
  { id: "sk-phon-letter-sounds", name: "Letter Sounds", subject: "Phonics", gradeBand: "K-1" },
  { id: "sk-phon-blending", name: "Blending Sounds", subject: "Phonics", gradeBand: "K-2" },
  { id: "sk-phon-cvc", name: "CVC Words", subject: "Phonics", gradeBand: "K-2" },
  { id: "sk-phon-digraphs", name: "Digraphs", subject: "Phonics", gradeBand: "1-2" },

  // Math
  { id: "sk-math-number-sense", name: "Number Sense", subject: "Math", gradeBand: "K-3" },
  { id: "sk-math-addition", name: "Addition & Subtraction", subject: "Math", gradeBand: "1-3" },
  { id: "sk-math-multiplication", name: "Multiplication Facts", subject: "Math", gradeBand: "3-4" },
  { id: "sk-math-fractions", name: "Fractions", subject: "Math", gradeBand: "3-5" },
  { id: "sk-math-word-problems", name: "Word Problems", subject: "Math", gradeBand: "2-5" },
  { id: "sk-math-place-value", name: "Place Value", subject: "Math", gradeBand: "1-4" },

  // Writing
  { id: "sk-write-sentence", name: "Sentence Structure", subject: "Writing", gradeBand: "1-3" },
  { id: "sk-write-paragraph", name: "Paragraph Writing", subject: "Writing", gradeBand: "3-5" },
  { id: "sk-write-narrative", name: "Narrative Writing", subject: "Writing", gradeBand: "2-5" },
  { id: "sk-write-spelling", name: "Spelling & Conventions", subject: "Writing", gradeBand: "1-5" },
];

export const skillsById = Object.fromEntries(skills.map((s) => [s.id, s]));
