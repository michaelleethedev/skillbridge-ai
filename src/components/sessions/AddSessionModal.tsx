"use client";

import { useState } from "react";
import type { Session, Subject } from "@/types";
import { students, fullName, currentUser } from "@/data";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";

const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];

interface FormState {
  studentId: string;
  date: string;
  subject: Subject;
  skillFocus: string;
  notes: string;
  performanceScore: string;
  nextSteps: string;
}

const initialForm = (): FormState => ({
  studentId: "",
  date: new Date().toISOString().slice(0, 10),
  subject: "Reading",
  skillFocus: "",
  notes: "",
  performanceScore: "",
  nextSteps: "",
});

export function AddSessionModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (session: Session) => void;
}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.studentId) next.studentId = "Select a student.";
    if (!form.date) next.date = "Select a date.";
    if (!form.skillFocus.trim()) next.skillFocus = "Skill focus is required.";
    if (!form.notes.trim()) next.notes = "Add at least a short note.";
    const score = Number(form.performanceScore);
    if (form.performanceScore === "" || Number.isNaN(score) || score < 0 || score > 100) {
      next.performanceScore = "Enter a score between 0 and 100.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm(initialForm());
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const session: Session = {
      id: `sess-${Date.now()}`,
      studentId: form.studentId,
      tutorName: currentUser.name,
      date: form.date,
      subject: form.subject,
      skillFocus: form.skillFocus.trim(),
      notes: form.notes.trim(),
      performanceScore: Number(form.performanceScore),
      nextSteps: form.nextSteps.trim() || "—",
    };

    setSubmitting(false);
    reset();
    onAdd(session);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Log a tutoring session"
      description="Capture what happened so progress and AI insights stay accurate."
      size="lg"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-session-form" disabled={submitting}>
            {submitting ? "Saving..." : "Save session"}
          </Button>
        </>
      }
    >
      <form id="add-session-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Student" htmlFor="studentId" error={errors.studentId}>
            <Select
              id="studentId"
              value={form.studentId}
              onChange={(e) => set("studentId", e.target.value)}
              invalid={!!errors.studentId}
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {fullName(s)} (Grade {s.grade})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date" htmlFor="date" error={errors.date}>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              invalid={!!errors.date}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Subject" htmlFor="subject">
            <Select
              id="subject"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value as Subject)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Skill focus" htmlFor="skillFocus" error={errors.skillFocus}>
            <Input
              id="skillFocus"
              value={form.skillFocus}
              onChange={(e) => set("skillFocus", e.target.value)}
              invalid={!!errors.skillFocus}
              placeholder="e.g. Reading Comprehension"
            />
          </Field>
        </div>

        <Field label="Tutor notes" htmlFor="notes" error={errors.notes}>
          <Textarea
            id="notes"
            rows={4}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            invalid={!!errors.notes}
            placeholder="What did the student do well? Where did they struggle? Be specific."
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Performance score"
            htmlFor="score"
            error={errors.performanceScore}
            hint="0-100"
          >
            <Input
              id="score"
              type="number"
              min={0}
              max={100}
              value={form.performanceScore}
              onChange={(e) => set("performanceScore", e.target.value)}
              invalid={!!errors.performanceScore}
              placeholder="e.g. 70"
            />
          </Field>
          <Field label="Next steps" htmlFor="nextSteps" hint="Optional">
            <Input
              id="nextSteps"
              value={form.nextSteps}
              onChange={(e) => set("nextSteps", e.target.value)}
              placeholder="What to focus on next time"
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
