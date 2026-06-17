"use client";

import { useState } from "react";
import type { Grade, Student, Subject, SupportLevel } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";

const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];
const LEVELS: SupportLevel[] = ["On Track", "Improving", "Needs Support", "High Priority"];
const GRADES: Grade[] = [1, 2, 3, 4, 5];
const COLORS = ["#3366ff", "#10b981", "#f97316", "#8b5cf6", "#06b6d4", "#ef4444", "#f59e0b"];

interface FormState {
  firstName: string;
  lastName: string;
  grade: string;
  subjectFocus: Subject;
  supportLevel: SupportLevel;
  guardianName: string;
  guardianEmail: string;
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  grade: "",
  subjectFocus: "Reading",
  supportLevel: "On Track",
  guardianName: "",
  guardianEmail: "",
};

export function AddStudentModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (student: Student) => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.grade) next.grade = "Select a grade.";
    if (form.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianEmail)) {
      next.guardianEmail = "Enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate a save round-trip so the UI flow feels real.
    await new Promise((r) => setTimeout(r, 600));

    const student: Student = {
      id: `stu-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      grade: Number(form.grade) as Grade,
      subjectFocus: form.subjectFocus,
      supportLevel: form.supportLevel,
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      strengths: [],
      needsSupport: [],
      averageMastery: 50,
      guardianName: form.guardianName.trim() || "—",
      guardianEmail: form.guardianEmail.trim() || "—",
      enrolledOn: new Date().toISOString().slice(0, 10),
      lastSessionOn: new Date().toISOString().slice(0, 10),
    };

    setSubmitting(false);
    setForm(emptyForm);
    setErrors({});
    onAdd(student);
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add a new student"
      description="Create a student profile. You can add skills and sessions afterward."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="add-student-form" disabled={submitting}>
            {submitting ? "Saving..." : "Add student"}
          </Button>
        </>
      }
    >
      <form id="add-student-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName" error={errors.firstName}>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              invalid={!!errors.firstName}
              placeholder="Angel"
            />
          </Field>
          <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              invalid={!!errors.lastName}
              placeholder="Rivera"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Grade" htmlFor="grade" error={errors.grade}>
            <Select
              id="grade"
              value={form.grade}
              onChange={(e) => set("grade", e.target.value)}
              invalid={!!errors.grade}
            >
              <option value="">Select</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Subject focus" htmlFor="subject">
            <Select
              id="subject"
              value={form.subjectFocus}
              onChange={(e) => set("subjectFocus", e.target.value as Subject)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Support level" htmlFor="level">
            <Select
              id="level"
              value={form.supportLevel}
              onChange={(e) => set("supportLevel", e.target.value as SupportLevel)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Guardian name" htmlFor="guardianName" hint="Optional">
            <Input
              id="guardianName"
              value={form.guardianName}
              onChange={(e) => set("guardianName", e.target.value)}
              placeholder="Maria Rivera"
            />
          </Field>
          <Field
            label="Guardian email"
            htmlFor="guardianEmail"
            error={errors.guardianEmail}
            hint="Optional"
          >
            <Input
              id="guardianEmail"
              type="email"
              value={form.guardianEmail}
              onChange={(e) => set("guardianEmail", e.target.value)}
              invalid={!!errors.guardianEmail}
              placeholder="maria@example.com"
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
