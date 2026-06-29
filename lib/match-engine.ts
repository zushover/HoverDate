import type { QuestionnaireData } from "./db";
import { parseCsv, jaccardSimilarity, categoricalMatch, areMajorsCompatible } from "./match-utils";

export interface MatchScoreDetail {
  identity: number;
  lifestyle: number;
  interests: number;
  inner: number;
  future: number;
  total: number;
}

export interface MatchPair {
  email_a: string;
  email_b: string;
  score: number;
  score_detail: MatchScoreDetail;
}

function genderFilter(a: QuestionnaireData, b: QuestionnaireData): boolean {
  const aAcceptsB = a.pref_gender === "any" || a.pref_gender === b.user_gender;
  const bAcceptsA = b.pref_gender === "any" || b.pref_gender === a.user_gender;
  return aAcceptsB && bAcceptsA;
}

function scoreIdentity(a: QuestionnaireData, b: QuestionnaireData): number {
  let score = 0;

  const aPrefUniv = parseCsv(a.pref_university);
  const bPrefUniv = parseCsv(b.pref_university);
  if (aPrefUniv.includes(b.user_university || "")) score += 15;
  if (bPrefUniv.includes(a.user_university || "")) score += 15;

  const aPrefCampus = parseCsv(a.pref_campus);
  const bPrefCampus = parseCsv(b.pref_campus);
  if (aPrefCampus.includes(b.user_campus || "")) score += 15;
  if (bPrefCampus.includes(a.user_campus || "")) score += 15;

  if (a.major_category === b.major_category) {
    score += 40;
  } else if (areMajorsCompatible(a.major_category, b.major_category)) {
    score += 20;
  }

  return Math.min(100, score);
}

function scoreLifestyle(a: QuestionnaireData, b: QuestionnaireData): number {
  const cols = [
    { my: a.my_sleep, pref: b.pref_sleep, otherMy: b.my_sleep, otherPref: a.pref_sleep },
    { my: a.my_social, pref: b.pref_social, otherMy: b.my_social, otherPref: a.pref_social },
    { my: a.my_study, pref: b.pref_study, otherMy: b.my_study, otherPref: a.pref_study },
  ];

  let total = 0;
  for (const c of cols) {
    const forward = 100 - Math.abs(c.my - c.pref) * 25;
    const backward = 100 - Math.abs(c.otherMy - c.otherPref) * 25;
    total += (forward + backward) / 2;
  }
  return Math.round(total / cols.length);
}

function scoreInterests(a: QuestionnaireData, b: QuestionnaireData): number {
  const hobbySim = jaccardSimilarity(parseCsv(a.hobbies), parseCsv(b.hobbies));
  const musicSim = jaccardSimilarity(parseCsv(a.music_preference), parseCsv(b.music_preference));
  const videoSim = jaccardSimilarity(parseCsv(a.video_preference), parseCsv(b.video_preference));
  return Math.round(hobbySim * 40 + musicSim * 30 + videoSim * 30);
}

function scoreInner(a: QuestionnaireData, b: QuestionnaireData): number {
  const parts = [
    categoricalMatch(a.life_priority, b.life_priority, 25),
    categoricalMatch(a.spending_style, b.spending_style, 25, {
      orderedValues: ["frugal", "moderate", "enjoy"],
    }),
    categoricalMatch(a.stress_response, b.stress_response, 25),
    categoricalMatch(a.decision_style, b.decision_style, 25),
  ];
  return parts.reduce((s, v) => s + v, 0);
}

function scoreFuture(a: QuestionnaireData, b: QuestionnaireData): number {
  const distanceOk = a.accept_long_distance === "yes" || b.accept_long_distance === "yes";
  return (
    categoricalMatch(a.future_city, b.future_city, 25) +
    categoricalMatch(a.edu_plan, b.edu_plan, 25) +
    categoricalMatch(a.marriage_timeline, b.marriage_timeline, 25) +
    categoricalMatch(a.relationship_pace, b.relationship_pace, 10) +
    (distanceOk ? 15 : 5)
  );
}

export function computeMatchScore(
  a: QuestionnaireData,
  b: QuestionnaireData
): MatchScoreDetail {
  const identity = scoreIdentity(a, b);
  const lifestyle = scoreLifestyle(a, b);
  const interests = scoreInterests(a, b);
  const inner = scoreInner(a, b);
  const future = scoreFuture(a, b);

  const total = Math.round(
    identity * 0.2 + lifestyle * 0.25 + interests * 0.2 + inner * 0.2 + future * 0.15
  );

  return { identity, lifestyle, interests, inner, future, total };
}

const MIN_SCORE = 40;

export function runMatching(responses: QuestionnaireData[]): MatchPair[] {
  const pairs: { a: QuestionnaireData; b: QuestionnaireData; score: MatchScoreDetail }[] = [];

  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      if (!genderFilter(responses[i], responses[j])) continue;
      const detail = computeMatchScore(responses[i], responses[j]);
      if (detail.total < MIN_SCORE) continue;
      pairs.push({ a: responses[i], b: responses[j], score: detail });
    }
  }

  pairs.sort((x, y) => y.score.total - x.score.total);

  const used = new Set<string>();
  const result: MatchPair[] = [];

  for (const { a, b, score } of pairs) {
    if (used.has(a.email) || used.has(b.email)) continue;
    if (!a.email || !b.email) continue;
    used.add(a.email);
    used.add(b.email);
    result.push({ email_a: a.email, email_b: b.email, score: score.total, score_detail: score });
  }

  return result;
}

export function generateInsight(detail: MatchScoreDetail): string {
  const dims = [
    { key: "identity", label: "基础画像", score: detail.identity },
    { key: "lifestyle", label: "生活共振", score: detail.lifestyle },
    { key: "interests", label: "兴趣图谱", score: detail.interests },
    { key: "inner", label: "内心世界", score: detail.inner },
    { key: "future", label: "未来拼图", score: detail.future },
  ];
  dims.sort((a, b) => b.score - a.score);

  const templates: Record<string, string> = {
    identity: "你们的校园生活和日常圈层有大量交集，基础画像匹配度很高",
    lifestyle: "你们在生活节奏上高度同频，作息和社交偏好契合，相处时的摩擦成本很低",
    interests: "你们的兴趣图谱高度重合，有共同的话题和娱乐方式",
    inner: "你们看待世界的方式很相似，在价值观和底层逻辑上非常合拍",
    future: "你们对未来的规划方向一致，这是长期关系的重要基础",
  };

  const top = dims[0];
  return templates[top.key] || "算法在 5 个维度上找到了你们的共鸣点";
}
