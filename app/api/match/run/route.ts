import { NextRequest, NextResponse } from "next/server";
import { getAllResponses, insertMatches, clearWeekMatches } from "@/lib/db-server";
import { runMatching } from "@/lib/match-engine";
import { getWeekStart } from "@/lib/match-utils";

export async function POST(req: NextRequest) {
  try {
    const isCron = req.headers.get("x-vercel-cron") === "true";
    const querySecret = req.nextUrl.searchParams.get("secret");
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const expected = process.env.MATCH_RUN_SECRET;

    const allowed = isCron || (expected && (querySecret === expected || token === expected));
    if (!allowed) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const weekStart = getWeekStart();

    const responses = await getAllResponses();
    if (responses.length < 2) {
      return NextResponse.json({
        success: true,
        poolSize: responses.length,
        matchCount: 0,
        message: "not enough users",
      });
    }

    const pairs = runMatching(responses);

    await clearWeekMatches(weekStart);

    if (pairs.length > 0) {
      await insertMatches(
        pairs.map((p) => ({
          week_start: weekStart,
          user_email_a: p.email_a,
          user_email_b: p.email_b,
          score: p.score,
          score_detail: p.score_detail as unknown as Record<string, unknown>,
        }))
      );
    }

    const avgScore =
      pairs.length > 0
        ? Math.round(pairs.reduce((s, p) => s + p.score, 0) / pairs.length)
        : 0;

    return NextResponse.json({
      success: true,
      poolSize: responses.length,
      matchCount: pairs.length,
      avgScore,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
