"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubmissionByEmail } from "@/lib/db";
import Link from "next/link";
import PageShell from "@/components/PageShell";

function getCountdownParts() {
  const now = new Date();
  const nextTue = new Date(now);
  nextTue.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
  nextTue.setHours(21, 0, 0, 0);
  const total = nextTue.getTime() - now.getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const progress = Math.max(0, Math.min(1, 1 - total / weekMs));
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  return { d, h, m, progress };
}

function getCanResubmit(): boolean {
  const now = new Date();
  if (now.getDay() === 2 && now.getHours() >= 20) return false;
  return true;
}

type Status = "idle" | "not_found" | "submitted" | "error";

function CountdownRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth="3" />
        <motion.circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="url(#countdownGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="countdownGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(251 113 133)" />
            <stop offset="100%" stopColor="rgb(244 114 182)" />
          </linearGradient>
        </defs>
        {/* Week markers */}
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const angle = (day / 7) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 35 * Math.cos(rad);
          const cy = 50 + 35 * Math.sin(rad);
          const today = new Date().getDay();
          const adjusted = today === 0 ? 6 : today - 1;
          const isToday = adjusted === day;
          return (
            <circle
              key={day}
              cx={cx}
              cy={cy}
              r={isToday ? 2.5 : 1.5}
              fill={isToday ? "rgb(251 113 133)" : "rgb(255 255 255 / 0.1)"}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(getCountdownParts);

  useEffect(() => {
    const saved = localStorage.getItem("hoverdate_email");
    if (saved) setEmail(saved);
    const timer = setInterval(() => setCountdown(getCountdownParts()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCheck = async () => {
    if (!email.trim() || (!email.endsWith(".edu.cn") && !email.endsWith("test.edu.cn"))) {
      setErrorMsg("请输入有效的 .edu.cn 校园邮箱");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setStatus("idle");

    try {
      const row = await getSubmissionByEmail(email.trim());

      if (!row) {
        setStatus("not_found");
      } else {
        setStatus("submitted");
        localStorage.setItem("hoverdate_email", email.trim());
        localStorage.setItem("hoverdate_submitted", "true");
      }
    } catch {
      setErrorMsg("查询失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <PageShell ambientOrbs orbIntensity="light">
      <div className="z-10 w-full max-w-lg mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">我的匹配状态</h1>
          <p className="text-zinc-400 text-sm font-light">输入你的校园邮箱，查看匹配进度</p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value.trim()); setErrorMsg(""); setStatus("idle"); }}
            onKeyDown={handleKeyDown}
            placeholder="输入你的 .edu.cn 校园邮箱"
            className="w-full px-5 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] text-base transition-all duration-300 focus:outline-none focus:border-rose-400/60 focus:ring-4 focus:ring-rose-400/10 hover:border-white/[0.20] placeholder:text-zinc-500 text-white"
          />
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs text-red-400 font-light pl-2"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-lg active:scale-[0.97] transition-all duration-300 shadow-[0_4px_32px_rgba(251,113,133,0.35)] hover:shadow-[0_8px_48px_rgba(251,113,133,0.5)] disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? "查询中…" : "查看状态"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === "not_found" && (
            <motion.div
              key="nf"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.10] rounded-2xl p-10 text-center space-y-6"
            >
              {/* Empty envelope illustration */}
              <div className="relative w-24 h-20 mx-auto">
                <div className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/[0.08]" />
                <div
                  className="absolute top-0 left-0 right-0 h-3/5 rounded-t-xl bg-white/[0.06] border-b border-white/[0.06]"
                  style={{ clipPath: "polygon(0 0, 50% 60%, 100% 0)" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-700 text-lg">
                  ?
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">还没有你的匹配信</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs mx-auto">
                  该邮箱尚未提交过灵魂问卷。填写后，每周二晚 9:00 准时送达你的匹配结果。
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-sm hover:opacity-90 active:scale-[0.97] transition-all shadow-[0_0_20px_rgba(251,113,133,0.25)]"
              >
                开始填写问卷
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          )}

          {status === "submitted" && (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.10] rounded-2xl p-8 space-y-8"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-400/[0.08] border border-rose-400/[0.20]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
                  </span>
                  <span className="text-xs text-rose-300 font-medium tracking-wide">已提交 · 等待周二掉落</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">提交邮箱</p>
                  <p className="text-base font-semibold text-white font-mono">{email}</p>
                </div>

                {/* Countdown ring */}
                <CountdownRing progress={countdown.progress} />
                <div className="text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-1">距离下次掉落</p>
                  <p className="text-2xl font-mono font-bold text-white tabular-nums tracking-tight">
                    {countdown.d}<span className="text-sm text-zinc-500 mx-1">天</span>
                    {countdown.h}<span className="text-sm text-zinc-500 mx-1">时</span>
                    {countdown.m}<span className="text-sm text-zinc-500 mx-1">分</span>
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
                <p className="text-sm text-zinc-300 font-light">算法正在为你计算最佳匹配</p>
                <p className="text-xs text-zinc-500">匹配结果将在周二晚 9:00 后在此显示</p>
              </div>

              {getCanResubmit() && (
                <Link
                  href={`/?resubmit=${encodeURIComponent(email)}`}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-rose-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  <span className="text-sm text-zinc-400 group-hover:text-rose-400 transition-colors">
                    修改答案（周二晚 8:00 前可修改）
                  </span>
                  <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
