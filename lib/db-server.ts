import { supabase } from "./supabase";
import type { QuestionnaireData } from "./db";

export async function getAllResponses(): Promise<QuestionnaireData[]> {
  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch responses: ${error.message}`);
  return (data || []) as QuestionnaireData[];
}

export async function getSubmissionByEmail(
  email: string
): Promise<QuestionnaireData | null> {
  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return (data as QuestionnaireData) || null;
}

export interface MatchRecord {
  id: number;
  week_start: string;
  user_email_a: string;
  user_email_b: string;
  score: number;
  score_detail: {
    identity: number;
    lifestyle: number;
    interests: number;
    inner: number;
    future: number;
    total: number;
  };
  created_at: string;
}

interface MatchInsert {
  week_start: string;
  user_email_a: string;
  user_email_b: string;
  score: number;
  score_detail: Record<string, unknown>;
}

export async function getMatchForUser(
  email: string,
  weekStart: string
): Promise<MatchRecord | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("week_start", weekStart)
    .or(`user_email_a.eq.${email},user_email_b.eq.${email}`)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return (data as MatchRecord) || null;
}

export async function getMatchById(matchId: number): Promise<MatchRecord | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return (data as MatchRecord) || null;
}

export async function insertMatches(matches: MatchInsert[]): Promise<void> {
  if (matches.length === 0) return;
  const { error } = await supabase.from("matches").insert(matches);
  if (error) throw new Error(`Failed to insert matches: ${error.message}`);
}

export async function clearWeekMatches(weekStart: string): Promise<void> {
  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("week_start", weekStart);
  if (error) throw new Error(`Failed to clear matches: ${error.message}`);
}

export async function recordMatchAction(
  matchId: number,
  email: string,
  action: "connect" | "pass"
): Promise<void> {
  const { error } = await supabase.from("match_actions").insert({
    match_id: matchId,
    email,
    action,
  });
  if (error) throw new Error(`Failed to record action: ${error.message}`);
}

export async function getMatchAction(
  matchId: number,
  email: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("match_actions")
    .select("action")
    .eq("match_id", matchId)
    .eq("email", email)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data?.action || null;
}

export async function getMutualAction(matchId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("match_actions")
    .select("action")
    .eq("match_id", matchId)
    .eq("action", "connect");

  if (error) throw error;
  return (data || []).length >= 2;
}

export async function insertSchoolRequest(
  schoolName: string,
  email?: string
): Promise<void> {
  const { error } = await supabase.from("school_requests").insert({
    school_name: schoolName,
    email: email || null,
  });
  if (error) throw new Error(`Failed to insert school request: ${error.message}`);
}

export async function insertVerificationCode(
  email: string,
  code: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const { error } = await supabase.from("email_verifications").insert({
    email,
    code,
    expires_at: expiresAt,
  });
  if (error) throw new Error(`Failed to insert code: ${error.message}`);
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("email_verifications")
    .select("id")
    .eq("email", email)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", now)
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) return false;

  await supabase
    .from("email_verifications")
    .update({ used: true })
    .eq("id", data[0].id);

  return true;
}
