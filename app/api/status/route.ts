import { NextRequest, NextResponse } from "next/server";
import { getSubmissionByEmail, getMatchForUser } from "@/lib/db-server";
import { getWeekStart, isAfterDropTime, getNextDropTime } from "@/lib/match-utils";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    const submission = await getSubmissionByEmail(email);
    if (!submission) {
      return NextResponse.json({ status: "not_found" });
    }

    const weekStart = getWeekStart();

    if (!isAfterDropTime()) {
      return NextResponse.json({
        status: "submitted",
        nextDrop: getNextDropTime(),
      });
    }

    const match = await getMatchForUser(email, weekStart);
    if (!match) {
      return NextResponse.json({
        status: "submitted",
        message: "算法正在为你计算最佳匹配",
        nextDrop: getNextDropTime(),
      });
    }

    return NextResponse.json({
      status: "matched",
      matchId: String(match.id),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
