import type { Session } from "@/types";

/** Tutoring session history. Maps to `sessions`. Notes are education-focused. */
export const sessions: Session[] = [
  {
    id: "sess-1",
    studentId: "stu-angel",
    tutorName: "Jordan Mitchell",
    date: "2026-06-09",
    subject: "Reading",
    skillFocus: "Reading Comprehension",
    notes:
      "Angel read a 2-paragraph passage about sea turtles. He retold events out of order and struggled to name the main idea when asked directly. Did well answering literal 'who/what' questions. Lost focus during the second read.",
    performanceScore: 55,
    nextSteps:
      "Model main-idea-finding with a graphic organizer. Use shorter passages and chunk into one paragraph at a time.",
  },
  {
    id: "sess-2",
    studentId: "stu-angel",
    tutorName: "Jordan Mitchell",
    date: "2026-06-02",
    subject: "Reading",
    skillFocus: "Vocabulary",
    notes:
      "Pre-taught 5 vocabulary words before reading. Angel used 3 of them correctly in sentences. Engagement was higher when we connected words to his own experiences.",
    performanceScore: 65,
    nextSteps: "Continue pre-teaching vocabulary. Add picture supports for abstract words.",
  },
  {
    id: "sess-3",
    studentId: "stu-bruce",
    tutorName: "Jordan Mitchell",
    date: "2026-06-10",
    subject: "Math",
    skillFocus: "Fractions",
    notes:
      "Bruce confused the numerator and denominator when comparing 1/3 and 1/4, assuming larger bottom number means larger fraction. Frustrated quickly and wanted to stop. Responded well to fraction tiles.",
    performanceScore: 35,
    nextSteps: "Build fraction sense with manipulatives before symbols. Keep tasks short to protect confidence.",
  },
  {
    id: "sess-4",
    studentId: "stu-bruce",
    tutorName: "Jordan Mitchell",
    date: "2026-06-03",
    subject: "Math",
    skillFocus: "Place Value",
    notes:
      "Worked on reading 4-digit numbers. Bruce mixed up tens and hundreds places. Using a place-value chart helped. Needs repeated practice.",
    performanceScore: 40,
    nextSteps: "Daily 5-minute place-value warm-up. Pair numbers with base-ten blocks.",
  },
  {
    id: "sess-5",
    studentId: "stu-judith",
    tutorName: "Jordan Mitchell",
    date: "2026-06-08",
    subject: "Math",
    skillFocus: "Fractions",
    notes:
      "Judith added fractions with unlike denominators with only occasional reminders to find a common denominator. Strong reasoning when explaining her steps.",
    performanceScore: 85,
    nextSteps: "Introduce subtracting mixed numbers. Stretch with a multi-step word problem.",
  },
  {
    id: "sess-6",
    studentId: "stu-aliyah",
    tutorName: "Jordan Mitchell",
    date: "2026-06-07",
    subject: "Reading",
    skillFocus: "Reading Fluency",
    notes:
      "Repeated reading of a familiar passage improved Aliyah's rate and expression noticeably by the third read. Still pauses on multisyllabic words.",
    performanceScore: 68,
    nextSteps: "Continue repeated reading. Add syllable-clapping for longer words.",
  },
  {
    id: "sess-7",
    studentId: "stu-mateo",
    tutorName: "Jordan Mitchell",
    date: "2026-06-06",
    subject: "Phonics",
    skillFocus: "Blending Sounds",
    notes:
      "Mateo can say individual letter sounds but says them in isolation without blending into a word (c-a-t but not 'cat'). Loved the sound-blending game with magnetic letters.",
    performanceScore: 44,
    nextSteps: "Use continuous blending and Elkonin boxes. Practice 2-3 sound words first.",
  },
  {
    id: "sess-8",
    studentId: "stu-elijah",
    tutorName: "Jordan Mitchell",
    date: "2026-06-09",
    subject: "Reading",
    skillFocus: "Decoding Multisyllabic Words",
    notes:
      "Elijah guesses at longer words based on the first letter rather than decoding. Reading stamina fades after about 5 minutes. Comprehension is stronger when text is read aloud to him.",
    performanceScore: 42,
    nextSteps: "Teach syllable division strategies. Build stamina in short timed increments.",
  },
  {
    id: "sess-9",
    studentId: "stu-damian",
    tutorName: "Jordan Mitchell",
    date: "2026-06-08",
    subject: "Math",
    skillFocus: "Fraction Operations",
    notes:
      "Damian multiplied fractions accurately and self-corrected one error. Still hesitant with simplifying answers.",
    performanceScore: 72,
    nextSteps: "Practice simplifying with GCF. Introduce dividing fractions next.",
  },
  {
    id: "sess-10",
    studentId: "stu-sophia",
    tutorName: "Jordan Mitchell",
    date: "2026-06-05",
    subject: "Writing",
    skillFocus: "Paragraph Writing",
    notes:
      "Sophia wrote a strong topic sentence and two details but her concluding sentence restated the topic verbatim. Great word choice throughout.",
    performanceScore: 80,
    nextSteps: "Model varied concluding sentences. Introduce transition words.",
  },
  {
    id: "sess-11",
    studentId: "stu-olivia",
    tutorName: "Jordan Mitchell",
    date: "2026-06-04",
    subject: "Math",
    skillFocus: "Place Value with Regrouping",
    notes:
      "Olivia added two-digit numbers with regrouping with 90% accuracy. Quick and confident; ready for a challenge.",
    performanceScore: 88,
    nextSteps: "Introduce three-digit addition with regrouping.",
  },
  {
    id: "sess-12",
    studentId: "stu-noah",
    tutorName: "Jordan Mitchell",
    date: "2026-06-03",
    subject: "Reading",
    skillFocus: "Letter-Sound Fluency",
    notes:
      "Noah named 18/26 lowercase letter sounds in one minute, up from 14 last week. Mixed up b/d. Enjoyed the letter-sound bingo.",
    performanceScore: 63,
    nextSteps: "Target b/d discrimination. Continue daily letter-sound fluency drills.",
  },
];
