import { NextRequest, NextResponse } from "next/server";
import { getMatchById, recordMatchAction, getMutualAction, getMatchAction } from "@/lib/db-server";
import { isWithin48Hours } from "@/lib/match-utils";

export async function POST(req: NextRequest) {
  try {
    const { email, matchId, action } = await req.json();

    if (!email || !matchId || !action) {
      return NextResponse.json({ error: "email, matchId, action required" }, { status: 400 });
    }

    if (action !== "connect" && action !== "pass") {
      return NextResponse.json({ error: "action must be connect or pass" }, { status: 400 });
    }

    const match = await getMatchById(Number(matchId));
    if (!match) {
      return NextResponse.json({ error: "match not found" }, { status: 404 });
    }

    if (match.user_email_a !== email && match.user_email_b !== email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    if (!isWithin48Hours(new Date(match.created_at))) {
      return NextResponse.json({ error: "match expired" }, { status: 410 });
    }

    const existing = await getMatchAction(match.id, email);
    if (existing) {
      return NextResponse.json({ error: "already acted" }, { status: 409 });
    }

    await recordMatchAction(match.id, email, action);

    let mutual = false;
    if (action === "connect") {
      mutual = await getMutualAction(match.id);
    }

    return NextResponse.json({ success: true, mutual });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
