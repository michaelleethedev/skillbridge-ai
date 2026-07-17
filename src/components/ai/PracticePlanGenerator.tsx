"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClipboardList,
  Flame,
  Users2,
  PenLine,
  Ticket,
  ArrowRight,
  Loader2,
  Sparkles,
  Save,
  Copy,
  Download,
  Check,
  History,
  Trash2,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Lightbulb,
  MessageCircle,
  Play,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import type { Subject } from "@/types";
import {
  fullName,
  currentUser,
} from "@/data";
import { useDemo } from "@/components/demo/DemoProvider";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, Input, Textarea } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { cn, masteryColor } from "@/lib/utils";

const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];
const DURATIONS = [15, 30, 45, 60] as const;
const SUPPORT_LEVELS = ["Review", "Targeted Support", "Intensive Support", "Extension"] as const;

type Duration = typeof DURATIONS[number];
type SupportLevel = typeof SUPPORT_LEVELS[number];

interface SessionActivity {
  time: string;
  activity: string;
  tutorAction: string;
  studentTask: string;
  purpose: string;
}

interface GeneratedPlan {
  studentName: string;
  subject: Subject;
  skillFocus: string;
  duration: Duration;
  supportLevel: SupportLevel;
  goal: string;
  confidence: number;
  activities: SessionActivity[];
  materials: string[];
  tutorScript: string[];
  differentiation: {
    ifStruggles: string;
    ifOnTrack: string;
    ifChallenge: string;
  };
  exitTicket: string;
  parentSummary: string;
}

interface SavedPlan {
  id: string;
  studentId: string;
  studentName: string;
  subject: Subject;
  skillFocus: string;
  duration: Duration;
  supportLevel: SupportLevel;
  plan: GeneratedPlan;
  createdOn: string;
}

export function PracticePlanGenerator() {
  const demo = useDemo();
  const { students } = demo;
  const studentsById = Object.fromEntries(students.map((s) => [s.id, s]));
  const searchParams = useSearchParams();
  const initialStudent = searchParams.get("student") ?? "";
  
  const [studentId, setStudentId] = useState(initialStudent);
  const [subject, setSubject] = useState<Subject>("Math");
  const [skillFocus, setSkillFocus] = useState("");
  const [duration, setDuration] = useState<Duration>(30);
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("Targeted Support");
  const [notes, setNotes] = useState("");
  const [includeParentSummary, setIncludeParentSummary] = useState(true);
  const [includeExitTicket, setIncludeExitTicket] = useState(true);
  const [includeDifferentiation, setIncludeDifferentiation] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [saved, setSaved] = useState<SavedPlan[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const student = studentId ? studentsById[studentId] : null;
  const studentSkills = studentId ? demo.getStudentSkills(studentId) : [];
  const overview = student
    ? {
        mastery: student.averageMastery,
        mainGap: student.needsSupport[0] ?? student.subjectFocus,
        nextStep: student.needsSupport[0] ? `Practice ${student.needsSupport[0]}` : "Ready for next skill",
        sessionsCompleted: demo.getStudentSessions(student.id).length,
      }
    : null;
  const trend: "Improving" | "Declining" | "Ready for next skill" | null = student
    ? student.averageMastery >= 78
      ? "Ready for next skill"
      : student.averageMastery >= 55
        ? "Improving"
        : "Declining"
    : null;

  const suggestions = studentId
    ? studentSkills
        .sort((a, b) => a.mastery - b.mastery)
        .slice(0, 3)
        .map((s) => s.skill?.name ?? "")
        .filter(Boolean)
    : [];

  const generate = async () => {
    if (!skillFocus.trim()) {
      setError("Enter a skill focus to generate a plan.");
      return;
    }
    setError(null);
    setLoading(true);
    setPlan(null);
    
    try {
      // Simulate API call - in production this would call /api/practice-plan
      await new Promise((r) => setTimeout(r, 1200));
      
      const generatedPlan = generateMockPlan({
        studentName: student ? fullName(student) : "Student",
        subject,
        skillFocus: skillFocus.trim(),
        duration,
        supportLevel,
        notes,
        includeParentSummary,
        includeExitTicket,
        includeDifferentiation,
      });
      
      setPlan(generatedPlan);
      flash("Practice plan generated!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      flash("Plan generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = () => {
    if (!plan) return;
    const savedPlan: SavedPlan = {
      id: `plan-${Date.now()}`,
      studentId: studentId || "general",
      studentName: student ? fullName(student) : "General plan",
      subject,
      skillFocus,
      duration,
      supportLevel,
      plan,
      createdOn: new Date().toISOString(),
    };
    setSaved((prev) => [savedPlan, ...prev]);
    if (studentId) {
      demo.savePracticePlan({
        id: savedPlan.id,
        studentId,
        createdOn: savedPlan.createdOn,
        skillFocus: plan.skillFocus,
        warmUp: plan.activities[0]?.activity ?? plan.goal,
        guidedPractice: plan.activities[1]?.activity ?? plan.goal,
        independentPractice: plan.activities[2]?.activity ?? "Complete targeted practice.",
        exitTicket: plan.exitTicket,
        nextSessionFocus: plan.activities.at(-1)?.purpose ?? `Continue ${plan.skillFocus}.`,
      });
    }
    flash("Plan saved to history.");
  };

  const loadPlan = (p: SavedPlan) => {
    setStudentId(p.studentId === "general" ? "" : p.studentId);
    setSubject(p.subject);
    setSkillFocus(p.skillFocus);
    setDuration(p.duration);
    setSupportLevel(p.supportLevel);
    setPlan(p.plan);
    setShowHistory(false);
    flash("Plan loaded from history.");
  };

  const deletePlan = (id: string) => {
    setSaved((prev) => prev.filter((p) => p.id !== id));
    flash("Plan deleted.");
  };

  const copyPlan = async () => {
    if (!plan) return;
    const text = formatPlanAsText(plan);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      flash("Copy is unavailable in this browser.");
    }
  };

  const downloadPDF = () => {
    flash("PDF download is a demo placeholder.");
  };

  const regenerate = () => {
    generate();
  };

  const startSession = () => {
    if (!plan || !studentId) {
      flash("Select a student and generate a plan first.");
      return;
    }
    demo.addSession({
      id: `sess-${Date.now()}`,
      studentId,
      tutorName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      subject: plan.subject,
      skillFocus: plan.skillFocus,
      notes: `Started practice plan: ${plan.goal}`,
      performanceScore: Math.max(55, Math.min(92, Math.round(plan.confidence - 8))),
      nextSteps: plan.activities.at(-1)?.purpose ?? `Continue ${plan.skillFocus}.`,
    });
    flash("Tutoring session started and added to the student timeline.");
  };

  return (
    <>
      {/* History toggle */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="h-4 w-4" />
          {showHistory ? "Hide" : "Show"} saved plans ({saved.length})
        </Button>
      </div>

      {/* Saved plans history */}
      {showHistory && saved.length > 0 && (
        <Card className="mb-4">
          <CardHeader title="Saved plans" subtitle={`${saved.length} saved plan${saved.length === 1 ? "" : "s"}`} />
          <CardBody className="space-y-2">
            {saved.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:bg-slate-100/50"
              >
                <button
                  onClick={() => loadPlan(p)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-sm font-medium text-slate-900">{p.studentName}</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {p.skillFocus} · {p.subject} · {p.duration} min · {p.supportLevel}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(p.createdOn).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
                <button
                  onClick={() => deletePlan(p.id)}
                  className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Generator form */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-brand-600" />
                  Practice Plan Generator
                </span>
              }
              subtitle="Create a personalized tutoring session based on student skill gaps and AI recommendations"
            />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Student" htmlFor="pp-student" hint="Optional — personalizes the plan">
                  <Select
                    id="pp-student"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      const selectedStudent = studentsById[e.target.value];
                      if (selectedStudent) {
                        setSubject(selectedStudent.subjectFocus);
                      }
                    }}
                  >
                    <option value="">No specific student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {fullName(s)} (Grade {s.grade})
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Subject" htmlFor="pp-subject">
                  <Select
                    id="pp-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field label="Skill focus" htmlFor="pp-skill" error={error ?? undefined}>
                <Input
                  id="pp-skill"
                  value={skillFocus}
                  onChange={(e) => setSkillFocus(e.target.value)}
                  placeholder="e.g. Comparing Fractions"
                  invalid={!!error}
                />
              </Field>

              {suggestions.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Suggested focus (lowest mastery)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSkillFocus(s)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Session duration" htmlFor="pp-duration">
                  <Select
                    id="pp-duration"
                    value={duration.toString()}
                    onChange={(e) => setDuration(Number(e.target.value) as Duration)}
                  >
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d} minutes
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Support level" htmlFor="pp-support">
                  <Select
                    id="pp-support"
                    value={supportLevel}
                    onChange={(e) => setSupportLevel(e.target.value as SupportLevel)}
                  >
                    {SUPPORT_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field label="Tutor notes" htmlFor="pp-notes" hint="Optional — context for the AI">
                <Textarea
                  id="pp-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Student struggles with visual models..."
                />
              </Field>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Include in plan</p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={includeParentSummary}
                      onChange={(e) => setIncludeParentSummary(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Parent-friendly summary
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={includeExitTicket}
                      onChange={(e) => setIncludeExitTicket(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Exit ticket
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={includeDifferentiation}
                      onChange={(e) => setIncludeDifferentiation(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Differentiation tips
                  </label>
                </div>
              </div>

              <Button onClick={generate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate practice plan
                  </>
                )}
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Student context panel */}
        {student && overview && (
          <Card className="self-start">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-400" />
                  Student context
                </span>
              }
              subtitle={fullName(student)}
            />
            <CardBody className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Current mastery</p>
                <p className={cn("mt-1 text-2xl font-semibold", masteryColor(overview.mastery))}>
                  {overview.mastery}%
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Main learning gap</p>
                <p className="mt-1 text-sm text-slate-700">{overview.mainGap}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Recent trend</p>
                <div className="mt-1 flex items-center gap-2">
                  {trend === "Improving" && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                  {trend === "Declining" && <TrendingDown className="h-4 w-4 text-rose-600" />}
                  <span className="text-sm text-slate-700">{trend}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">AI recommended focus</p>
                <p className="mt-1 text-sm text-slate-700">{overview.nextStep}</p>
              </div>
              <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3">
                <p className="text-xs font-semibold text-brand-700">Sessions completed</p>
                <p className="mt-1 text-2xl font-semibold text-brand-900">{overview.sessionsCompleted}</p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Generated plan output */}
      {loading && <PlanSkeleton />}

      {!loading && !plan && (
        <EmptyState
          icon={ClipboardList}
          title="Your practice plan will appear here"
          description="Fill out the form above and click Generate to create a personalized, timed session plan with materials, tutor scripts, and differentiation tips."
        />
      )}

      {!loading && plan && (
        <PlanOutput
          plan={plan}
          onSave={savePlan}
          onCopy={copyPlan}
          onDownload={downloadPDF}
          onRegenerate={regenerate}
          onStartSession={startSession}
          copied={copied}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-card-hover">
          <Check className="h-4 w-4 text-emerald-600" />
          {toast}
        </div>
      )}
    </>
  );
}

/* ----------------------------- Helper Functions ----------------------------- */

function generateMockPlan(input: {
  studentName: string;
  subject: Subject;
  skillFocus: string;
  duration: Duration;
  supportLevel: SupportLevel;
  notes: string;
  includeParentSummary: boolean;
  includeExitTicket: boolean;
  includeDifferentiation: boolean;
}): GeneratedPlan {
  const { studentName, subject, skillFocus, duration, supportLevel } = input;

  // Generate timed activities based on duration
  const activities = generateTimedActivities(duration, skillFocus, subject, supportLevel);

  // Generate materials based on subject and skill
  const materials = generateMaterials(subject, skillFocus);

  // Generate tutor script
  const tutorScript = generateTutorScript(skillFocus, subject);

  // Generate differentiation
  const differentiation = {
    ifStruggles: `Break ${skillFocus.toLowerCase()} into smaller steps. Use more concrete examples and visual aids. Provide sentence frames and guided practice.`,
    ifOnTrack: `Continue with planned activities. Add 1-2 challenge questions at the end to extend thinking.`,
    ifChallenge: `Skip warm-up review. Move quickly to independent practice. Add extension activity: apply ${skillFocus.toLowerCase()} to a real-world problem or multi-step scenario.`,
  };

  // Generate exit ticket
  const exitTicket = generateExitTicket(skillFocus, subject);

  // Generate parent summary
  const parentSummary = `${studentName} practiced ${skillFocus.toLowerCase()} today. We focused on building understanding through hands-on activities and guided practice. ${studentName} is making progress and should continue practicing at home with the activities shared earlier this week.`;

  return {
    studentName,
    subject,
    skillFocus,
    duration,
    supportLevel,
    goal: `Build mastery in ${skillFocus.toLowerCase()} through structured practice and immediate feedback.`,
    confidence: Math.round(85 + Math.random() * 10),
    activities,
    materials,
    tutorScript,
    differentiation,
    exitTicket,
    parentSummary,
  };
}

function generateTimedActivities(
  duration: Duration,
  skill: string,
  subject: Subject,
  level: SupportLevel
): SessionActivity[] {
  const skillLower = skill.toLowerCase();
  
  if (duration === 15) {
    return [
      {
        time: "0–3 min",
        activity: "Quick review",
        tutorAction: "Ask 2-3 recall questions about prerequisite skills",
        studentTask: "Answer verbally or on whiteboard",
        purpose: "Activate prior knowledge",
      },
      {
        time: "3–10 min",
        activity: "Guided practice",
        tutorAction: `Model ${skillLower} with think-aloud, then work 2 examples together`,
        studentTask: "Follow along, then solve with tutor support",
        purpose: "Build understanding through modeling",
      },
      {
        time: "10–15 min",
        activity: "Exit check",
        tutorAction: "Give 1-2 quick problems to assess understanding",
        studentTask: "Complete independently",
        purpose: "Check for understanding",
      },
    ];
  }

  if (duration === 30) {
    return [
      {
        time: "0–5 min",
        activity: "Warm-up",
        tutorAction: `Quick review game or fluency drill targeting ${skillLower}`,
        studentTask: "Participate actively, answer questions",
        purpose: "Activate prior knowledge and build confidence",
      },
      {
        time: "5–10 min",
        activity: "Mini lesson",
        tutorAction: `Teach or review ${skillLower} concept with visual model`,
        studentTask: "Watch, ask questions, take notes if helpful",
        purpose: "Introduce or reinforce target skill",
      },
      {
        time: "10–20 min",
        activity: "Guided practice",
        tutorAction: "Work through 3-4 problems together, narrating each step",
        studentTask: "Solve with tutor support, explain thinking",
        purpose: "Build procedural fluency with scaffolding",
      },
      {
        time: "20–27 min",
        activity: "Independent practice",
        tutorAction: "Observe and provide feedback as needed",
        studentTask: "Complete 4-5 problems independently",
        purpose: "Apply skill without immediate support",
      },
      {
        time: "27–30 min",
        activity: "Exit ticket",
        tutorAction: "Give 1-2 problems to assess mastery",
        studentTask: "Complete and explain answer",
        purpose: "Check for understanding and plan next steps",
      },
    ];
  }

  if (duration === 45) {
    return [
      {
        time: "0–7 min",
        activity: "Warm-up & review",
        tutorAction: `Fluency practice or review game on ${skillLower}`,
        studentTask: "Participate, answer questions",
        purpose: "Activate prior knowledge",
      },
      {
        time: "7–15 min",
        activity: "Mini lesson",
        tutorAction: `Teach ${skillLower} with concrete examples and visual models`,
        studentTask: "Engage with examples, ask clarifying questions",
        purpose: "Build conceptual understanding",
      },
      {
        time: "15–28 min",
        activity: "Guided practice",
        tutorAction: "Work through 5-6 problems together with gradual release",
        studentTask: "Solve collaboratively, explain reasoning",
        purpose: "Develop procedural fluency",
      },
      {
        time: "28–40 min",
        activity: "Independent practice",
        tutorAction: "Circulate, provide targeted feedback",
        studentTask: "Complete 6-8 problems independently",
        purpose: "Apply skill autonomously",
      },
      {
        time: "40–45 min",
        activity: "Exit ticket & reflection",
        tutorAction: "Give exit ticket, discuss next session focus",
        studentTask: "Complete exit ticket, reflect on learning",
        purpose: "Assess mastery and set goals",
      },
    ];
  }

  // 60 minutes
  return [
    {
      time: "0–10 min",
      activity: "Warm-up & review",
      tutorAction: `Review previous session, fluency practice on ${skillLower}`,
      studentTask: "Complete warm-up activities, review notes",
      purpose: "Connect to prior learning",
    },
    {
      time: "10–20 min",
      activity: "Mini lesson",
      tutorAction: `Explicit instruction on ${skillLower} with multiple examples`,
      studentTask: "Take notes, ask questions, work sample problems",
      purpose: "Build deep conceptual understanding",
    },
    {
      time: "20–35 min",
      activity: "Guided practice",
      tutorAction: "Work through 6-8 problems with gradual release of responsibility",
      studentTask: "Solve collaboratively, explain thinking aloud",
      purpose: "Develop fluency with scaffolding",
    },
    {
      time: "35–52 min",
      activity: "Independent practice",
      tutorAction: "Monitor progress, provide just-in-time support",
      studentTask: "Complete 8-10 problems independently",
      purpose: "Build automaticity and confidence",
    },
    {
      time: "52–60 min",
      activity: "Exit ticket & wrap-up",
      tutorAction: "Administer exit ticket, review key takeaways, preview next session",
      studentTask: "Complete exit ticket, reflect on progress, set personal goal",
      purpose: "Assess mastery and plan next steps",
    },
  ];
}

function generateMaterials(subject: Subject, skill: string): string[] {
  const base = ["Whiteboard and markers", "Practice worksheet", "Pencil and paper"];
  
  if (subject === "Math") {
    return [...base, "Visual fraction models or manipulatives", "Number line", "Graph paper"];
  }
  if (subject === "Reading") {
    return [...base, "Short passage (grade-appropriate)", "Highlighters", "Graphic organizer"];
  }
  if (subject === "Phonics") {
    return [...base, "Letter tiles or cards", "Sound boxes (Elkonin boxes)", "Decodable text"];
  }
  if (subject === "Writing") {
    return [...base, "Sentence frames", "Transition word list", "Rubric or checklist"];
  }
  return base;
}

function generateTutorScript(skill: string, subject: Subject): string[] {
  const skillLower = skill.toLowerCase();
  
  return [
    `"Today we're focusing on ${skillLower}. By the end of our session, you'll be able to..."`,
    `"Let me show you how I think through this. First, I..."`,
    `"Now you try one. What's your first step?"`,
    `"Great thinking! Can you explain why you chose that strategy?"`,
    `"If you get stuck, remember to..."`,
    `"Let's check your work together. What do you notice?"`,
  ];
}

function generateExitTicket(skill: string, subject: Subject): string {
  const skillLower = skill.toLowerCase();
  
  if (subject === "Math") {
    return `Solve one problem on ${skillLower}. Show your work and explain your thinking in 1-2 sentences.`;
  }
  if (subject === "Reading") {
    return `Read a short passage and answer one question about ${skillLower}. Underline your text evidence.`;
  }
  if (subject === "Phonics") {
    return `Read 5 new words aloud that use today's target sounds. Blend each sound smoothly.`;
  }
  if (subject === "Writing") {
    return `Write 2-3 sentences using ${skillLower}. Check your work with the rubric.`;
  }
  return `Complete one quick check on ${skillLower} to show what you learned today.`;
}

function formatPlanAsText(plan: GeneratedPlan): string {
  const lines = [
    `Practice Plan — ${plan.studentName}`,
    `Subject: ${plan.subject} | Skill: ${plan.skillFocus} | Duration: ${plan.duration} min | Support: ${plan.supportLevel}`,
    ``,
    `GOAL: ${plan.goal}`,
    ``,
    `TIMED SESSION PLAN:`,
    ...plan.activities.map(
      (a) =>
        `${a.time} — ${a.activity}\n  Tutor: ${a.tutorAction}\n  Student: ${a.studentTask}\n  Purpose: ${a.purpose}`
    ),
    ``,
    `MATERIALS NEEDED:`,
    ...plan.materials.map((m) => `• ${m}`),
    ``,
    `TUTOR SCRIPT:`,
    ...plan.tutorScript.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `DIFFERENTIATION:`,
    `If struggles: ${plan.differentiation.ifStruggles}`,
    `If on track: ${plan.differentiation.ifOnTrack}`,
    `If ready for challenge: ${plan.differentiation.ifChallenge}`,
    ``,
    `EXIT TICKET:`,
    plan.exitTicket,
    ``,
    `PARENT SUMMARY:`,
    plan.parentSummary,
  ];
  return lines.join("\n");
}

/* ----------------------------- Sub-Components ----------------------------- */

function PlanSkeleton() {
  return (
    <Card className="mt-4">
      <CardBody className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating your personalized practice plan...
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="shimmer h-4 w-32 rounded" />
            <div className="shimmer h-3 w-full rounded" />
            <div className="shimmer h-3 w-5/6 rounded" />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

interface PlanOutputProps {
  plan: GeneratedPlan;
  onSave: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  onStartSession: () => void;
  copied: boolean;
}

function PlanOutput({
  plan,
  onSave,
  onCopy,
  onDownload,
  onRegenerate,
  onStartSession,
  copied,
}: PlanOutputProps) {
  return (
    <div className="mt-4 space-y-4">
      {/* Session Overview */}
      <Card className="overflow-hidden ring-1 ring-brand-100">
        <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-brand-50 to-white px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ClipboardList className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Practice Plan</h3>
              <p className="text-[11px] text-slate-500">
                {plan.studentName} · {plan.subject} · {plan.duration} min
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/20">
            {plan.confidence}% confidence
          </Badge>
        </div>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            <Button size="sm" variant="secondary" onClick={onSave}>
              <Save className="h-4 w-4" />
              Save plan
            </Button>
            <Button size="sm" variant="secondary" onClick={onCopy}>
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="secondary" onClick={onDownload}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button size="sm" variant="secondary" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button size="sm" onClick={onStartSession}>
              <Play className="h-4 w-4" />
              Start session
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skill focus</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{plan.skillFocus}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Support level</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{plan.supportLevel}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Session goal</p>
              <p className="mt-1 text-sm text-slate-700">{plan.goal}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Timed Session Plan */}
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              Timed session plan
            </span>
          }
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-2 pr-4 font-semibold text-slate-600">Time</th>
                  <th className="pb-2 pr-4 font-semibold text-slate-600">Activity</th>
                  <th className="pb-2 pr-4 font-semibold text-slate-600">Tutor Action</th>
                  <th className="pb-2 pr-4 font-semibold text-slate-600">Student Task</th>
                  <th className="pb-2 font-semibold text-slate-600">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {plan.activities.map((a, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 align-top font-medium text-brand-600">{a.time}</td>
                    <td className="py-3 pr-4 align-top font-medium text-slate-900">{a.activity}</td>
                    <td className="py-3 pr-4 align-top text-slate-600">{a.tutorAction}</td>
                    <td className="py-3 pr-4 align-top text-slate-600">{a.studentTask}</td>
                    <td className="py-3 align-top text-slate-500">{a.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Materials & Tutor Script */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                Materials needed
              </span>
            }
          />
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {plan.materials.map((m, i) => (
                <Badge key={i} className="bg-slate-100 text-slate-700 ring-slate-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  {m}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-400" />
                Tutor script
              </span>
            }
          />
          <CardBody>
            <ul className="space-y-2">
              {plan.tutorScript.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Differentiation */}
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-slate-400" />
              Differentiation tips
            </span>
          }
        />
        <CardBody className="space-y-3">
          <div className="rounded-lg border border-rose-100 bg-rose-50/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">If student struggles</p>
            <p className="mt-1 text-sm text-slate-700">{plan.differentiation.ifStruggles}</p>
          </div>
          <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">If student is on track</p>
            <p className="mt-1 text-sm text-slate-700">{plan.differentiation.ifOnTrack}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              If student is ready for challenge
            </p>
            <p className="mt-1 text-sm text-slate-700">{plan.differentiation.ifChallenge}</p>
          </div>
        </CardBody>
      </Card>

      {/* Exit Ticket & Parent Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-slate-400" />
                Exit ticket
              </span>
            }
          />
          <CardBody>
            <p className="text-sm text-slate-700">{plan.exitTicket}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-400" />
                Parent-friendly summary
              </span>
            }
          />
          <CardBody>
            <p className="text-sm text-slate-700">{plan.parentSummary}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
