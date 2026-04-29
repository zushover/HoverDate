"use client";

import { useState } from "react";
import Questionnaire from "@/components/Questionnaire";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [email, setEmail] = useState("");
  
  // 背景图片名称，请确保图片已放入 public 文件夹
  const backgroundImageName = "background.jpg"; 

  const handleStart = () => {
    // 简单的邮箱格式校验
    if (!email) {
      alert("请输入你的校园邮箱");
      return;
    }
    if (!email.endsWith(".edu.cn")) {
      alert("请使用有效的 .edu.cn 校园邮箱进行认证");
      return;
    }
    setShowQuestionnaire(true);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start p-6 pt-12 md:pt-20 text-white overflow-x-hidden selection:bg-purple-500/30">
      
      {/* 沉浸式背景层 */}
      <div 
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-[1.02]"
        style={{ 
          backgroundImage: `url('/${backgroundImageName}')`,
          filter: 'brightness(0.3) contrast(1.1) blur(1px)'
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center">
        
        <AnimatePresence mode="wait">
          {!showQuestionnaire ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-16 md:gap-24"
            >
              {/* 标题与定位 */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
                  Hover DATE
                </h1>
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl font-medium text-zinc-200 tracking-tight">
                    每周二晚 9 点，遇见频率相同的人。
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold">
                      📍 兰州高校专属认证
                    </span>
                    <div className="flex gap-4 text-xs text-zinc-500 font-medium">
                      <span>兰州大学 <small className="opacity-40">lzu.edu.cn</small></span>
                      <span className="opacity-20">|</span>
                      <span>西北师范大学 <small className="opacity-40">nwnu.edu.cn</small></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 三道简介卡片 */}
              <div className="grid md:grid-cols-3 gap-8 w-full">
                {[
                  { icon: "🛡️", title: "严格认证", desc: "仅限教育邮箱注册，确保圈子纯粹安全。" },
                  { icon: "🤝", title: "深度算法", desc: "基于 30 道灵魂课题，寻找真正的频率共鸣。" },
                  { icon: "⏰", title: "周二掉落", desc: "拒绝社交内耗，每周只给你一个完美结果。" }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/5 text-left hover:border-white/10 transition-colors group">
                    <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                    <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* 操作区域 */}
              <div className="w-full max-w-md flex flex-col gap-6 mb-20">
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="输入你的 .edu.cn 校园邮箱"
                    className="w-full px-6 py-5 rounded-2xl bg-black/40 border border-white/10 text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-700"
                  />
                  <button 
                    onClick={handleStart}
                    className="w-full px-6 py-5 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    开始灵魂测试 <span>→</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 tracking-widest uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  目前已有 1,280 位同学已认证待命
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="questionnaire"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-2xl mt-4"
            >
              {/* 关键：将 email 传给问卷组件 */}
              <Questionnaire userEmail={email} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <footer className="fixed bottom-8 text-[10px] text-zinc-700 tracking-[0.3em] uppercase font-mono">
        © 2026 HOVER DATE · LANZHOU COLLEGE ALLIANCE
      </footer>
    </main>
  );
}