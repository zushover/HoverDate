export function parseCsv(val: string | null | undefined): string[] {
  if (!val) return [];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0.5;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export function categoricalMatch(
  a: string | null | undefined,
  b: string | null | undefined,
  maxPoints: number,
  options?: { orderedValues?: string[] }
): number {
  if (!a || !b) return Math.floor(maxPoints * 0.3);
  if (a === b) return maxPoints;

  if (options?.orderedValues) {
    const idxA = options.orderedValues.indexOf(a);
    const idxB = options.orderedValues.indexOf(b);
    if (idxA >= 0 && idxB >= 0 && Math.abs(idxA - idxB) === 1) {
      return Math.floor(maxPoints * 0.6);
    }
  }
  return Math.floor(maxPoints * 0.15);
}

const MAJOR_GROUPS: Record<string, string> = {
  engineering: "stem",
  science: "stem",
  medicine: "stem",
  agriculture: "stem",
  arts: "humanities",
  business: "social",
  art_sports: "humanities",
  other: "other",
};

export function areMajorsCompatible(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const ga = MAJOR_GROUPS[a];
  const gb = MAJOR_GROUPS[b];
  return ga === gb && ga !== "other";
}

export function getWeekStart(date?: Date): string {
  const d = date || new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.getFullYear(), d.getMonth(), diff);
  return mon.toISOString().slice(0, 10);
}

export function isAfterDropTime(): boolean {
  if (process.env.DEV_MODE === "true") return true;
  const now = new Date();
  if (now.getDay() !== 2) return false;
  return now.getHours() >= 21;
}

export function getNextDropTime(): string {
  const now = new Date();
  const nextTue = new Date(now);
  nextTue.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
  nextTue.setHours(21, 0, 0, 0);
  return nextTue.toISOString();
}

export function isWithin48Hours(since: Date): boolean {
  return Date.now() - since.getTime() < 48 * 60 * 60 * 1000;
}
