import { NextRequest, NextResponse } from "next/server";
import { insertSchoolRequest } from "@/lib/db-server";

export async function POST(req: NextRequest) {
  try {
    const { schoolName, email } = await req.json();

    if (!schoolName || typeof schoolName !== "string" || !schoolName.trim()) {
      return NextResponse.json({ error: "schoolName required" }, { status: 400 });
    }

    await insertSchoolRequest(schoolName.trim(), email?.trim() || undefined);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
