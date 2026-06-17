"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, CalendarCheck, Filter } from "lucide-react";
import type { Session, Subject } from "@/types";
import { sessions as seedSessions, students, studentsById, fullName, initials } from "@/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Field";
import { AddSessionModal } from "@/components/sessions/AddSessionModal";
import { cn, formatDate, masteryColor } from "@/lib/utils";

const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(seedSessions);
  const [studentFilter, setStudentFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [sessions],
  );

  const filtered = useMemo(
    () =>
      sorted.filter((s) => {
        if (studentFilter !== "all" && s.studentId !== studentFilter) return false;
        if (subjectFilter !== "all" && s.subject !== subjectFilter) return false;
        return true;
      }),
    [sorted, studentFilter, subjectFilter],
  );

  const handleAdd = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
    setAddOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Sessions"
        description="Log tutoring session notes and track performance over time."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Log session
          </Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            Filter
          </div>
          <Select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="h-10 w-auto"
          >
            <option value="all">All students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {fullName(s)}
              </option>
            ))}
          </Select>
          <Select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-10 w-auto"
          >
            <option value="all">All subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <span className="text-sm text-slate-400 sm:ml-auto">
            {filtered.length} session{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No sessions yet"
          description="Log your first tutoring session to start building a progress history."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Log session
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const student = studentsById[s.studentId];
            return (
              <Card key={s.id}>
                <CardBody>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    {student ? (
                      <Link
                        href={`/students/${student.id}`}
                        className="flex items-center gap-3 sm:w-52 sm:shrink-0"
                      >
                        <Avatar initials={initials(student)} color={student.avatarColor} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{fullName(student)}</p>
                          <p className="text-xs text-slate-500">Grade {student.grade}</p>
                        </div>
                      </Link>
                    ) : (
                      <div className="sm:w-52 sm:shrink-0 text-sm text-slate-500">Unknown student</div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                          {s.subject}
                        </Badge>
                        <span className="text-sm font-medium text-slate-900">{s.skillFocus}</span>
                        <span className="text-xs text-slate-400">· {s.tutorName}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{s.notes}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Next steps:</span> {s.nextSteps}
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Score</p>
                        <p className={cn("text-lg font-semibold", masteryColor(s.performanceScore))}>
                          {s.performanceScore}%
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(s.date)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <AddSessionModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </>
  );
}
