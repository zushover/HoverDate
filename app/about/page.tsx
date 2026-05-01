"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell ambientOrbs orbIntensity="light">
      <div className="z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              关于<span className="text-rose-400 font-serif-cn">我们</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-lg font-serif-cn"
          >
            为兰州高校学生，打造一场认真的相遇
          </motion.p>
        </section>

        {/* Product intro */}
        <section className="py-20 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-rose-300/60 font-semibold">
                产品简介
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-400 font-serif-cn italic">
                写于 Hover DATE 上线前
              </h2>
            </div>

            <div className="space-y-5 text-zinc-400 font-light leading-relaxed">
              <p>
                在校园里，我们每天大约会与 3000 名同龄人擦肩而过。但根据「邓巴数」理论，人类社交网络上限仅为 150 人，而真正契合的概率——在剔除作息、三观、未来去向的偏差后——实际上不足 0.1%。
              </p>
              <p>
                为了寻找这 0.1% 的例外，我们习惯了用快餐式社交填补时间。列表里的好友越列越长，能接住你情绪的人却越来越少。这种看似热闹的虚假连接，最终只留下一地疲惫的空虚。
              </p>
              <p>
                我们不想再玩这种消耗人的游戏了。
              </p>
              <p>
                受斯坦福大学爆款社交实验 Date Drop 的启发，我们将这种「慢社交」理念带回了兰州。在斯坦福，这种仅限邮箱认证、每周只「掉落」一次结果的「笨拙」模式，在数月内促成了 3.5 万次高质量匹配。它证明了一件事：在极速狂奔的时代，我们内心最渴望的，是一份被认真对待的契合。
              </p>
              <p>
                于是，有了 Hover DATE。
              </p>
              <p>
                在这里，没有看脸的无限滑动，只有基于校园邮箱的纯粹圈子和测算共鸣概率的深度双向偏好算法。你不需要每天焦虑地刷软件，只需去上课、去泡图书馆、去好好生活。
              </p>
              <p>
                每周二晚 9 点，系统会为你准时「掉落」唯一一位同频的同学。
              </p>
              <p className="text-white/70 font-medium">
                一周一次，一个结果。
              </p>
              <p>
                我们用算法打败内耗，用等待换取珍贵。每周二晚 9 点，愿你在 Hover DATE，遇见那个 0.1% 的例外。
              </p>
            </div>
          </motion.div>
        </section>

        {/* Story with timeline */}
        <section className="py-20 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-10"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/60 font-semibold">
                我们的故事
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                源自<span className="text-amber-400 font-serif-cn">斯坦福</span>
                ，落地<span className="text-rose-400 font-serif-cn">兰州</span>
              </h2>
            </div>

            <div className="flex items-center gap-0 py-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-rose-400/40" />
              <div className="flex items-center gap-8 px-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                  <span className="text-[10px] text-amber-300/60 tracking-wider">2025</span>
                  <span className="text-xs text-zinc-500">斯坦福</span>
                </div>
                <div className="w-16 h-px bg-white/[0.06]" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]" />
                  <span className="text-[10px] text-rose-300/60 tracking-wider">2026</span>
                  <span className="text-xs text-zinc-500">兰州</span>
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-400/20 to-amber-400/40" />
            </div>

            <div className="space-y-5 text-zinc-400 font-light leading-relaxed">
              <p>
                2025 年，斯坦福大学华裔研究生 Henry Weng 打造了 Date
                Drop——仅限校园邮箱认证、深度问卷匹配、每周二晚统一「掉落」结果。这个模式在短短数月内覆盖了斯坦福
                5000+ 学生，完成了 35000+ 次匹配，并获得了 $210 万美元的融资。
              </p>
              <p>
                Hover DATE
                将这份经过验证的理念带回兰州。我们相信，真正的连接不应该建立在无限滑动和快餐式社交之上。每周一次，一个结果，认真对待每一次相遇——这是我们对「社交内耗」的回答。
              </p>
            </div>

            <blockquote className="text-2xl md:text-3xl font-serif-cn text-rose-300/30 text-center italic py-6">
              “我们不追求数量，只追求质量”
            </blockquote>
          </motion.div>
        </section>

        {/* Philosophy */}
        <section className="py-20 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-rose-300/60 font-semibold">
                产品哲学
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                拒绝<span className="text-rose-400 font-serif-cn">滑动焦虑</span>
                ，拥抱<span className="text-rose-400 font-serif-cn">深度连接</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: "01", t: "真实身份", d: "仅限 .edu.cn 校园邮箱认证，确保圈子纯粹。没有虚假账号，没有照骗，没有机器人。" },
                { n: "02", t: "深度算法", d: "7 步灵魂问卷，30+ 维度匹配。不只问你喜欢什么，更问你是谁。" },
                { n: "03", t: "周二掉落", d: "每周只推送一个结果。拒绝无限滑动，拒绝社交内耗。认真对待每一次相遇。" },
              ].map((item) => (
                <div
                  key={item.n}
                  className="group p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-500 space-y-3"
                >
                  <div className="text-4xl font-black text-white/[0.06] group-hover:text-white/[0.10] transition-colors">
                    {item.n}
                  </div>
                  <h3 className="text-base font-bold text-white">{item.t}</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Team */}
        <section className="py-20 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-10"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold">
                团队
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                四个人<span className="text-rose-400 font-serif-cn">，一个产品</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
              {[
                {
                  name: "Hover",
                  role: "项目企划",
                  bio: "Hover DATE 发起者，希望为兰州高校带来一场认真的相遇",
                  gradient: "from-rose-400 to-pink-500",
                  shadowGlow: "shadow-[0_0_40px_rgba(251,113,133,0.12)]",
                  gender: "male" as const,
                },
                {
                  name: "dandan",
                  role: "程序设计",
                  bio: "全栈工程师，从算法到像素，守护每一行代码的质量",
                  gradient: "from-indigo-400 to-violet-500",
                  shadowGlow: "shadow-[0_0_40px_rgba(129,140,248,0.12)]",
                  gender: "male" as const,
                },
                {
                  name: "Reyna Chen",
                  role: "产品负责人",
                  bio: "某知名社交产品工作者，1年社交产品经验，专注青年社交与增长",
                  gradient: "from-amber-400 to-orange-500",
                  shadowGlow: "shadow-[0_0_40px_rgba(251,191,36,0.12)]",
                  gender: "female" as const,
                },
                {
                  name: "Dorian Vale",
                  role: "视觉设计",
                  bio: "世界级设计语言，赋予 Hover DATE 独特的美学灵魂与交互体验",
                  gradient: "from-emerald-400 to-teal-500",
                  shadowGlow: "shadow-[0_0_40px_rgba(52,211,153,0.12)]",
                  gender: "female" as const,
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="relative bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-500 rounded-2xl p-7 text-center space-y-4 group"
                >
                  <div
                    className={`w-[72px] h-[72px] mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center ${member.shadowGlow} group-hover:scale-105 transition-transform duration-500`}
                  >
                    <svg viewBox="0 0 72 72" className="w-11 h-11" fill="none" aria-hidden="true">
                      {member.gender === "male" ? (
                        <>
                          <circle cx="36" cy="26" r="12" fill="white" opacity="0.92" />
                          <path d="M22 60 Q36 44 50 60" fill="white" opacity="0.85" />
                          <path d="M24 26 Q24 15 36 12 Q48 15 48 26" fill="white" opacity="0.55" />
                        </>
                      ) : (
                        <>
                          <circle cx="36" cy="26" r="11" fill="white" opacity="0.92" />
                          <path d="M23 60 Q36 46 49 60" fill="white" opacity="0.85" />
                          <path d="M23 26 Q22 10 36 10 Q50 10 49 26 Q52 38 50 52 Q42 34 36 34 Q30 34 22 52 Q20 38 23 26" fill="white" opacity="0.5" />
                        </>
                      )}
                    </svg>
                  </div>
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] text-zinc-400 tracking-wider">
                    {member.role}
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{member.name}</h3>
                    <p className="text-[11px] text-zinc-400 font-light mt-1.5 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact */}
        <section className="py-20 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto space-y-8"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold">
                联系与反馈
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                我们<span className="text-rose-400 font-serif-cn">听你的</span>
              </h2>
            </div>
            <a
              href="mailto:hoverdate@lzu.edu.cn"
              className="block p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-0.5 transition-all duration-300 text-center space-y-3"
            >
              <span className="text-2xl">📧</span>
              <p className="text-sm text-white font-mono font-medium">
                hoverdate@lzu.edu.cn
              </p>
              <p className="text-xs text-zinc-500">
                任何问题、建议或合作，随时联系
              </p>
            </a>
          </motion.div>
        </section>

        <div className="py-12 text-center border-t border-white/[0.06]">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-rose-400 transition-colors underline underline-offset-4"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
