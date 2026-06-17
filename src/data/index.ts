import type { SupportLevel } from "@/types";
import { formatShortDate } from "@/lib/utils";
import { students, studentsById, fullName, initials, currentUser } from "./students";
import { skills, skillsById } from "./skills";
import { studentSkills } from "./studentSkills";
import { sessions } from "./sessions";
import { goals } from "./goals";
import { aiReports, practicePlans, progressReports } from "./aiReports";

export {
  students,
  studentsById,
  fullName,
  initials,
  currentUser,
  skills,
  skillsById,
  studentSkills,
  sessions,
  goals,
  aiReports,
  practicePlans,
  progressReports,
};

/* -------------------------------------------------------------------------- */
/*  Selectors — small helpers that derive views over the mock data.           */
/*  Swapping these for Supabase queries later keeps the UI layer unchanged.   */
/* -------------------------------------------------------------------------- */

export const getStudentSkills = (studentId: string) =>
  studentSkills
    .filter((s) => s.studentId === studentId)
    .map((s) => ({ ...s, skill: skillsById[s.skillId] }));

export const getStudentSessions = (studentId: string) =>
  sessions
    .filter((s) => s.studentId === studentId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const getStudentGoals = (studentId: string) =>
  goals.filter((g) => g.studentId === studentId);

export const getStudentReports = (studentId: string) =>
  aiReports.filter((r) => r.studentId === studentId);

export const getStudentPracticePlans = (studentId: string) =>
  practicePlans.filter((p) => p.studentId === studentId);

export const getStudentProgressReports = (studentId: string) =>
  progressReports.filter((r) => r.studentId === studentId);

/** ISO week key (year-week) used to bucket "this week" sessions. */
const isoWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${week}`;
};

export interface DashboardStats {
  totalStudents: number;
  needingSupport: number;
  sessionsThisWeek: number;
  averageMastery: number;
}

export const getDashboardStats = (): DashboardStats => {
  const totalStudents = students.length;
  const needingSupport = students.filter(
    (s) => s.supportLevel === "Needs Support" || s.supportLevel === "High Priority",
  ).length;

  // Bucket relative to the most recent session in the demo data so the metric
  // is always meaningful regardless of the current date.
  const latest = sessions.reduce(
    (max, s) => (+new Date(s.date) > +new Date(max) ? s.date : max),
    sessions[0].date,
  );
  const latestWeek = isoWeek(new Date(latest));
  const sessionsThisWeek = sessions.filter((s) => isoWeek(new Date(s.date)) === latestWeek).length;

  const averageMastery = Math.round(
    students.reduce((sum, s) => sum + s.averageMastery, 0) / students.length,
  );

  return { totalStudents, needingSupport, sessionsThisWeek, averageMastery };
};

/** Students who need follow-up, sorted by urgency then lowest mastery. */
export const getAttentionQueue = () => {
  const priority: Record<SupportLevel, number> = {
    "High Priority": 0,
    "Needs Support": 1,
    Improving: 2,
    "On Track": 3,
  };
  return [...students]
    .filter((s) => s.supportLevel === "High Priority" || s.supportLevel === "Needs Support")
    .sort(
      (a, b) =>
        priority[a.supportLevel] - priority[b.supportLevel] ||
        a.averageMastery - b.averageMastery,
    );
};

/** Average mastery grouped by subject, for the dashboard bar chart. */
export const getMasteryBySubject = () => {
  const buckets: Record<string, { total: number; count: number }> = {};
  studentSkills.forEach((ss) => {
    const subject = skillsById[ss.skillId]?.subject ?? "Other";
    buckets[subject] = buckets[subject] || { total: 0, count: 0 };
    buckets[subject].total += ss.mastery;
    buckets[subject].count += 1;
  });
  return Object.entries(buckets).map(([subject, { total, count }]) => ({
    subject,
    mastery: Math.round(total / count),
  }));
};

/** Count of students per support level, for the donut/pie chart. */
export const getStudentsBySupportLevel = () => {
  const order: SupportLevel[] = ["On Track", "Improving", "Needs Support", "High Priority"];
  return order.map((level) => ({
    level,
    count: students.filter((s) => s.supportLevel === level).length,
  }));
};

/** A short, action-oriented "AI next step" phrase derived from a student. */
export const getStudentNextStep = (studentId: string): string => {
  const student = studentsById[studentId];
  if (!student) return "Review progress";
  if (student.supportLevel === "On Track") return "Ready for next skill";

  const gap = (student.needsSupport[0] ?? student.subjectFocus).toLowerCase();
  const rules: [RegExp, string][] = [
    [/comprehension|main idea/, "Practice text evidence"],
    [/inference/, "Practice drawing inferences"],
    [/fluency/, "Build reading fluency"],
    [/phonics|blend/, "Continue phonics blending"],
    [/vocab/, "Expand vocabulary practice"],
    [/fraction/, "Review fractions with models"],
    [/word problem/, "Review ratio word problems"],
    [/place value/, "Reinforce place value"],
    [/multiplication|division/, "Drill multiplication facts"],
    [/writing|sentence|paragraph/, "Strengthen sentence structure"],
    [/confidence/, "Build confidence with wins"],
  ];
  const match = rules.find(([re]) => re.test(gap));
  return match ? match[1] : `Focus on ${student.needsSupport[0] ?? student.subjectFocus}`;
};

/** 3 program-level "AI insights" generated from the demo data. */
export const getProgramInsights = (): string[] => {
  const insights: string[] = [];

  // 1. Recurring difficulty with reading comprehension.
  const comprehensionStudents = students.filter((s) =>
    s.needsSupport.some((n) => /comprehension|main idea/i.test(n)),
  );
  if (comprehensionStudents.length > 0) {
    insights.push(
      `${comprehensionStudents.length} student${comprehensionStudents.length === 1 ? "" : "s"} show recurring difficulty with reading comprehension.`,
    );
  }

  // 2. Who to prioritize this week (top of the attention queue).
  const queue = getAttentionQueue();
  if (queue.length >= 2) {
    insights.push(
      `${queue[0].firstName} and ${queue[1].firstName} should be prioritized this week based on mastery and support level.`,
    );
  } else if (queue.length === 1) {
    insights.push(`${queue[0].firstName} should be prioritized this week.`);
  }

  // 3. Math mastery growth among Grade 5 students.
  const grade5Math = studentSkills.filter((ss) => {
    const student = studentsById[ss.studentId];
    return student?.grade === 5 && skillsById[ss.skillId]?.subject === "Math";
  });
  if (grade5Math.length > 0) {
    const delta = Math.round(
      grade5Math.reduce((sum, s) => sum + (s.mastery - s.previousMastery), 0) / grade5Math.length,
    );
    if (delta !== 0) {
      insights.push(
        `Math mastery ${delta > 0 ? "improved" : "dipped"} ${Math.abs(delta)}% on average across Grade 5 students.`,
      );
    }
  }

  // Fallback so the panel always has 3 items.
  while (insights.length < 3) {
    insights.push(
      `Average program mastery is ${getDashboardStats().averageMastery}% across ${students.length} active students.`,
    );
    break;
  }

  return insights.slice(0, 3);
};

export type InsightCategory = "Risk" | "Progress" | "Recommendation";

export interface ProgramInsightCard {
  category: InsightCategory;
  text: string;
  confidence: number;
}

/** Structured program insights (category + text + confidence) for the panel. */
export const getProgramInsightCards = (): ProgramInsightCard[] => {
  const cards: ProgramInsightCard[] = [];

  // Risk — recurring difficulty with reading comprehension.
  const comprehensionStudents = students.filter((s) =>
    s.needsSupport.some((n) => /comprehension|main idea/i.test(n)),
  );
  if (comprehensionStudents.length > 0) {
    cards.push({
      category: "Risk",
      text: `${comprehensionStudents.length} student${
        comprehensionStudents.length === 1 ? "" : "s"
      } show recurring difficulty with reading comprehension.`,
      confidence: 91,
    });
  }

  // Recommendation — who to prioritize this week.
  const queue = getAttentionQueue();
  if (queue.length >= 2) {
    cards.push({
      category: "Recommendation",
      text: `Prioritize ${queue[0].firstName} and ${queue[1].firstName} this week based on mastery and support level.`,
      confidence: 88,
    });
  } else if (queue.length === 1) {
    cards.push({
      category: "Recommendation",
      text: `Prioritize ${queue[0].firstName} this week based on mastery and support level.`,
      confidence: 88,
    });
  }

  // Progress — Math mastery growth among Grade 5 students.
  const grade5Math = studentSkills.filter((ss) => {
    const student = studentsById[ss.studentId];
    return student?.grade === 5 && skillsById[ss.skillId]?.subject === "Math";
  });
  if (grade5Math.length > 0) {
    const delta = Math.round(
      grade5Math.reduce((sum, s) => sum + (s.mastery - s.previousMastery), 0) / grade5Math.length,
    );
    if (delta !== 0) {
      cards.push({
        category: delta > 0 ? "Progress" : "Risk",
        text: `Math mastery ${delta > 0 ? "improved" : "dipped"} ${Math.abs(
          delta,
        )}% on average across Grade 5 students.`,
        confidence: 84,
      });
    }
  }

  while (cards.length < 3) {
    cards.push({
      category: "Progress",
      text: `Average program mastery is ${getDashboardStats().averageMastery}% across ${
        students.length
      } active students.`,
      confidence: 80,
    });
    break;
  }

  return cards.slice(0, 3);
};

export type TrendLabel =
  | "Improving"
  | "Declining"
  | "No recent session"
  | "Ready for next skill";

const latestSessionDate = sessions.reduce(
  (max, s) => (+new Date(s.date) > +new Date(max) ? s.date : max),
  sessions[0].date,
);

/** A short trend label for a student, used for the dashboard trend badges. */
export const getStudentTrend = (studentId: string): TrendLabel => {
  const student = studentsById[studentId];
  if (!student) return "No recent session";
  const gapDays = (+new Date(latestSessionDate) - +new Date(student.lastSessionOn)) / 86_400_000;
  if (gapDays > 12) return "No recent session";
  if (student.supportLevel === "On Track") return "Ready for next skill";
  const skills = getStudentSkills(studentId);
  const delta = skills.length
    ? skills.reduce((sum, s) => sum + (s.mastery - s.previousMastery), 0) / skills.length
    : 0;
  if (delta <= -1) return "Declining";
  return "Improving";
};

export interface DashboardInsight {
  studentId: string;
  name: string;
  grade: number;
  supportLevel: SupportLevel;
  weakestSkill: string;
  mastery: number;
  reason: string;
  nextStep: string;
  confidence: number;
  trend: TrendLabel;
}

/** Rich, AI-style insights for the top students needing attention. */
export const getDashboardInsights = (limit = 4): DashboardInsight[] => {
  return getAttentionQueue()
    .slice(0, limit)
    .map((s) => {
      const skills = getStudentSkills(s.id).sort((a, b) => a.mastery - b.mastery);
      const weakest = skills[0];
      const weakestSkill = weakest?.skill?.name ?? s.needsSupport[0] ?? s.subjectFocus;
      const mastery = weakest?.mastery ?? s.averageMastery;
      const declining = weakest ? weakest.mastery < weakest.previousMastery : false;
      const reason = `${weakestSkill} mastery is at ${mastery}%${
        declining
          ? " and recent sessions show repeated errors"
          : " and needs targeted reinforcement"
      }.`;
      const confidence = Math.round(Math.min(96, Math.max(82, 124 - mastery)));
      return {
        studentId: s.id,
        name: fullName(s),
        grade: s.grade,
        supportLevel: s.supportLevel,
        weakestSkill,
        mastery,
        reason,
        nextStep: getStudentNextStep(s.id),
        confidence,
        trend: getStudentTrend(s.id),
      };
    });
};

export interface WeeklyPlanRow {
  studentId: string;
  student: string;
  skill: string;
  activity: string;
  time: string;
  status: "Priority" | "Needs Support";
}

/** The AI-suggested weekly learning plan shown on the dashboard. */
export const getWeeklyPlan = (): WeeklyPlanRow[] => [
  {
    studentId: "stu-bruce",
    student: "Bruce Thompson",
    skill: "Fractions",
    activity: "Visual fraction models and word problems",
    time: "20 min",
    status: "Priority",
  },
  {
    studentId: "stu-elijah",
    student: "Elijah Brooks",
    skill: "Multisyllabic decoding",
    activity: "Word breakdown drill",
    time: "15 min",
    status: "Priority",
  },
  {
    studentId: "stu-mateo",
    student: "Mateo Garcia",
    skill: "Phonics blending",
    activity: "CVC blending practice",
    time: "15 min",
    status: "Needs Support",
  },
  {
    studentId: "stu-angel",
    student: "Angel Rivera",
    skill: "Text evidence",
    activity: "Short passage response",
    time: "20 min",
    status: "Needs Support",
  },
];

/** Average performance score over recent sessions, oldest → newest. */
export const getSessionTrend = () => {
  const sorted = [...sessions].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  return sorted.map((s) => ({
    date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.performanceScore,
  }));
};

/* -------------------------------------------------------------------------- */
/*  Student profile — AI gap analysis, practice plan, and parent summary.     */
/*  Uses hand-authored demo entries when available, otherwise synthesizes a   */
/*  realistic, education-specific result from the student's skills + notes.   */
/* -------------------------------------------------------------------------- */

/** Identify the student's primary gap (weakest tracked skill). */
const gapContext = (studentId: string) => {
  const student = studentsById[studentId];
  const skills = getStudentSkills(studentId)
    .slice()
    .sort((a, b) => a.mastery - b.mastery);
  const weakest = skills[0];
  const name =
    weakest?.skill?.name ?? student?.needsSupport?.[0] ?? student?.subjectFocus ?? "Core skills";
  return { student, skills, weakest, name };
};

const matchRule = (rules: [RegExp, string][], text: string): string | undefined =>
  rules.find(([re]) => re.test(text))?.[1];

const CAUSE_RULES: [RegExp, string][] = [
  [/comprehension|main idea/, "can read the words but lacks an active strategy for organizing details under a central idea."],
  [/fluency/, "reads word-by-word, so mental energy goes to decoding rather than meaning and expression."],
  [/inferenc/, "stays at the literal level and hasn't yet learned to combine text clues with background knowledge."],
  [/decoding|multisyllabic|word attack|sounding out/, "guesses longer words from the first letters instead of using syllable-division strategies."],
  [/blend/, "knows individual letter sounds but hasn't developed the oral blending needed to fuse them into whole words."],
  [/cvc|letter.?sound|phonics/, "is still building automatic letter-sound links, which slows down word reading."],
  [/fraction/, "is applying whole-number reasoning to fractions without a concrete part-whole model."],
  [/place value/, "hasn't fully connected each digit's position to its value, so multi-digit numbers get misread."],
  [/word problem/, "can compute accurately but struggles to translate problem language into the right operation."],
  [/multiplication|division|fact|computation/, "lacks automaticity with number facts, so multi-step problems break down."],
  [/vocab/, "meets unfamiliar academic words without a reliable strategy to infer meaning from context."],
  [/paragraph|sentence|writing|organiz/, "generates strong ideas but hasn't yet internalized a structure to organize them on the page."],
  [/confidence/, "disengages when a task feels hard, which cuts practice short before mastery can build."],
];

const STEP_RULES: [RegExp, string][] = [
  [/comprehension|main idea/, "Practice short passage responses using 'I know this because…' sentence frames and a main-idea organizer."],
  [/fluency/, "Use repeated reading of short passages with a fluent model, tracking words-per-minute for motivation."],
  [/inferenc/, "Teach inference with 'It says / I know / So I think' charts on short, high-interest texts."],
  [/decoding|multisyllabic|word attack|sounding out/, "Teach syllable-division strategies and practice in short, timed decoding sets to build stamina."],
  [/blend/, "Practice continuous blending with Elkonin sound boxes, starting with 2–3 sound words."],
  [/cvc|letter.?sound|phonics/, "Run brief daily letter-sound fluency drills and target easily confused pairs such as b/d."],
  [/fraction/, "Use fraction tiles and area models so size is visible before moving to symbols."],
  [/place value/, "Pair base-ten blocks with a place-value chart in short daily warm-ups."],
  [/word problem/, "Use a consistent routine: visualize the situation, identify the operation, then compute."],
  [/multiplication|division|fact|computation/, "Build fact automaticity with 5-minute spaced-practice drills before applying to multi-step work."],
  [/vocab/, "Pre-teach 3–5 academic words per session and connect them to the student's own experiences."],
  [/paragraph|sentence|writing|organiz/, "Model a clear paragraph frame (topic, details, varied conclusion) with transition words."],
  [/confidence/, "Keep tasks short with frequent wins and explicit praise to build momentum."],
];

const HOME_RULES: [RegExp, string][] = [
  [/comprehension|main idea/, "After reading together, ask your child to tell you the 'big idea' in one sentence."],
  [/fluency/, "Re-read a favorite short book 2–3 times to build smooth, expressive reading."],
  [/inferenc/, "Pause during stories to ask 'What do you think happens next, and why?'"],
  [/decoding|multisyllabic|word attack|sounding out/, "Clap out the syllables in longer words you see around the house."],
  [/blend|cvc|letter.?sound|phonics/, "Practice stretching and blending sounds in short words like 'sun' and 'map'."],
  [/fraction/, "Use measuring cups or cut food into equal parts to talk about fractions."],
  [/place value/, "Count groups of objects and talk about how many tens and ones."],
  [/word problem/, "Turn everyday situations into simple 'how many' questions."],
  [/multiplication|division|fact|computation/, "Do quick 2-minute fact practice a few times each week."],
  [/vocab/, "Use new words from reading in everyday conversation."],
  [/paragraph|sentence|writing|organiz/, "Have your child write one or two sentences about their day."],
  [/confidence/, "Keep home practice short and positive — celebrate effort over correctness."],
];

export interface StudentOverview {
  mastery: number;
  sessionsCompleted: number;
  mainGap: string;
  nextStep: string;
}

export const getStudentOverview = (studentId: string): StudentOverview => {
  const { student, name } = gapContext(studentId);
  return {
    mastery: student?.averageMastery ?? 0,
    sessionsCompleted: getStudentSessions(studentId).length,
    mainGap: name,
    nextStep: getStudentNextStep(studentId),
  };
};

export interface GapAnalysis {
  detectedGap: string;
  likelyCause: string;
  evidence: string;
  recommendedNextStep: string;
  confidence: number;
  createdOn: string;
  generated: boolean;
}

export const getStudentGapAnalysis = (studentId: string): GapAnalysis | null => {
  const student = studentsById[studentId];
  if (!student) return null;

  const report = aiReports.find((r) => r.studentId === studentId);
  if (report) {
    return {
      detectedGap: report.detectedGap,
      likelyCause: report.likelyCause,
      evidence: report.sourceNote,
      recommendedNextStep: report.recommendedNextStep,
      confidence: report.confidence,
      createdOn: report.createdOn,
      generated: false,
    };
  }

  const { skills, weakest, name } = gapContext(studentId);
  const sessionList = getStudentSessions(studentId);
  const latest = sessionList[0];
  const haystack = `${name} ${student.needsSupport.join(" ")}`.toLowerCase();
  const first = student.firstName;

  const likelyCause =
    matchRule(CAUSE_RULES, haystack) !== undefined
      ? `${first} ${matchRule(CAUSE_RULES, haystack)}`
      : `${first} needs scaffolded, targeted practice in ${name.toLowerCase()} to reach grade-level expectations.`;

  const recommendedNextStep =
    matchRule(STEP_RULES, haystack) ??
    `Provide targeted practice in ${name.toLowerCase()} with frequent checks for understanding.`;

  const evidence = latest
    ? `Session on ${formatShortDate(latest.date)} (${latest.skillFocus}, scored ${latest.performanceScore}%): “${latest.notes}”`
    : `${student.needsSupport.join("; ")} flagged as an area to support across recent check-ins.`;

  const confidence = Math.min(
    94,
    82 + Math.min(sessionList.length, 3) * 3 + (skills.length >= 4 ? 3 : 0),
  );

  const detectedGap = weakest?.skill
    ? `${weakest.skill.name} (currently ${weakest.mastery}% mastery)`
    : name;

  return {
    detectedGap,
    likelyCause,
    evidence,
    recommendedNextStep,
    confidence,
    createdOn: student.lastSessionOn,
    generated: true,
  };
};

export interface ProfilePracticePlan {
  skillFocus: string;
  warmUp: string;
  guidedPractice: string;
  independentPractice: string;
  exitTicket: string;
  nextSessionFocus: string;
  estimatedTime: string;
  generated: boolean;
}

const exitPromptFor = (subject: string, gapLower: string): string => {
  switch (subject) {
    case "Math":
      return `Solve one problem on ${gapLower} and show your work with a model.`;
    case "Reading":
      return "Answer one question about the passage and underline your text evidence.";
    case "Phonics":
      return "Read five new words aloud using today's target sounds.";
    case "Writing":
      return "Write one well-structured sentence using today's target.";
    default:
      return `Complete one quick check on ${gapLower}.`;
  }
};

export const getStudentPracticePlanOrGenerate = (studentId: string): ProfilePracticePlan | null => {
  const student = studentsById[studentId];
  if (!student) return null;

  const explicit = practicePlans.find((p) => p.studentId === studentId);
  if (explicit) {
    return {
      skillFocus: explicit.skillFocus,
      warmUp: explicit.warmUp,
      guidedPractice: explicit.guidedPractice,
      independentPractice: explicit.independentPractice,
      exitTicket: explicit.exitTicket,
      nextSessionFocus: explicit.nextSessionFocus,
      estimatedTime: "30 min",
      generated: false,
    };
  }

  const { name } = gapContext(studentId);
  const gapLower = name.toLowerCase();
  const first = student.firstName;
  const nextStep = getStudentNextStep(studentId);

  return {
    skillFocus: name,
    warmUp: `Quick review game targeting ${gapLower} to activate prior knowledge and build confidence.`,
    guidedPractice: `Tutor models ${gapLower} with a think-aloud, then works through 2–3 examples together, narrating each step.`,
    independentPractice: `${first} completes 4–5 practice items independently while the tutor observes for misconceptions.`,
    exitTicket: exitPromptFor(student.subjectFocus, gapLower),
    nextSessionFocus: `Build on ${gapLower}; ${nextStep.toLowerCase()}.`,
    estimatedTime: "30 min",
    generated: true,
  };
};

export interface StudentSummary {
  strengths: string[];
  needsSupport: string[];
  recentProgress: string;
  recommendedHomePractice: string[];
  nextSteps: string[];
  generated: boolean;
}

export const getStudentSummary = (studentId: string): StudentSummary | null => {
  const student = studentsById[studentId];
  if (!student) return null;

  const { skills, name } = gapContext(studentId);
  const gapLower = name.toLowerCase();
  const haystack = `${name} ${student.needsSupport.join(" ")}`.toLowerCase();
  const first = student.firstName;

  const homeTip =
    matchRule(HOME_RULES, haystack) ?? `Spend a few minutes on ${gapLower} together a few times this week.`;
  const recommendedHomePractice = [
    homeTip,
    `Keep practice short and positive to protect ${first}'s confidence.`,
  ];

  const report = progressReports.find((r) => r.studentId === studentId);
  if (report) {
    return {
      strengths: report.strengths,
      needsSupport: report.needsSupport,
      recentProgress: report.recentProgress,
      recommendedHomePractice,
      nextSteps: report.recommendedNextSteps,
      generated: false,
    };
  }

  const improved = skills
    .filter((s) => s.mastery > s.previousMastery)
    .sort((a, b) => b.mastery - b.previousMastery - (a.mastery - a.previousMastery));
  const top = improved[0];
  const recentProgress = top?.skill
    ? `${first}'s ${top.skill.name.toLowerCase()} rose from ${top.previousMastery}% to ${top.mastery}% this period. Recent sessions show ${
        student.strengths[0]?.toLowerCase() ?? "growing engagement"
      } and steady effort.`
    : `${first} is working to build consistency; current average mastery is ${student.averageMastery}%.`;

  const recommendedNextStep =
    matchRule(STEP_RULES, haystack) ??
    `Continue targeted practice in ${gapLower} with frequent checks for understanding.`;

  return {
    strengths: student.strengths,
    needsSupport: student.needsSupport,
    recentProgress,
    recommendedHomePractice,
    nextSteps: [
      recommendedNextStep,
      `Maintain progress in ${student.strengths[0]?.toLowerCase() ?? "current strengths"}.`,
    ],
    generated: true,
  };
};
