"use client";

import { useState, useEffect } from "react";
import Questionnaire from "@/components/Questionnaire";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";

const FAQ_ITEMS = [
  { q: "为什么只支持 .edu.cn 邮箱？", a: "为了确保圈子真实、安全。我们仅限高校学生，避免校外人员和虚假身份混入。" },
  { q: "匹配逻辑是什么？", a: "基于你填写的 5 维灵魂问卷——从基础画像、生活共振、内心世界、关系模式到未来拼图，算法计算频率共振值，每周二晚 9:00 为你推送最契合的那个人。" },
  { q: "每周只能匹配一个人吗？", a: "是的。拒绝社交内耗，不让你陷入「刷人」的焦虑。每周认真对待一个结果，是对自己和对方的尊重。" },
  { q: "填写问卷需要多长时间？", a: "大约 5-8 分钟。问卷包含 5 个维度的深度问题，建议在安静的环境下认真填写——你的答案越真实，匹配越准确。" },
  { q: "可以修改已提交的答案吗？", a: "每周二晚 8:00 之前可以重新填写，之前的数据会被覆盖。之后将锁定至本周匹配完成。" },
];

export default function BJFUPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const nextTue = new Date(now);
      nextTue.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
      nextTue.setHours(21, 0, 0, 0);
      const diff = nextTue.getTime() - now.getTime();
      setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), mins: Math.floor((diff % 3600000) / 60000) });
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setEmailError("");
    if (!email.trim()) { setEmailError("请输入你的校园邮箱"); return; }
    if (!email.endsWith(".edu.cn") && !email.endsWith("test.edu.cn")) { setEmailError("请使用有效的 .edu.cn 校园邮箱"); return; }
    setShowWelcome(true);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  } as const;

  return (
    <PageShell backgroundImage backgroundSrc="/bjfu_background.jpg" imageOpacity={0.15} className="flex flex-col items-center justify-start text-[#f0ebe4]">

      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center pt-20">
        <AnimatePresence mode="wait">
          {!showQuestionnaire && !showWelcome ? (
            <motion.div key="hero" exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }} className="w-full flex flex-col items-center">
              <section className="min-h-screen flex flex-col items-center justify-center gap-8 md:gap-12 p-6 pt-16 pb-12">
                <div className="space-y-8 max-w-2xl">
                  <motion.div variants={fadeUp} initial="hidden" animate="show" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.10] border border-white/[0.15] backdrop-blur-lg shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 font-semibold">北京林业大学 · 独立专属站</span>
                  </motion.div>

                  <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="relative space-y-2">
                    <div className="text-lg text-zinc-400 font-light tracking-wider">北京林业大学</div>
                    <div className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter select-none leading-[0.85]">
                      <span className="bg-gradient-to-b from-white via-white to-zinc-200 bg-clip-text text-transparent">Hover</span>{" "}
                      <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">DATE</span>
                    </div>
                  </motion.h1>

                  <motion.p variants={fadeUp} initial="hidden" animate="show" className="text-lg md:text-xl text-zinc-300/80 font-light tracking-wider leading-relaxed font-serif-cn">
                    每周二晚 <span className="text-white font-semibold">9:00</span>，遇见频率相同的人
                  </motion.p>

                  <motion.div variants={fadeUp} initial="hidden" animate="show" className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.10] border border-white/[0.15] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                    <svg className="w-3.5 h-3.5 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-xs text-zinc-400 uppercase tracking-[0.2em] font-medium">下次匹配倒计时</span>
                    <span className="h-3 w-px bg-white/[0.1]" />
                    <span className="text-xs font-mono text-emerald-300 tabular-nums">{countdown.days}<span className="text-zinc-500 mx-0.5">d</span>{countdown.hours}<span className="text-zinc-500 mx-0.5">h</span>{countdown.mins}<span className="text-zinc-500 ml-0.5">m</span></span>
                  </motion.div>

                  <motion.div variants={fadeUp} initial="hidden" animate="show" className="w-full max-w-md mx-auto space-y-3 pt-4">
                    <div className="relative">
                      <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      <input id="email" type="email" value={email}
                        onChange={(e) => { setEmail(e.target.value.trim()); setEmailError(""); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
                        placeholder="输入你的 bjfu.edu.cn 校园邮箱"
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border text-base transition-all duration-300 focus:outline-none placeholder:text-zinc-400 ${emailError ? "border-red-400/40" : "border-white/[0.18] focus:border-emerald-400/60 hover:border-white/[0.25]"}`}
                      />
                    </div>
                    <AnimatePresence>{emailError && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-xs text-red-400 font-light text-left pl-2">{emailError}</motion.p>}</AnimatePresence>
                    <button onClick={handleStart} className="group relative w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold text-lg active:scale-[0.98] transition-all duration-300 overflow-hidden shadow-[0_4px_32px_rgba(52,211,153,0.4)] hover:shadow-[0_8px_48px_rgba(52,211,153,0.55)]">
                      <span className="relative z-10 flex items-center justify-center gap-2">开始灵魂测试<svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    </button>
                  </motion.div>
                </div>
              </section>

              <section className="w-full py-14 md:py-20 px-4 sm:px-6 border-t border-white/[0.06]">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">欢迎 <span className="text-emerald-400 font-serif-cn">BJFUer</span></h2>
                  <p className="text-zinc-400 text-sm font-light">仅限 @bjfu.edu.cn 邮箱认证 · 北林专属匹配池</p>
                </div>
              </section>

              <section className="w-full py-14 md:py-20 px-4 sm:px-6 border-t border-white/[0.06]">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="space-y-3 text-center"><h2 className="text-3xl font-bold tracking-tight">常见问题</h2></div>
                  <div className="space-y-3 text-left">
                    {FAQ_ITEMS.map((item, i) => (
                      <div key={i} className="rounded-2xl bg-white/[0.08] border border-white/[0.12] overflow-hidden transition-all duration-300 hover:border-white/[0.18]">
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors">
                          <span className="text-sm font-medium text-zinc-200 pr-4">{item.q}</span>
                          <svg className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </button>
                        <div className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed font-light">{item.a}</p></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <footer className="w-full py-12 px-6 border-t border-white/[0.06]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400 tracking-wider">
                  <div className="flex items-center gap-6"><span>Hover DATE · 北京林业大学（独立站）</span><span className="text-zinc-600">|</span><span>© 2026 Hover DATE</span></div>
                  <div className="flex items-center gap-6">
                    <a href="/privacy" className="hover:text-zinc-200 transition-colors">隐私政策</a>
                    <a href="/terms" className="hover:text-zinc-200 transition-colors">服务条款</a>
                    <a href="/about" className="hover:text-zinc-200 transition-colors">关于我们</a>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : showWelcome ? (
            <motion.div key="welcome" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -12 }} className="min-h-screen flex flex-col items-center justify-center p-6">
              <div className="bg-white/[0.06] backdrop-blur-3xl border border-white/[0.15] rounded-[2rem] p-10 sm:p-14 max-w-lg w-full text-center space-y-8 shadow-[0_8px_60px_rgba(0,0,0,0.5)]">
                <div className="text-5xl">✨</div>
                <div className="space-y-3"><h2 className="text-2xl font-bold">准备好开始灵魂测试了吗？</h2><p className="text-zinc-400 text-sm font-light leading-relaxed">接下来是 5 个维度的深度问卷——从内心世界到未来规划。没有标准答案，只有真实的你。</p></div>
                <div className="space-y-2 text-left max-w-xs mx-auto">
                  {["5 个维度 · 22+ 道题目", "大约需要 5-8 分钟", "答案自动保存，随时继续"].map((t, i) => (<div key={i} className="flex items-center gap-3 text-sm text-zinc-400"><svg className="w-4 h-4 text-emerald-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{t}</div>))}
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setShowWelcome(false); setShowQuestionnaire(false); }} className="px-6 py-3 rounded-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors">下次再说</button>
                  <button onClick={() => { setShowWelcome(false); setShowQuestionnaire(true); }} className="px-8 py-3 rounded-full bg-white text-black font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.12)]">开始 →</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="q" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl p-6 pt-20">
              <button onClick={() => setShowQuestionnaire(false)} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>返回首页</button>
              <Questionnaire userEmail={email} onBack={() => setShowQuestionnaire(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
