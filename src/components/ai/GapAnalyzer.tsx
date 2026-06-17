"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Wand2,
  Target,
  Lightbulb,
  ArrowRightCircle,
  Gamepad2,
  MessageCircle,
  ListChecks,
  Loader2,
  Save,
  Download,
  Copy,
  Check,
  History,
  Trash2,
} from "lucide-react";
import type { AIReport } from "@/types";
import { students, fullName } from "@/data";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

type Result = Omit<AIReport, "id" | "studentId" | "createdOn">;

interface SavedAnalysis {
  id: string;
  studentId: string;
  studentName: string;
  note: string;
  result: Result;
  createdOn: string;
}

const SAMPLE_NOTES = [
  "Angel read a passage about sea turtles but retold the events out of order and couldn't name the main idea.",
  "Mateo can say each letter sound but says them separately, like c-a-t, and can't push them together into 'cat'.",
  "Bruce thinks 1/4 is bigger than 1/3 because 4 is bigger than 3, and gets frustrated quickly.",
  "Aliyah reads accurately but very slowly and choppily, with no expression.",
];

export function GapAnalyzer() {
  const searchParams = useSearchParams();
  const initialStudent = searchParams.get("student") ?? "";

  const [studentId, setStudentId] = useState(initialStudent);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [mocked, setMocked] = useState(true);
  const [saved, setSaved] = useState<SavedAnalysis[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const analyze = async () => {
    if (!note.trim()) {
      setError("Please enter a tutor note to analyze.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const student = students.find((s) => s.id === studentId);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note,
          studentName: student ? fullName(student) : undefined,
          subject: student?.subjectFocus,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Analysis failed. Please try again.");
      }
      const data = await res.json();
      setResult(data.result);
      setMocked(data.mocked);
      flash("Analysis complete!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      flash("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = () => {
    if (!result) return;
    const student = students.find((s) => s.id === studentId);
    const analysis: SavedAnalysis = {
      id: `analysis-${Date.now()}`,
      studentId: studentId || "general",
      studentName: student ? fullName(student) : "General analysis",
      note,
      result,
      createdOn: new Date().toISOString(),
    };
    setSaved((prev) => [analysis, ...prev]);
    flash("Analysis saved to history.");
  };

  const loadAnalysis = (a: SavedAnalysis) => {
    setStudentId(a.studentId === "general" ? "" : a.studentId);
    setNote(a.note);
    setResult(a.result);
    setShowHistory(false);
    flash("Analysis loaded from history.");
  };

  const deleteAnalysis = (id: string) => {
    setSaved((prev) => prev.filter((a) => a.id !== id));
    flash("Analysis deleted.");
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const student = students.find((s) => s.id === studentId);
    const text = [
      `AI Learning Gap Analysis${student ? ` — ${fullName(student)}` : ""}`,
      "",
      `Detected gap: ${result.detectedGap}`,
      `Likely cause: ${result.likelyCause}`,
      `Recommended next step: ${result.recommendedNextStep}`,
      `Practice activity: ${result.practiceActivity}`,
      `Parent update: ${result.parentUpdate}`,
      "",
      "Tutor action plan:",
      ...result.tutorActionPlan.map((s, i) => `${i + 1}. ${s}`),
    ].join("\n");
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

  const sections = result
    ? [
        { icon: Target, label: "Detected learning gap", value: result.detectedGap, accent: "text-rose-600 bg-rose-50" },
        { icon: Lightbulb, label: "Likely cause", value: result.likelyCause, accent: "text-amber-600 bg-amber-50" },
        { icon: ArrowRightCircle, label: "Recommended next step", value: result.recommendedNextStep, accent: "text-brand-600 bg-brand-50" },
        { icon: Gamepad2, label: "Practice activity", value: result.practiceActivity, accent: "text-violet-600 bg-violet-50" },
        { icon: MessageCircle, label: "Parent-friendly update", value: result.parentUpdate, accent: "text-emerald-600 bg-emerald-50" },
      ]
    : [];

  return (
    <>
      {/* History sidebar toggle */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="h-4 w-4" />
          {showHistory ? "Hide" : "Show"} history ({saved.length})
        </Button>
      </div>

      {showHistory && saved.length > 0 && (
        <Card className="mb-4">
          <CardHeader title="Saved analyses" subtitle={`${saved.length} saved analysis${saved.length === 1 ? "" : "es"}`} />
          <CardBody className="space-y-2">
            {saved.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:bg-slate-100/50"
              >
                <button
                  onClick={() => loadAnalysis(a)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-sm font-medium text-slate-900">{a.studentName}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{a.note}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(a.createdOn).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
                <button
                  onClick={() => deleteAnalysis(a.id)}
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Input panel */}
      <Card className="self-start">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-brand-600" />
              Analyze a tutor note
            </span>
          }
          subtitle="Paste a rough session note. The AI extracts the gap and a plan."
        />
        <CardBody className="space-y-4">
          <Field label="Student" htmlFor="student" hint="Optional — personalizes the parent update">
            <Select id="student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">No specific student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {fullName(s)} (Grade {s.grade})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Tutor note" htmlFor="note" error={error ?? undefined}>
            <Textarea
              id="note"
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Student read the passage but couldn't identify the main idea..."
              invalid={!!error}
            />
          </Field>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Try a sample note</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setNote(s)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  Sample {i + 1}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={analyze} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze note
              </>
            )}
          </Button>
        </CardBody>
      </Card>

      {/* Result panel */}
      <div className="space-y-4">
        {loading && <AnalyzingSkeleton />}

        {!loading && !result && (
          <EmptyState
            icon={Sparkles}
            title="AI analysis will appear here"
            description="Enter a tutor note and click Analyze to detect the learning gap, likely cause, and a recommended action plan."
          />
        )}

        {!loading && result && (
          <>
            <Card className="overflow-hidden">
              <div className="border-l-4 border-brand-500">
                <CardHeader
                  title={
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand-600" />
                      Analysis result
                    </span>
                  }
                  action={
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/20">
                        {result.confidence}% confidence
                      </Badge>
                      {mocked && (
                        <Badge className="bg-slate-100 text-slate-500 ring-slate-500/20">
                          Mock AI
                        </Badge>
                      )}
                    </div>
                  }
                />
                <CardBody className="space-y-4">
                  <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                    <Button size="sm" variant="secondary" onClick={saveAnalysis}>
                      <Save className="h-4 w-4" />
                      Save to history
                    </Button>
                    <Button size="sm" variant="secondary" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={downloadPDF}>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                  {sections.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.accent}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {s.label}
                          </p>
                          <p className="mt-0.5 text-sm text-slate-700">{s.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardBody>
              </div>
            </Card>

            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-slate-400" />
                    Tutor action plan
                  </span>
                }
              />
              <CardBody>
                <ul className="space-y-2">
                  {result.tutorActionPlan.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>

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

function AnalyzingSkeleton() {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Reading the note and detecting patterns...
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="shimmer h-8 w-8 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-3 w-32 rounded" />
              <div className="shimmer h-3 w-full rounded" />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
