import { NextResponse } from "next/server";
import { analyzeNote, type GapAnalysisInput } from "@/lib/ai";

/**
 * POST /api/analyze
 * Body: { note: string, studentName?: string, subject?: string }
 *
 * Returns a structured learning-gap analysis. Currently powered by the mock
 * engine in `lib/ai.ts`. To go live, swap `analyzeNote(...)` for an OpenAI
 * chat completion using GAP_ANALYSIS_SYSTEM_PROMPT and parse the JSON result.
 */
export async function POST(request: Request) {
  let body: GapAnalysisInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.note || !body.note.trim()) {
    return NextResponse.json({ error: "A tutor note is required." }, { status: 400 });
  }

  // Simulate model latency so loading states are visible in the demo.
  await new Promise((r) => setTimeout(r, 900));

  const result = analyzeNote(body);
  return NextResponse.json({ result, mocked: !process.env.OPENAI_API_KEY });
}
