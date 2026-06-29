"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getResponseCount } from "@/lib/db";
import PageShell from "@/components/PageShell";

const FAQ_ITEMS = [
  {
    q: "为什么只支持 .edu.cn 邮箱？",
    a: "为了确保圈子真实、安全。我们仅限兰州本地高校学生，避免校外人员和虚假身份混入。",
  },
  {
    q: "匹配逻辑是什么？",
    a: "基于你填写的 5 维灵魂问卷——从基础画像、生活共振、内心世界、关系模式到未来拼图，算法计算频率共振值，每周二晚 9:00 为你推送最契合的那个人。",
  },
  {
    q: "每周只能匹配一个人吗？",
    a: "是的。拒绝社交内耗，不让你陷入「刷人」的焦虑。每周认真对待一个结果，是对自己和对方的尊重。",
  },
  {
    q: "不喜欢我的匹配怎么办？",
    a: "没关系，新的一周会有新的可能。你也可以填写反馈帮助算法优化。我们相信，真正合适的人值得等待。",
  },
  {
    q: "填写问卷需要多长时间？",
    a: "大约 5-8 分钟。问卷包含 5 个维度的深度问题，建议在安静的环境下认真填写——你的答案越真实，匹配越准确。",
  },
  {
    q: "可以修改已提交的答案吗？",
    a: "每周二晚 8:00 之前可以重新填写，之前的数据会被覆盖。之后将锁定至本周匹配完成。",
  },
  {
    q: "对方会看到我的个人信息吗？",
    a: "不会。匹配成功后仅通过邮箱建立联系，不会公开你的姓名、照片或答卷内容。你可以自行决定分享什么。",
  },
  {
    q: "信息会被泄露吗？",
    a: "你的隐私是我们的底线。所有数据仅用于匹配计算，不会公开或出售。匹配结果仅通过邮箱告知，不公开个人资料。",
  },
];

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [userCount, setUserCount] = useState(1280);

  useEffect(() => {
    getResponseCount().then((c) => { if (c > 0) setUserCount(c + 1200); });
  }, []);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const nextTue = new Date(now);
      const dayDiff = (2 + 7 - now.getDay()) % 7 || 7;
      nextTue.setDate(now.getDate() + dayDiff);
      nextTue.setHours(21, 0, 0, 0);

      if (dayDiff === 7 && now.getDay() === 2) {
        const endOfDrop = new Date(nextTue);
        endOfDrop.setHours(23, 59, 59, 0);
        if (now < endOfDrop) {
          setCountdown({ days: -1, hours: 0, mins: 0 });
          return;
        }
      }

      const diff = nextTue.getTime() - now.getTime();
      if (diff <= 0) {
        nextTue.setDate(nextTue.getDate() + 7);
        const newDiff = nextTue.getTime() - now.getTime();
        setCountdown({
          days: Math.floor(newDiff / 86400000),
          hours: Math.floor((newDiff % 86400000) / 3600000),
          mins: Math.floor((newDiff % 3600000) / 60000),
        });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setEmailError("");
    if (!email.trim()) {
      setEmailError("请输入你的校园邮箱");
      return;
    }
    if (!email.endsWith(".edu.cn") && !email.endsWith("test.edu.cn")) {
      setEmailError("请使用有效的 .edu.cn 校园邮箱");
      return;
    }
    localStorage.setItem("hoverdate_email", email.trim());
    router.push(`/questionnaire?email=${encodeURIComponent(email.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleStart();
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  } as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  } as const;

  return (
    <PageShell backgroundImage imageOpacity={0.15} className="flex flex-col items-center justify-start text-[#f0ebe4]">

      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center">

              {/* ═══════ HERO ═══════ */}
              <section className="relative min-h-screen flex flex-col items-center justify-center gap-10 md:gap-16 p-6 pt-20 pb-16 overflow-hidden">
                <motion.div
                  variants={container}
                  animate="show"
                  className="space-y-10 max-w-2xl"
                >
                  <motion.div
                    variants={fadeUp}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.10] border border-white/[0.15] backdrop-blur-lg shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-400" />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 font-semibold">
                      兰州高校联盟 · 专属匹配
                    </span>
                  </motion.div>

                  <motion.h1 variants={fadeUp} className="relative text-center">
                    <div className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter select-none leading-[0.85]">
                      <span className="bg-gradient-to-b from-white via-white to-zinc-200 bg-clip-text text-transparent">
                        Hover<br/>
                      </span>
                      <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 bg-clip-text text-transparent">
                        DATE
                      </span>
                    </div>
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="text-lg md:text-2xl text-zinc-300/80 font-light tracking-wider leading-relaxed font-serif-cn"
                  >
                    每周二晚 <span className="text-white font-semibold">9:00</span>，遇见频率相同的人
                  </motion.p>

                  <motion.div
                    variants={fadeUp}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.10] border border-white/[0.15] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-zinc-400 uppercase tracking-[0.2em] font-medium">
                      下次匹配倒计时
                    </span>
                    <span className="h-3 w-px bg-white/[0.1]" />
                    {countdown.days === -1 ? (
                      <span className="text-xs font-bold text-rose-300 animate-pulse">
                        匹配掉落中！查看你的邮箱 →
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-rose-300 tabular-nums">
                        {countdown.days}
                        <span className="text-zinc-500 mx-0.5">d</span>
                        {countdown.hours}
                        <span className="text-zinc-500 mx-0.5">h</span>
                        {countdown.mins}
                        <span className="text-zinc-500 ml-0.5">m</span>
                      </span>
                    )}
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
                    <div className="flex -space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-zinc-800 bg-zinc-700/60" style={{ zIndex: 3 - i }} />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400 tracking-wider">
                      已有 <span className="text-zinc-300 font-bold">{userCount.toLocaleString()}</span> 位同学认证
                    </span>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    variants={fadeUp}
                    className="w-full max-w-md mx-auto space-y-3 pt-4"
                  >
                    <div className="relative">
                      <svg
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value.trim()); setEmailError(""); }}
                        onKeyDown={handleKeyDown}
                        placeholder="输入你的 .edu.cn 校园邮箱"
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border text-base transition-all duration-300 focus:outline-none placeholder:text-zinc-400 ${
                          emailError
                            ? "border-red-400/40"
                            : "border-white/[0.18] focus:border-rose-400/60 hover:border-white/[0.25]"
                        }`}
                      />
                    </div>
                    <AnimatePresence>
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="text-xs text-red-400 font-light text-left pl-2"
                        >
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={handleStart}
                      className="group relative w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-lg active:scale-[0.98] transition-all duration-300 overflow-hidden shadow-[0_4px_32px_rgba(251,113,133,0.4)] hover:shadow-[0_8px_48px_rgba(251,113,133,0.55)]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        开始灵魂测试
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    </button>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="w-full max-w-md mx-auto space-y-2.5 pt-2"
                  >
                    <a href="/lzu" className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-rose-400/[0.06] border border-rose-400/[0.15] hover:bg-rose-400/[0.12] hover:border-rose-400/[0.30] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-400/[0.15] text-[11px] font-bold text-rose-300 tracking-wider mr-3">LZU</span>
                      <span className="text-base font-bold font-serif-cn text-white">兰州大学</span>
                      <span className="ml-2 text-xs text-zinc-400">lzu.edu.cn</span>
                    </a>
                    <a href="/nwnu" className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-rose-400/[0.06] border border-rose-400/[0.15] hover:bg-rose-400/[0.12] hover:border-rose-400/[0.30] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-400/[0.15] text-[11px] font-bold text-rose-300 tracking-wider mr-3">NWNU</span>
                      <span className="text-base font-bold font-serif-cn text-white">西北师范大学</span>
                      <span className="ml-2 text-xs text-zinc-400">nwnu.edu.cn</span>
                    </a>

                    {/* 独立站分隔线 */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-white/[0.04]" />
                      <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 font-medium">独立站点</span>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </div>

                    <a href="/bjfu" className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-emerald-400/[0.04] border border-emerald-400/[0.12] hover:bg-emerald-400/[0.10] hover:border-emerald-400/[0.25] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-400/[0.12] text-[11px] font-bold text-emerald-300 tracking-wider mr-3">BJFU</span>
                      <span className="text-base font-bold font-serif-cn text-white">北京林业大学</span>
                      <span className="ml-2 text-xs text-zinc-400">bjfu.edu.cn</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-400/[0.10] text-emerald-300/70">独立站暂未开放</span>
                    </a>
                  </motion.div>
                </motion.div>
              </section>

              {/* ═══════ HOW IT WORKS ═══════ */}
              <section className="w-full py-14 md:py-20 px-4 sm:px-6 border-t border-white/[0.03]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto space-y-14"
                >
                  <div className="space-y-3 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      三步<span className="text-rose-400 font-serif-cn">遇见</span>
                    </h2>
                    <p className="text-zinc-500 text-sm font-light">没有左滑右滑，只有一次认真的连接</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        step: "01",
                        title: "校园认证",
                        desc: "输入 .edu.cn 邮箱，一秒验证身份。真实校园圈子，没有虚假账号。",
                        highlight: "杜绝假人",
                      },
                      {
                        step: "02",
                        title: "灵魂问卷",
                        desc: "5 个维度、22+ 道深度题目。不只问「你喜欢什么」，更问「你是谁」。",
                        highlight: "深度匹配",
                      },
                      {
                        step: "03",
                        title: "周二 9:00 PM",
                        desc: "每周只推送一个结果。不让你刷人、不让你焦虑，认真对待每一次相遇。",
                        highlight: "拒绝内耗",
                      },
                    ].map((item, i) => (
                      <div key={i} className="group text-center space-y-5 p-8 rounded-2xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500">
                        <div className="text-7xl font-black text-white/[0.06] group-hover:text-white/[0.1] transition-colors duration-500 tracking-tighter">{item.step}</div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          <p className="text-sm text-zinc-400 leading-relaxed font-light">{item.desc}</p>
                          <span className="inline-block px-3 py-1 rounded-full bg-rose-400/[0.12] border border-rose-400/[0.25] text-[11px] text-rose-300 font-medium">
                            {item.highlight}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                      <svg className="w-4 h-4 text-amber-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <span className="text-sm text-zinc-300 font-light">仅限兰州高校</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                      <svg className="w-4 h-4 text-rose-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span className="text-sm text-zinc-300 font-light">每周一个精准匹配</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                      <svg className="w-4 h-4 text-indigo-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-zinc-300 font-light">数据仅用于匹配</span>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* ═══════ FAQ ═══════ */}
              <section className="w-full py-14 md:py-20 px-4 sm:px-6 border-t border-white/[0.03]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-2xl mx-auto space-y-8"
                >
                  <div className="space-y-3 text-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">常见问题</h2>
                    <p className="text-zinc-500 text-sm font-light">你可能想知道的</p>
                  </div>

                  <div className="space-y-3 text-left">
                    {FAQ_ITEMS.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg shadow-[0_4px_16px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors duration-200"
                        >
                          <span className="text-sm font-medium text-zinc-200 pr-4">{item.q}</span>
                          <svg
                            className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                        <div
                          className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-5 pb-5 text-sm text-zinc-500 leading-relaxed font-light">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* ═══════ ORIGIN STORY ═══════ */}
              <section className="w-full py-14 md:py-20 px-4 sm:px-6 border-t border-white/[0.03]">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl mx-auto text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/5 border border-amber-400/10">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300/60 font-semibold">灵感起源</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    源自<span className="text-amber-400">斯坦福</span>，落地<span className="text-rose-400">兰州</span>
                  </h2>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-lg mx-auto">
                    2025 年，斯坦福华裔研究生 Henry Weng 打造了 Date Drop——仅限校园邮箱认证、深度问卷匹配、每周二晚统一「掉落」结果。这个模式覆盖了斯坦福 5000+ 学生，完成 35000+ 次匹配，获 $210 万融资。
                  </p>
                  <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-lg mx-auto">
                    Hover DATE 将这个经过验证的模式带到兰州高校。同样的理念：真实身份、深度匹配、拒绝内耗——为兰州大学生打造的专属社交实验。
                  </p>
                </motion.div>
              </section>

              {/* ═══════ EXPANDING ═══════ */}
              <section className="w-full py-14 md:py-20 px-4 sm:px-6 border-t border-white/[0.03]">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-xl mx-auto text-center space-y-8"
                >
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black tracking-tight">你的学校还没接入？</h2>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed">
                      我们正在逐步覆盖兰州本地高校。如果你的 .edu.cn 邮箱暂时无法使用，
                      留下你的学校名，我们会在下一批开放时第一时间通知你。
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      id="school-name"
                      type="text"
                      placeholder="输入你的学校全名"
                      className="flex-1 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm focus:outline-none focus:border-rose-400/50 placeholder:text-zinc-500 transition-all"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById("school-name") as HTMLInputElement;
                        if (input?.value.trim()) {
                          const schoolName = input.value.trim();
                          input.value = "";
                          input.placeholder = "已收到！我们会尽快处理";
                          setTimeout(() => { input.placeholder = "输入你的学校全名"; }, 3000);
                          try {
                            await fetch("/api/school-request", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ schoolName }),
                            });
                          } catch {}
                        }
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex-shrink-0"
                    >
                      申请接入
                    </button>
                  </div>

                  <p className="text-xs text-zinc-500 tracking-wider">
                    已支持：兰州大学 · 西北师范大学 <br className="sm:hidden" />
                    <span className="hidden sm:inline"> · </span>北京林业大学<span className="text-emerald-300/60">（独立站-暂未开放）</span>
                  </p>
                </motion.div>
              </section>

              {/* ═══════ FOOTER ═══════ */}
              <footer className="w-full py-12 px-6 border-t border-white/[0.03]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-xs text-zinc-400 tracking-wider font-medium">
                    <span>Hover DATE</span>
                    <span className="text-zinc-600">|</span>
                    <span>© 2026 Lanzhou College Alliance</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-zinc-400 tracking-wider font-medium">
                    <a href="/privacy" className="hover:text-zinc-200 transition-colors cursor-pointer">隐私政策</a>
                    <a href="/terms" className="hover:text-zinc-200 transition-colors cursor-pointer">服务条款</a>
                    <a href="/about" className="hover:text-zinc-200 transition-colors cursor-pointer">关于我们</a>
                  </div>
                </div>
              </footer>
      </div>
    </PageShell>
  );
}
