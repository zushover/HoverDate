"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";

interface MatchResult {
  status: string;
  matchId: string;
  score: number;
  dimensions: {
    identity: number;
    lifestyle: number;
    interests: number;
    inner: number;
    future: number;
  };
  myAction: string | null;
  partnerEmail: string | null;
}

function getNextTuesday(): string {
  const now = new Date();
  const nextTue = new Date(now);
  nextTue.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
  return `${nextTue.getFullYear()}.${String(nextTue.getMonth() + 1).padStart(2, "0")}.${String(nextTue.getDate()).padStart(2, "0")}`;
}

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20, duration: duration * 1000 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

const DIMENSION_META = [
  { label: "基础画像", key: "identity" },
  { label: "生活共振", key: "lifestyle" },
  { label: "兴趣图谱", key: "interests" },
  { label: "内心世界", key: "inner" },
  { label: "未来拼图", key: "future" },
] as const;

const INSIGHT_MAP: Record<string, string> = {
  identity: "你们的校园生活和日常圈层有大量交集，基础画像匹配度很高",
  lifestyle: "你们在生活节奏上高度同频，作息和社交偏好契合，相处时的摩擦成本很低",
  interests: "你们的兴趣图谱高度重合，有共同的话题和娱乐方式",
  inner: "你们看待世界的方式很相似，在价值观和底层逻辑上非常合拍",
  future: "你们对未来的规划方向一致，这是长期关系的重要基础",
};

function ResultContent() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || (typeof window !== "undefined" ? localStorage.getItem("hoverdate_email") : null);

  const [revealed, setRevealed] = useState(false);
  const [tearing, setTearing] = useState(false);
  const [action, setAction] = useState<"none" | "connect" | "pass">("none");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchData, setMatchData] = useState<MatchResult | null>(null);
  const [mutual, setMutual] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTuesday = getNextTuesday();

  const fetchMatch = useCallback(async () => {
    if (!emailFromQuery) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/match?email=${encodeURIComponent(emailFromQuery)}`);
      const json = await res.json();
      if (json.status === "ok") {
        setMatchData(json);
        if (json.myAction === "connect") setAction("connect");
        else if (json.myAction === "pass") setAction("pass");
        if (json.partnerEmail) setMutual(true);
      } else if (json.status === "not_yet" || json.status === "not_matched") {
        setError("匹配结果尚未生成，请周二晚 9:00 后查看");
      } else {
        setError("未找到匹配结果");
      }
    } catch {
      setError("获取匹配结果失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [emailFromQuery]);

  useEffect(() => {
    if (revealed) fetchMatch();
  }, [revealed, fetchMatch]);

  const handleReveal = () => {
    setTearing(true);
    setTimeout(() => setRevealed(true), 600);
  };

  const handleAction = async (act: "connect" | "pass") => {
    if (!matchData || action !== "none") return;
    setAction(act);
    try {
      const res = await fetch("/api/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailFromQuery,
          matchId: matchData.matchId,
          action: act,
        }),
      });
      const json = await res.json();
      if (json.mutual) setMutual(true);
      if (act === "connect") {
        localStorage.setItem("hoverdate_matched", "true");
      }
    } catch {
      setAction("none");
    }
  };

  const dimensions = matchData
    ? DIMENSION_META.map((m) => ({ label: m.label, score: matchData.dimensions[m.key], key: m.key }))
    : [];

  const topDim = dimensions.length > 0
    ? dimensions.sort((a, b) => b.score - a.score)[0]
    : null;
  const insightText = topDim
    ? (INSIGHT_MAP[topDim.key] || "算法在 5 个维度上找到了你们的共鸣点")
    : "";

  return (
    <PageShell ambientOrbs orbIntensity="light">
      <div className="z-10 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-20 pb-16">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="reveal"
              exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)", transition: { duration: 0.4 } }}
              className="min-h-[85vh] flex flex-col items-center justify-center text-center"
            >
              {/* Envelope */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <motion.div
                  animate={tearing ? { scale: 1.05, opacity: 0, filter: "blur(8px)" } : {}}
                  transition={{ duration: 0.5 }}
                  className="relative w-40 h-32 sm:w-48 sm:h-36 mx-auto"
                >
                  {/* Envelope body */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.12] backdrop-blur-sm" />
                  {/* Envelope flap */}
                  <div
                    className="absolute top-0 left-0 right-0 h-3/5 rounded-t-2xl bg-gradient-to-b from-white/[0.10] to-white/[0.04] border-b border-white/[0.08]"
                    style={{
                      clipPath: "polygon(0 0, 50% 70%, 100% 0)",
                    }}
                  />
                  {/* Wax seal */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_24px_rgba(251,113,133,0.4)] flex items-center justify-center"
                    animate={{ boxShadow: ["0 0 16px rgba(251,113,133,0.3)", "0 0 32px rgba(251,113,133,0.6)", "0 0 16px rgba(251,113,133,0.3)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-white font-black text-xs">H</span>
                  </motion.div>
                  {/* Float animation wrapper */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 space-y-3"
              >
                <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                  {nextTuesday} · 周二掉落
                </p>
                <h2 className="text-2xl font-light text-zinc-400 font-serif-cn">
                  你的匹配信已准备就绪
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8"
              >
                <button
                  onClick={handleReveal}
                  disabled={tearing}
                  className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-lg hover:opacity-90 active:scale-[0.97] transition-all shadow-[0_0_40px_rgba(251,113,133,0.3)] hover:shadow-[0_0_60px_rgba(251,113,133,0.5)] disabled:opacity-50 disabled:cursor-default overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {tearing ? "拆封中…" : "拆开信封"}
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-6 text-xs text-zinc-600 font-light"
              >
                数据仅你可见 · 48 小时后失效
              </motion.p>
            </motion.div>
          ) : (
            /* ── Revealed detail ── */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-12"
            >
              {loading && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center gap-2 text-zinc-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
                    </span>
                    加载匹配结果中…
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center py-20 space-y-4">
                  <p className="text-zinc-400 text-sm">{error}</p>
                  <button onClick={fetchMatch} className="text-rose-400 text-sm underline underline-offset-4 hover:text-rose-300 transition-colors">
                    重新加载
                  </button>
                </div>
              )}

              {!loading && !error && matchData && (
              <>
              <div className="text-center space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">本周匹配报告</p>
                <h2 className="text-3xl font-black tracking-tight">你们的频率共振</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
                <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                  <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth="2.5" />
                    <motion.circle
                      cx="50" cy="50" r="44"
                      fill="none"
                      stroke="url(#ringGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 44 * ((matchData?.score || 0) / 100)} ${2 * Math.PI * 44 * (1 - (matchData?.score || 0) / 100)}`}
                      strokeDashoffset={0}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      style={{ rotate: -90 }}
                    />
                    <defs>
                      <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgb(251 113 133)" />
                        <stop offset="100%" stopColor="rgb(244 114 182)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <motion.span
                      className="text-5xl font-black tabular-nums"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <AnimatedNumber value={matchData?.score || 0} />
                    </motion.span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">综合共振</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  {dimensions.map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-16 text-xs text-zinc-500 text-right font-light flex-shrink-0">{d.label}</span>
                      <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ delay: 0.6 + i * 0.12, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full shadow-[0_0_6px_rgba(251,113,133,0.25)]"
                        />
                      </div>
                      <motion.span
                        className="w-8 text-xs text-rose-300 font-mono tabular-nums text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.12 }}
                      >
                        {d.score}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center max-w-md mx-auto"
              >
                <p className="text-sm text-zinc-400 font-serif-cn leading-relaxed italic">
                  “{insightText}”
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center"
              >
                <p className="text-[11px] text-zinc-600">
                  此结果将在 48 小时后失效 · 届时新一周匹配开始
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center space-y-4 pt-2"
              >
                <p className="text-sm text-zinc-400 font-light">
                  匹配结果已发送至你的校园邮箱，48 小时内可选择是否建立联系。
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleAction("pass")}
                    disabled={action !== "none"}
                    className={`px-6 py-3 rounded-xl text-sm transition-all active:scale-[0.97] ${
                      action === "pass"
                        ? "text-zinc-600 cursor-default"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    {action === "pass" ? "已跳过，等待下周" : "下次再说"}
                  </button>
                  <button
                    onClick={() => handleAction("connect")}
                    disabled={action !== "none"}
                    className={`group px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] ${
                      action === "connect"
                        ? "bg-rose-400/20 border border-rose-400/30 text-rose-200 cursor-default"
                        : "bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:shadow-[0_0_40px_rgba(251,113,133,0.45)] shadow-[0_0_20px_rgba(251,113,133,0.25)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {action === "connect" ? (mutual ? "双方已连接" : "请求已发送") : "建立联系"}
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
                {mutual && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-rose-300 font-light"
                  >
                    你们已经建立联系！请查看校园邮箱获取对方联系方式。
                  </motion.p>
                )}
              </motion.div>

              <div
                className="flex justify-center mt-4"
                onMouseDown={() => {
                  holdTimer.current = setTimeout(() => setShowEasterEgg(true), 3000);
                }}
                onMouseUp={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
                onMouseLeave={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
                onTouchStart={() => {
                  holdTimer.current = setTimeout(() => setShowEasterEgg(true), 3000);
                }}
                onTouchEnd={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
              >
                <AnimatePresence>
                  {showEasterEgg && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-xs text-rose-300/40 font-serif-cn italic tracking-wider"
                      onAnimationComplete={() => {
                        setTimeout(() => setShowEasterEgg(false), 4000);
                      }}
                    >
                      算法算了 32768 种可能，选择了你们
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href="/"
          className="fixed top-6 left-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors z-20"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </a>
      </div>
    </PageShell>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">加载中…</div>}>
      <ResultContent />
    </Suspense>
  );
}
