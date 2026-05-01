import { supabase } from "./supabase";

export interface QuestionnaireData {
  email: string;
  intent: string;
  accept_long_distance: string;
  dating_experience?: string;
  target_year?: string;
  my_sleep: number;
  pref_sleep: number;
  my_social: number;
  pref_social: number;
  my_study: number;
  pref_study: number;
  life_priority?: string;
  spending_style?: string;
  stress_response?: string;
  decision_style?: string;
  major_category?: string;
  hobbies?: string;
  music_preference?: string;
  video_preference?: string;
  user_university?: string;
  user_gender?: string;
  pref_gender?: string;
  user_campus?: string;
  pref_university?: string;
  pref_campus?: string;
  pref_dating_experience?: string;
  social_energy?: string;
  love_language?: string;
  conflict_style: string;
  date_frequency?: string;
  future_city?: string;
  edu_plan?: string;
  marriage_timeline?: string;
  relationship_pace?: string;
}

function isTestEmail(email: string): boolean {
  return email.includes("test.edu.cn");
}

const TEST_STORE_KEY = "hoverdate_test_db";

function getTestStore(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(TEST_STORE_KEY) || "{}");
  } catch { return {}; }
}

function setTestStore(store: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEST_STORE_KEY, JSON.stringify(store));
}

export async function submitResponse(data: QuestionnaireData) {
  if (isTestEmail(data.email)) {
    const store = getTestStore();
    store[data.email] = { ...data, created_at: new Date().toISOString() };
    setTestStore(store);
    return true;
  }

  const { error } = await supabase.from("responses").insert({
    email: data.email,
    intent: data.intent,
    accept_long_distance: data.accept_long_distance,
    dating_experience: data.dating_experience || null,
    target_year: data.target_year || null,
    my_sleep: data.my_sleep,
    pref_sleep: data.pref_sleep,
    my_social: data.my_social,
    pref_social: data.pref_social,
    my_study: data.my_study,
    pref_study: data.pref_study,
    life_priority: data.life_priority || null,
    spending_style: data.spending_style || null,
    stress_response: data.stress_response || null,
    decision_style: data.decision_style || null,
    major_category: data.major_category || null,
    hobbies: data.hobbies || null,
    music_preference: data.music_preference || null,
    video_preference: data.video_preference || null,
    user_university: data.user_university || null,
    user_gender: data.user_gender || null,
    pref_gender: data.pref_gender || null,
    user_campus: data.user_campus || null,
    pref_university: data.pref_university || null,
    pref_campus: data.pref_campus || null,
    pref_dating_experience: data.pref_dating_experience || null,
    social_energy: data.social_energy || null,
    love_language: data.love_language || null,
    conflict_style: data.conflict_style,
    date_frequency: data.date_frequency || null,
    future_city: data.future_city || null,
    edu_plan: data.edu_plan || null,
    marriage_timeline: data.marriage_timeline || null,
    relationship_pace: data.relationship_pace || null,
  });

  if (error) throw error;
  return true;
}

export async function getResponseCount(): Promise<number> {
  const { count, error } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count || 0;
}

export async function getSubmissionByEmail(email: string) {
  if (isTestEmail(email)) {
    const store = getTestStore();
    return store[email] || null;
  }

  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
}

export async function updateSubmission(email: string, data: QuestionnaireData) {
  if (isTestEmail(email)) {
    return submitResponse(data);
  }

  const { error } = await supabase
    .from("responses")
    .update({
      intent: data.intent,
      accept_long_distance: data.accept_long_distance,
      dating_experience: data.dating_experience || null,
      target_year: data.target_year || null,
      my_sleep: data.my_sleep,
      pref_sleep: data.pref_sleep,
      my_social: data.my_social,
      pref_social: data.pref_social,
      my_study: data.my_study,
      pref_study: data.pref_study,
      life_priority: data.life_priority || null,
      spending_style: data.spending_style || null,
      stress_response: data.stress_response || null,
      decision_style: data.decision_style || null,
      social_energy: data.social_energy || null,
      love_language: data.love_language || null,
      conflict_style: data.conflict_style,
      date_frequency: data.date_frequency || null,
      future_city: data.future_city || null,
      edu_plan: data.edu_plan || null,
      marriage_timeline: data.marriage_timeline || null,
      relationship_pace: data.relationship_pace || null,
    })
    .eq("email", email);

  if (error) throw error;
  return true;
}
