import { notFound } from "next/navigation";
import {
  students,
  studentsById,
  currentUser,
  getStudentSkills,
  getStudentSessions,
  getStudentGoals,
  getStudentOverview,
  getStudentGapAnalysis,
  getStudentPracticePlanOrGenerate,
  getStudentSummary,
} from "@/data";
import { StudentProfileView } from "@/components/students/StudentProfileView";

export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = studentsById[params.id];
  if (!student) notFound();

  const skills = getStudentSkills(student.id).map((s) => ({
    name: s.skill?.name ?? "Skill",
    mastery: s.mastery,
    previousMastery: s.previousMastery,
  }));

  return (
    <StudentProfileView
      student={student}
      skills={skills}
      sessions={getStudentSessions(student.id)}
      goals={getStudentGoals(student.id)}
      overview={getStudentOverview(student.id)}
      gap={getStudentGapAnalysis(student.id)}
      plan={getStudentPracticePlanOrGenerate(student.id)}
      summary={getStudentSummary(student.id)}
      tutorName={currentUser.name}
    />
  );
}
