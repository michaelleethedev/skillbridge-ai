import { Target } from "lucide-react";
import type { Subject } from "@/types";
import { skills, studentSkills, students } from "@/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn, masteryColor } from "@/lib/utils";

interface SkillStat {
  id: string;
  name: string;
  subject: Subject;
  gradeBand: string;
  studentsTracking: number;
  avgMastery: number;
}

function buildSkillStats(): SkillStat[] {
  return skills
    .map((skill) => {
      const records = studentSkills.filter((ss) => ss.skillId === skill.id);
      const avg =
        records.length > 0
          ? Math.round(records.reduce((sum, r) => sum + r.mastery, 0) / records.length)
          : 0;
      return {
        id: skill.id,
        name: skill.name,
        subject: skill.subject,
        gradeBand: skill.gradeBand,
        studentsTracking: records.length,
        avgMastery: avg,
      };
    })
    .filter((s) => s.studentsTracking > 0);
}

const subjectBadge: Record<string, string> = {
  Reading: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Math: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Writing: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  Phonics: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Science: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export default function SkillsPage() {
  const stats = buildSkillStats();

  const bySubject = stats.reduce<Record<string, SkillStat[]>>((acc, s) => {
    (acc[s.subject] = acc[s.subject] || []).push(s);
    return acc;
  }, {});

  const totalTracked = stats.length;
  const programAvg = Math.round(
    stats.reduce((sum, s) => sum + s.avgMastery, 0) / Math.max(1, stats.length),
  );

  return (
    <>
      <PageHeader
        title="Skills"
        description="Track mastery across the program's skill catalog."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Skills tracked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalTracked}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Students assessed</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{students.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Program avg. mastery</p>
          <p className={cn("mt-2 text-3xl font-semibold", masteryColor(programAvg))}>
            {programAvg}%
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Object.entries(bySubject).map(([subject, list]) => (
          <Card key={subject}>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-400" />
                  {subject}
                </span>
              }
              subtitle={`${list.length} skills`}
            />
            <CardBody className="space-y-4">
              {list
                .sort((a, b) => a.avgMastery - b.avgMastery)
                .map((s) => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{s.name}</span>
                        <Badge className={subjectBadge[s.subject] ?? "bg-slate-100 text-slate-600 ring-slate-500/20"}>
                          {s.gradeBand}
                        </Badge>
                      </div>
                      <span className={cn("text-sm font-semibold", masteryColor(s.avgMastery))}>
                        {s.avgMastery}%
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <ProgressBar value={s.avgMastery} colorByValue className="flex-1" />
                      <span className="w-24 shrink-0 text-right text-xs text-slate-400">
                        {s.studentsTracking} student{s.studentsTracking === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
