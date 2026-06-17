import type { AIReport, PracticePlan } from "@/types";

/**
 * Mock AI engine for SkillBridge AI.
 *
 * The functions here return the same shapes a real model call would, so the
 * UI and API routes don't change when you wire up OpenAI. To go live:
 *   1. Add OPENAI_API_KEY to .env.local
 *   2. Replace the body of `analyzeNote` / `buildPracticePlan` in the API
 *      routes with a real chat completion call using these prompts.
 *
 * The mock uses lightweight keyword matching so different notes produce
 * different, plausible results during demos.
 */

export interface GapAnalysisInput {
  note: string;
  studentName?: string;
  subject?: string;
}

export type GapAnalysisResult = Omit<AIReport, "id" | "studentId" | "createdOn">;

interface Template {
  keywords: string[];
  build: (name?: string) => GapAnalysisResult;
}

const firstName = (name?: string) => (name ? name.split(" ")[0] : "Your student");

/** Prompt that would be sent to OpenAI in production (exported for transparency). */
export const GAP_ANALYSIS_SYSTEM_PROMPT = `You are an expert reading and math interventionist. Given a tutor's rough session note, identify the underlying learning gap, the likely cause, a concrete recommended next step, a hands-on practice activity, a warm parent-friendly update, and a short tutor action plan. Respond as structured JSON.`;

const templates: Template[] = [
  {
    keywords: ["blend", "sound", "phonics", "cvc", "letter"],
    build: (name) => ({
      sourceNote: "",
      detectedGap: "Phonological blending — the student can produce individual sounds but cannot blend them into whole words.",
      likelyCause: `${firstName(name)} has letter-sound knowledge but has not yet developed the oral blending skill needed to fuse sounds together.`,
      recommendedNextStep: "Practice continuous blending (stretching sounds without stopping) using Elkonin sound boxes with 2-3 sound words.",
      practiceActivity: "Slide a finger under each sound while stretching 'mmmaaap', then say it fast. Start with continuous sounds (m, s, f) before stop sounds.",
      parentUpdate: `${firstName(name)} knows the letter sounds really well! Now we're teaching how to 'glue' the sounds together to read whole words. Practicing stretchy words like 'sssuuun' at home will help.`,
      tutorActionPlan: [
        "Begin with continuous-sound CVC words",
        "Model continuous blending before the student tries",
        "Use magnetic letters and Elkonin boxes",
        "Celebrate every successfully blended word",
      ],
      confidence: 90,
    }),
  },
  {
    keywords: ["main idea", "retell", "comprehension", "summarize", "out of order", "sequence"],
    build: (name) => ({
      sourceNote: "",
      detectedGap: "Difficulty identifying the main idea and organizing key details from text.",
      likelyCause: `${firstName(name)} is reading at the word level without an active strategy for grouping details under a central idea.`,
      recommendedNextStep: "Explicitly teach a main-idea strategy with a graphic organizer, working one paragraph at a time.",
      practiceActivity: "Read a short paragraph together, then sort 4-5 detail cards under a 'Main Idea' header to build the relationship physically.",
      parentUpdate: `${firstName(name)} is reading the words well! Our next focus is finding the 'big idea.' At home, after a story, ask: 'What was that mostly about?'`,
      tutorActionPlan: [
        "Use single-paragraph passages with a main-idea organizer",
        "Pre-teach the difference between topic and main idea",
        "Have the student highlight the big-idea sentence",
        "Gradually increase to multi-paragraph texts",
      ],
      confidence: 87,
    }),
  },
  {
    keywords: ["fraction", "numerator", "denominator", "1/3", "1/4"],
    build: (name) => ({
      sourceNote: "",
      detectedGap: "Fraction magnitude misconception — treating the denominator like a whole number.",
      likelyCause: `${firstName(name)} is applying whole-number reasoning to fractions and lacks a concrete model connecting the denominator to part size.`,
      recommendedNextStep: "Use fraction tiles and area models to show that more pieces means smaller pieces, before working with symbols.",
      practiceActivity: "Fold identical paper strips into thirds and fourths, then overlay them to compare which piece is larger.",
      parentUpdate: `${firstName(name)} is building fraction understanding. We're using hands-on tools so the idea that 1/3 is bigger than 1/4 really sticks. Short, positive practice helps confidence.`,
      tutorActionPlan: [
        "Anchor every comparison to a visual model first",
        "Keep sessions short to protect confidence",
        "Name the common misconception explicitly",
        "Move to symbols only after the model is secure",
      ],
      confidence: 86,
    }),
  },
  {
    keywords: ["fluency", "rate", "expression", "wpm", "slow", "choppy"],
    build: (name) => ({
      sourceNote: "",
      detectedGap: "Reading fluency — accurate but slow, choppy reading that limits comprehension.",
      likelyCause: `${firstName(name)} decodes accurately but has not built automaticity, so mental effort goes to words instead of meaning.`,
      recommendedNextStep: "Use repeated reading of short, familiar passages and model phrased, expressive reading.",
      practiceActivity: "Repeated reading: read the same 100-word passage three times, charting words-per-minute each time.",
      parentUpdate: `${firstName(name)} is reading more smoothly! Re-reading favorite books at home builds speed and expression — and confidence.`,
      tutorActionPlan: [
        "Use repeated reading with a fluency chart",
        "Model phrasing and expression first",
        "Add syllable-clapping for longer words",
        "Track WPM to make progress visible",
      ],
      confidence: 84,
    }),
  },
  {
    keywords: ["word problem", "multi-step", "place value", "regroup", "tens", "hundreds"],
    build: (name) => ({
      sourceNote: "",
      detectedGap: "Number sense / place-value understanding affecting multi-step problem solving.",
      likelyCause: `${firstName(name)} is operating on digits procedurally without a firm grasp of place value, leading to errors in multi-step work.`,
      recommendedNextStep: "Reinforce place value with base-ten blocks and a place-value chart before symbolic practice.",
      practiceActivity: "Build numbers with base-ten blocks, then write them on a place-value chart and read them aloud.",
      parentUpdate: `${firstName(name)} is strengthening number sense. Counting and grouping objects at home (by tens!) supports this skill.`,
      tutorActionPlan: [
        "Daily 5-minute place-value warm-up",
        "Pair every number with base-ten blocks",
        "Break word problems into labeled steps",
        "Have the student restate the question first",
      ],
      confidence: 82,
    }),
  },
  {
    keywords: ["paragraph", "writing", "sentence", "topic sentence", "conclusion", "spelling"],
    build: (name) => ({
      sourceNote: "",
      detectedGap: "Written organization — strong ideas that are not yet structured into a clear paragraph.",
      likelyCause: `${firstName(name)} generates good ideas but has not internalized paragraph structure (topic, details, conclusion).`,
      recommendedNextStep: "Use a color-coded paragraph frame and model varied concluding sentences.",
      practiceActivity: "Hamburger-paragraph organizer: write a topic 'bun', three detail 'fillings', and a closing 'bun'.",
      parentUpdate: `${firstName(name)} has wonderful ideas! We're working on organizing them into clear paragraphs. Talking through 'first, next, last' at home helps.`,
      tutorActionPlan: [
        "Use a color-coded paragraph frame",
        "Model concluding sentences that don't restate the topic",
        "Introduce transition words",
        "Build from one strong paragraph at a time",
      ],
      confidence: 83,
    }),
  },
];

const fallback = (name?: string): GapAnalysisResult => ({
  sourceNote: "",
  detectedGap: "A targeted skill gap that needs a focused, explicit intervention.",
  likelyCause: `Based on the note, ${firstName(name)} likely needs more guided practice with the underlying skill before working independently.`,
  recommendedNextStep: "Re-teach the target skill explicitly, then provide scaffolded practice with immediate feedback.",
  practiceActivity: "Break the skill into its smallest step, model it, then practice together with concrete materials.",
  parentUpdate: `${firstName(name)} is working hard! We're focusing on one key skill with extra hands-on practice. Short, positive practice at home makes a big difference.`,
  tutorActionPlan: [
    "Identify the smallest sub-skill to target",
    "Model explicitly before independent practice",
    "Give immediate, specific feedback",
    "Re-assess in one to two sessions",
  ],
  confidence: 75,
});

/** Produce a structured learning-gap analysis from a rough tutor note. */
export function analyzeNote(input: GapAnalysisInput): GapAnalysisResult {
  const text = input.note.toLowerCase();
  const match = templates.find((t) => t.keywords.some((k) => text.includes(k)));
  const result = match ? match.build(input.studentName) : fallback(input.studentName);
  return { ...result, sourceNote: input.note };
}

export interface PracticePlanInput {
  studentName?: string;
  skillFocus: string;
  notes?: string;
}

export type PracticePlanResult = Omit<PracticePlan, "id" | "studentId" | "createdOn">;

/** Generate a structured 5-part practice plan around a skill focus. */
export function buildPracticePlan(input: PracticePlanInput): PracticePlanResult {
  const skill = input.skillFocus.trim() || "the target skill";
  const name = firstName(input.studentName);
  return {
    skillFocus: skill,
    warmUp: `Quick, confidence-building review tied to ${skill} (3-5 min) to activate prior knowledge.`,
    guidedPractice: `Tutor models ${skill} with a think-aloud, then completes 2-3 examples together with ${name}, gradually releasing responsibility.`,
    independentPractice: `${name} completes 4-5 problems on ${skill} independently while the tutor observes and notes error patterns.`,
    exitTicket: `One short item on ${skill} to check for understanding before the session ends.`,
    nextSessionFocus: `Extend ${skill} or revisit any step where ${name} needed support today.`,
  };
}
