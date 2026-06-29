import { NextRequest, NextResponse } from "next/server";
import { getSubmissionByEmail, getMatchForUser, getMatchAction, getMutualAction } from "@/lib/db-server";
import { getWeekStart, isAfterDropTime } from "@/lib/match-utils";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    const submission = await getSubmissionByEmail(email);
    if (!submission) {
      return NextResponse.json({ status: "not_found" }, { status: 404 });
    }

    if (!isAfterDropTime()) {
      return NextResponse.json({ status: "not_yet" });
    }

    const weekStart = getWeekStart();
    const match = await getMatchForUser(email, weekStart);

    if (!match) {
      return NextResponse.json({ status: "not_matched" });
    }

    const myAction = await getMatchAction(match.id, email);
    const mutual = myAction === "connect" ? await getMutualAction(match.id) : false;
    const partnerEmail = match.user_email_a === email ? match.user_email_b : match.user_email_a;

    return NextResponse.json({
      status: "ok",
      matchId: String(match.id),
      score: match.score,
      dimensions: {
        identity: match.score_detail.identity,
        lifestyle: match.score_detail.lifestyle,
        interests: match.score_detail.interests,
        inner: match.score_detail.inner,
        future: match.score_detail.future,
      },
      myAction: myAction || null,
      partnerEmail: mutual ? partnerEmail : null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
