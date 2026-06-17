import { NextResponse } from "next/server";
import { buildPracticePlan, type PracticePlanInput } from "@/lib/ai";

/**
 * POST /api/practice-plan
 * Body: { skillFocus: string, studentName?: string, notes?: string }
 *
 * Returns a structured 5-part practice plan. Mocked via `lib/ai.ts`; swap for
 * an OpenAI call to make it fully generative.
 */
export async function POST(request: Request) {
  let body: PracticePlanInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.skillFocus || !body.skillFocus.trim()) {
    return NextResponse.json({ error: "A skill focus is required." }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 900));

  const result = buildPracticePlan(body);
  return NextResponse.json({ result, mocked: !process.env.OPENAI_API_KEY });
}
