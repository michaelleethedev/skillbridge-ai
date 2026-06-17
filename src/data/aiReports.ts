import type { AIReport, PracticePlan, ProgressReport } from "@/types";

/** Example AI Learning Gap Analyzer outputs. Maps to `ai_reports`. */
export const aiReports: AIReport[] = [
  {
    id: "ai-1",
    studentId: "stu-angel",
    createdOn: "2026-06-09",
    sourceNote:
      "Angel read a passage about sea turtles but retold the events out of order and couldn't name the main idea.",
    detectedGap: "Difficulty identifying the main idea and sequencing key events in informational text.",
    likelyCause:
      "Angel is reading at the word level without an active strategy for organizing information, so details are not being grouped under a central idea.",
    recommendedNextStep:
      "Explicitly teach a main-idea strategy using a graphic organizer, working with one paragraph at a time before combining.",
    practiceActivity:
      "Read a short paragraph together, then sort 4-5 detail cards under a 'Main Idea' header to physically build the relationship.",
    parentUpdate:
      "Angel is doing a great job reading the words! Our next focus is helping him find the 'big idea' of what he reads. At home, after a story, you can ask: 'What was that mostly about?'",
    tutorActionPlan: [
      "Use single-paragraph passages with a main-idea organizer",
      "Pre-teach the difference between a topic and a main idea",
      "Have Angel highlight the sentence that tells the big idea",
      "Gradually increase to multi-paragraph texts",
    ],
    confidence: 88,
  },
  {
    id: "ai-2",
    studentId: "stu-mateo",
    createdOn: "2026-06-06",
    sourceNote:
      "Mateo can say each letter sound but says them separately, like c-a-t, and can't push them together into 'cat'.",
    detectedGap: "Phonological blending: the student segments sounds but cannot blend them into a whole word.",
    likelyCause:
      "Mateo has letter-sound knowledge but has not yet developed the oral blending skill needed to fuse sounds into words.",
    recommendedNextStep:
      "Practice continuous blending (stretching sounds without stopping) and use Elkonin sound boxes with 2-3 sound words.",
    practiceActivity:
      "Slide a finger under each sound while stretching 'mmmaaap', then say it fast. Start with continuous sounds (m, s, f) before stop sounds.",
    parentUpdate:
      "Mateo knows his letter sounds really well! Now we're teaching him to 'glue' the sounds together to read whole words. Practicing stretchy words like 'sssuuun' at home will help a lot.",
    tutorActionPlan: [
      "Begin with continuous-sound CVC words",
      "Model continuous blending before asking Mateo to try",
      "Use magnetic letters and Elkonin boxes",
      "Celebrate every successfully blended word to build confidence",
    ],
    confidence: 91,
  },
  {
    id: "ai-3",
    studentId: "stu-bruce",
    createdOn: "2026-06-10",
    sourceNote:
      "Bruce thinks 1/4 is bigger than 1/3 because 4 is bigger than 3. Gets frustrated and shuts down.",
    detectedGap:
      "Fraction magnitude misconception: treating the denominator as a whole number rather than the number of parts.",
    likelyCause:
      "Bruce is applying whole-number reasoning to fractions and lacks a concrete model connecting the denominator to part size.",
    recommendedNextStep:
      "Use fraction tiles and area models so Bruce can see that more pieces means smaller pieces, before working with symbols.",
    practiceActivity:
      "Compare fractions by folding identical paper strips into thirds and fourths, then physically overlaying them to see which piece is larger.",
    parentUpdate:
      "Bruce is building his understanding of fractions. Right now we're using hands-on tools so he can SEE that 1/3 is actually bigger than 1/4. Short, positive practice sessions help him stay confident.",
    tutorActionPlan: [
      "Anchor every comparison to a visual model first",
      "Keep sessions short to protect confidence",
      "Name and normalize the common misconception explicitly",
      "Move to symbols only after the model is secure",
    ],
    confidence: 85,
  },
];

/** Example generated practice plans. Maps to `practice_plans`. */
export const practicePlans: PracticePlan[] = [
  {
    id: "pp-1",
    studentId: "stu-angel",
    createdOn: "2026-06-09",
    skillFocus: "Identifying the Main Idea",
    warmUp:
      "Sort 5 picture cards into a category and name the group (3 min) to prime the idea of a 'big idea' that connects details.",
    guidedPractice:
      "Read a 1-paragraph passage together. Tutor models thinking aloud to find the main idea, then highlights supporting details as a team.",
    independentPractice:
      "Angel reads a new short paragraph and completes a main-idea organizer with one main idea and three details.",
    exitTicket:
      "In one sentence, write what the paragraph was mostly about.",
    nextSessionFocus:
      "Apply the main-idea strategy to a two-paragraph passage.",
  },
  {
    id: "pp-2",
    studentId: "stu-bruce",
    createdOn: "2026-06-10",
    skillFocus: "Comparing Fractions with Models",
    warmUp:
      "Quick review: fold a paper strip into halves and fourths and label each piece (4 min).",
    guidedPractice:
      "Using fraction tiles, compare 1/2 vs 1/4 and 1/3 vs 1/4 together, recording each with the correct symbol (<, >, =).",
    independentPractice:
      "Bruce compares 4 fraction pairs using tiles, then writes the comparison symbol for each.",
    exitTicket:
      "Which is larger, 1/3 or 1/5? Draw a picture to prove it.",
    nextSessionFocus:
      "Compare fractions with the same numerator without models.",
  },
];

/** Example parent/admin progress reports surfaced on the Reports page. */
export const progressReports: ProgressReport[] = [
  {
    id: "pr-1",
    studentId: "stu-angel",
    createdOn: "2026-06-09",
    period: "May 12 - June 9, 2026",
    strengths: ["Strong oral storytelling", "Growing vocabulary", "Engaged in discussion"],
    needsSupport: ["Identifying the main idea", "Sequencing events"],
    recentProgress:
      "Angel's reading fluency improved from 55% to 62% mastery this month, and he is using newly pre-taught vocabulary words in conversation.",
    recommendedNextSteps: [
      "Continue main-idea work with graphic organizers",
      "Maintain vocabulary pre-teaching routine",
      "Practice retelling stories in order at home",
    ],
  },
  {
    id: "pr-2",
    studentId: "stu-judith",
    createdOn: "2026-06-08",
    period: "May 11 - June 8, 2026",
    strengths: ["Quick fact recall", "Clear mathematical reasoning", "Persistence"],
    needsSupport: ["Multi-step word problems"],
    recentProgress:
      "Judith advanced to adding fractions with unlike denominators and now explains her reasoning clearly. Mastery rose from 70% to 78% in fractions.",
    recommendedNextSteps: [
      "Introduce subtracting mixed numbers",
      "Stretch with multi-step word problems",
    ],
  },
];
