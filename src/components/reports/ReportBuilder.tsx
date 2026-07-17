"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileBarChart, Loader2, Save, Sparkles } from "lucide-react";
import type { ProgressReport, Subject } from "@/types";
import { fullName } from "@/data";
import { useDemo } from "@/components/demo/DemoProvider";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";

const AUDIENCES = ["Parent progress update", "Administrator summary", "Tutor session summary", "Student progress report"] as const;
const TONES = ["Warm", "Concise", "Professional", "Encouraging"] as const;
const DETAIL = ["Brief", "Standard", "Detailed"] as const;
const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];

export function ReportBuilder() {
  const demo = useDemo();
  const [studentId, setStudentId] = useState(demo.students[0]?.id ?? "");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("Parent progress update");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Warm");
  const [detail, setDetail] = useState<(typeof DETAIL)[number]>("Standard");
  const [subject, setSubject] = useState<Subject | "All">("All");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ProgressReport | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const student = demo.getStudentById(studentId);
  const sessions = student ? demo.getStudentSessions(student.id) : [];
  const skills = student ? demo.getStudentSkills(student.id) : [];

  const reportText = useMemo(() => {
    if (!report || !student) return "";
    return [
      `${audience} - ${fullName(student)}`,
      `Tone: ${tone} | Detail: ${detail} | Subject: ${subject}`,
      "",
      `Recent progress: ${report.recentProgress}`,
      "",
      `Strengths: ${report.strengths.join(", ")}`,
      `Needs support: ${report.needsSupport.join(", ")}`,
      "",
      "Recommended next steps:",
      ...report.recommendedNextSteps.map((step, index) => `${index + 1}. ${step}`),
    ].join("\n");
  }, [audience, detail, report, student, subject, tone]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const generate = async () => {
    if (!student) return;
    setLoading(true);
    setReport(null);
    await new Promise((resolve) => setTimeout(resolve, 850));
    const lowestSkill = [...skills].sort((a, b) => a.mastery - b.mastery)[0];
    const recent = sessions[0];
    const nextSteps = [
      `Continue targeted practice on ${lowestSkill?.skill?.name ?? student.needsSupport[0] ?? student.subjectFocus}.`,
      `Use the next session to check whether ${student.firstName} can explain the strategy independently.`,
      notes.trim() || `Share one short at-home practice activity with ${student.guardianName}.`,
    ];
    setReport({
      id: `progress-${Date.now()}`,
      studentId: student.id,
      createdOn: new Date().toISOString(),
      period: `${audience} (${detail})`,
      strengths: student.strengths.slice(0, 3),
      needsSupport: student.needsSupport.filter((item) => !item.startsWith("[Archived]")).slice(0, 3),
      recentProgress:
        recent?.notes ??
        `${student.firstName} is currently at ${student.averageMastery}% average mastery across tracked skills.`,
      recommendedNextSteps: nextSteps,
    });
    setLoading(false);
    flash("Report drafted from current demo data.");
  };

  const save = () => {
    if (!report) return;
    demo.saveProgressReport(report);
    flash("Report saved to history and student profile.");
  };

  const copy = async () => {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      flash("Copy is unavailable in this browser.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4 text-brand-500" />
                Report Builder
              </span>
            }
            subtitle="Create parent, admin, tutor, or student-facing summaries from the live demo state."
          />
          <CardBody className="space-y-4">
            <Field label="Student" htmlFor="report-student">
              <Select id="report-student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {demo.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {fullName(student)} (Grade {student.grade})
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Audience" htmlFor="report-audience">
                <Select id="report-audience" value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)}>
                  {AUDIENCES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Subject" htmlFor="report-subject">
                <Select id="report-subject" value={subject} onChange={(e) => setSubject(e.target.value as Subject | "All")}>
                  <option value="All">All subjects</option>
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tone" htmlFor="report-tone">
                <Select id="report-tone" value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}>
                  {TONES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Level of detail" htmlFor="report-detail">
                <Select id="report-detail" value={detail} onChange={(e) => setDetail(e.target.value as typeof detail)}>
                  {DETAIL.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Extra context" htmlFor="report-notes" hint="Optional">
              <Textarea
                id="report-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a detail you want reflected in the report..."
              />
            </Field>

            {student && (
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Mastery" value={`${student.averageMastery}%`} />
                <MiniStat label="Sessions" value={sessions.length} />
                <MiniStat label="Skills" value={skills.length} />
              </div>
            )}

            <Button onClick={generate} disabled={loading || !student} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Drafting..." : "Generate report"}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Generated report"
            subtitle={report ? "Save, copy, or regenerate this report." : "Choose options and generate a report to preview it here."}
            action={report && <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/20">Demo AI</Badge>}
          />
          <CardBody>
            {!report ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.025] p-8 text-center">
                <FileBarChart className="mx-auto h-8 w-8 text-slate-600" />
                <p className="mt-3 text-sm font-semibold text-slate-300">No report generated yet</p>
                <p className="mt-1 text-sm text-slate-500">The preview will use current student sessions, skills, and notes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <pre className="max-h-[520px] whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">{reportText}</pre>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={save}>
                    <Save className="h-4 w-4" />
                    Save report
                  </Button>
                  <Button size="sm" variant="secondary" onClick={copy}>
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3 text-sm font-medium text-slate-200 shadow-2xl">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
