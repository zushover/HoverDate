"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitResponse, type QuestionnaireData } from "@/lib/db";

const MAJOR_CATEGORIES = [
  { value: "engineering", label: "工科", desc: "计算机、机械、电气、土木等" },
  { value: "science", label: "理科", desc: "数学、物理、化学、生物等" },
  { value: "arts", label: "文科", desc: "中文、历史、哲学、外语等" },
  { value: "medicine", label: "医科", desc: "临床、药学、护理、公卫等" },
  { value: "agriculture", label: "农科", desc: "农学、植保、畜牧、兽医等" },
  { value: "business", label: "经管", desc: "经济、金融、管理、会计等" },
  { value: "art_sports", label: "艺体", desc: "美术、音乐、设计、体育等" },
  { value: "other", label: "其他" },
];

const HOBBY_OPTIONS = [
  { value: "sports", label: "运动健身" }, { value: "gaming", label: "游戏" },
  { value: "reading", label: "读书" }, { value: "movies", label: "电影" },
  { value: "music", label: "音乐" }, { value: "travel", label: "旅行" },
  { value: "cooking", label: "美食烹饪" }, { value: "photography", label: "摄影" },
  { value: "anime", label: "动漫" }, { value: "pets", label: "宠物" },
  { value: "dance", label: "舞蹈" }, { value: "writing", label: "写作" },
  { value: "tech", label: "数码科技" }, { value: "fashion", label: "穿搭时尚" },
  { value: "outdoors", label: "户外探险" },
];

const LZU_CAMPUSES = [
  { value: "lzu_chengguan", label: "城关校区", desc: "兰州市区本部" },
  { value: "lzu_yuzhong", label: "榆中校区", desc: "兰州市榆中县" },
];

const NWNU_CAMPUSES = [
  { value: "nwnu_yunting", label: "云亭校区", desc: "安宁东路967号·本部" },
  { value: "nwnu_zhixing", label: "知行校区", desc: "安宁东路·新校区" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "男" }, { value: "female", label: "女" },
];

const PREF_GENDER_OPTIONS = [
  { value: "male", label: "男生" }, { value: "female", label: "女生" }, { value: "any", label: "不限" },
];

const MUSIC_OPTIONS = [
  { value: "pop", label: "流行", desc: "华语流行、欧美流行" },
  { value: "rock", label: "摇滚", desc: "摇滚、金属、朋克" },
  { value: "hiphop", label: "说唱", desc: "Hip-Hop、R&B" },
  { value: "electronic", label: "电子", desc: "EDM、House、Techno" },
  { value: "classical", label: "古典", desc: "交响乐、室内乐" },
  { value: "folk", label: "民谣", desc: "民谣、独立音乐" },
  { value: "chinese_style", label: "国风", desc: "古风、戏曲、民族" },
  { value: "kpop", label: "K-Pop", desc: "韩国流行" },
  { value: "any", label: "不挑", desc: "什么都听" },
];

const VIDEO_OPTIONS = [
  { value: "variety", label: "综艺", desc: "真人秀、脱口秀" },
  { value: "anime", label: "动漫", desc: "日漫、国漫、美漫" },
  { value: "movie", label: "电影", desc: "院线大片、经典老片" },
  { value: "documentary", label: "纪录片", desc: "自然、历史、人文" },
  { value: "game_live", label: "游戏直播", desc: "看比赛、看直播" },
  { value: "knowledge", label: "知识科普", desc: "科普、教程、讲座" },
  { value: "sports", label: "体育赛事", desc: "足球、篮球、电竞" },
  { value: "rarely", label: "不怎么看", desc: "很少看视频" },
];

const PARTICLE_COLORS = ["#fb7185", "#f472b6", "#fbbf24", "#f0ebe4"];

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
}

function spawnParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    tx: (Math.random() - 0.5) * 200,
    ty: (Math.random() - 0.5) * 200 - 60,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    size: 4 + Math.random() * 6,
  }));
}

const stepTitles: Record<number, { title: string; sub: string; emoji: string; why: string }> = {
  1: { title: "基础身份", sub: "先认识一下你", emoji: "👋", why: "性别、校区、专业——这些基本信息是匹配的起点。了解你的身份背景，才能帮你找到合适的人。" },
  2: { title: "生活共振", sub: "节奏合拍的人，相处才不累", emoji: "🌊", why: "日常节奏的相似度是长期关系满意度的最强预测指标之一。这不是测好坏，是测合拍。" },
  3: { title: "学业画像", sub: "你在学什么，怎么学", emoji: "🎓", why: "专业背景和学习状态影响你的思维方式、时间分配和未来规划。" },
  4: { title: "兴趣图谱", sub: "你喜欢什么，怎么放松", emoji: "🎨", why: "共同的兴趣爱好是关系的润滑剂。了解彼此的娱乐方式，能找到相处的舒适区。" },
  5: { title: "内心世界", sub: "了解你的底层操作系统", emoji: "🧭", why: "消费观、压力应对、决策方式——这些「看不见」的东西，决定了你们能不能走得远。" },
  6: { title: "关系筛选", sub: "你在寻找什么，需要什么", emoji: "💫", why: "恋爱意图、对伴侣的期望、冲突处理方式——这一步帮你明确自己想要的关系样貌。" },
  7: { title: "未来拼图", sub: "拼上你的远方", emoji: "🗺️", why: "毕业去向、深造安排、婚姻规划——如果大方向不同，再好的感情也可能走不到最后。" },
};

const stepNames = ["身份", "共振", "学业", "兴趣", "内心", "筛选", "拼图"];

export default function Questionnaire({ userEmail, onBack }: { userEmail: string; onBack?: () => void }) {
  const TOTAL_STEPS = 7;
  const emailLower = userEmail.toLowerCase();
  const STORAGE_KEY = `hoverdate_${userEmail}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [celebrateParticles, setCelebrateParticles] = useState<Particle[]>([]);
  const [showCelebrate, setShowCelebrate] = useState(false);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  useEffect(() => {
    if (showCelebrate) {
      const timer = setTimeout(() => setShowCelebrate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showCelebrate]);

  const [formData, setFormData] = useState<ReturnType<typeof getDefaultFormData>>(() => {
    if (typeof window === "undefined") return getDefaultFormData();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...getDefaultFormData(), ...JSON.parse(saved) };
    } catch {}
    return getDefaultFormData();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(formData)); } catch {}
  }, [formData, STORAGE_KEY]);

  function getDefaultFormData() {
    return {
      intent: "", accept_long_distance: "", dating_experience: "", target_year: "",
      my_sleep: 3, pref_sleep: 3, my_social: 3, pref_social: 3, my_study: 3, pref_study: 3,
      life_priority: "", spending_style: "", stress_response: "", decision_style: "",
      major_category: "", hobbies: [] as string[], music_preference: [] as string[], video_preference: [] as string[],
      user_university: "", user_campus: "", pref_university: [] as string[], pref_campus: [] as string[],
      pref_dating_experience: "", user_gender: "", pref_gender: "",
      social_energy: "", love_language: "", conflict_style: "", date_frequency: "",
      future_city: "", edu_plan: "", marriage_timeline: "", relationship_pace: "",
    };
  }

  const setField = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field: string, value: string) => {
    setFormData((prev) => {
      const current = (prev as Record<string, unknown>)[field] as string[];
      return { ...prev, [field]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
    });
  };

  const handleSubmit = async () => {
    const required = ["intent", "accept_long_distance", "conflict_style"];
    const missing = required.filter((f) => !formData[f as keyof typeof formData]);
    if (missing.length > 0) { setError("请完成所有带 * 的题目"); return; }
    setSubmitting(true); setError("");
    try {
      await submitResponse({
        email: userEmail, intent: formData.intent, accept_long_distance: formData.accept_long_distance,
        dating_experience: formData.dating_experience || undefined, target_year: formData.target_year || undefined,
        my_sleep: formData.my_sleep, pref_sleep: formData.pref_sleep,
        my_social: formData.my_social, pref_social: formData.pref_social,
        my_study: formData.my_study, pref_study: formData.pref_study,
        life_priority: formData.life_priority || undefined, spending_style: formData.spending_style || undefined,
        stress_response: formData.stress_response || undefined, decision_style: formData.decision_style || undefined,
        major_category: formData.major_category || undefined,
        hobbies: (formData.hobbies as string[]).length > 0 ? (formData.hobbies as string[]).join(",") : undefined,
        music_preference: (formData.music_preference as string[]).length > 0 ? (formData.music_preference as string[]).join(",") : undefined,
        video_preference: (formData.video_preference as string[]).length > 0 ? (formData.video_preference as string[]).join(",") : undefined,
        user_gender: formData.user_gender || undefined,
        pref_gender: formData.pref_gender || undefined,
        user_university: formData.user_university || undefined,
        user_campus: formData.user_campus || undefined,
        pref_university: (formData.pref_university as string[]).length > 0 ? (formData.pref_university as string[]).join(",") : undefined,
        pref_campus: (formData.pref_campus as string[]).length > 0 ? (formData.pref_campus as string[]).join(",") : undefined,
        pref_dating_experience: formData.pref_dating_experience || undefined,
        social_energy: formData.social_energy || undefined, love_language: formData.love_language || undefined,
        conflict_style: formData.conflict_style, date_frequency: formData.date_frequency || undefined,
        future_city: formData.future_city || undefined, edu_plan: formData.edu_plan || undefined,
        marriage_timeline: formData.marriage_timeline || undefined, relationship_pace: formData.relationship_pace || undefined,
      });
      localStorage.setItem("hoverdate_submitted", "true");
      localStorage.setItem("hoverdate_email", userEmail);
      setCelebrateParticles(spawnParticles(12));
      setShowCelebrate(true);
      setTimeout(() => setSubmitted(true), 400);
    } catch { setError("提交失败，请重试"); }
    finally { setSubmitting(false); }
  };

  const renderOption = (field: string, value: string, label: string, desc?: string) => {
    const isSelected = formData[field as keyof typeof formData] === value;
    return (
      <div
        onClick={() => { setField(field, value); if (navigator.vibrate) navigator.vibrate(8); }}
        className={`relative p-5 rounded-2xl cursor-pointer border transition-all duration-300 text-left active:scale-[0.97] overflow-hidden group ${
          isSelected
            ? "border-rose-400/50 bg-rose-400/[0.10] shadow-[0_0_32px_rgba(251,113,133,0.10)]"
            : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.16] hover:-translate-y-0.5"
        }`}
      >
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-gradient-to-b from-rose-400 to-pink-400" />
        )}
        <div className={`font-semibold text-base ${isSelected ? "text-white" : "text-zinc-300 group-hover:text-zinc-200"}`}>
          {label}
        </div>
        {desc && (
          <div className={`text-sm mt-1.5 font-light leading-relaxed ${isSelected ? "text-rose-200/70" : "text-zinc-500"}`}>
            {desc}
          </div>
        )}
      </div>
    );
  };

  const renderMultiOption = (field: string, value: string, label: string) => {
    const selected = (formData[field as keyof typeof formData] as string[]).includes(value);
    return (
      <div
        onClick={() => toggleMulti(field, value)}
        className={`px-4 py-2.5 rounded-full cursor-pointer border transition-all duration-300 text-sm active:scale-[0.97] ${
          selected
            ? "border-rose-400/50 bg-rose-400/[0.14] text-white ring-1 ring-rose-400/20 shadow-[0_0_12px_rgba(251,113,133,0.08)]"
            : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:border-white/[0.16] hover:text-zinc-300"
        }`}
      >
        {label}
      </div>
    );
  };

  const renderSlider = (field: string, label: string, leftLabel: string, rightLabel: string) => {
    const value = formData[field as keyof typeof formData] as number;
    return (
      <div className="mb-8">
        <label className="block text-base font-medium text-zinc-200 mb-5">{label}</label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 w-20 sm:w-24 text-right leading-snug flex-shrink-0">{leftLabel}</span>
          <div className="relative flex-1 flex items-center min-w-0">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={value}
              onChange={(e) => setField(field, parseInt(e.target.value))}
              className="custom-slider w-full"
            />
          </div>
          <span className="text-xs text-zinc-500 w-20 sm:w-24 leading-snug flex-shrink-0">{rightLabel}</span>
        </div>
        <div className="text-center mt-4">
          <motion.span
            key={value}
            initial={{ scale: 1.4, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.04] text-lg font-bold text-white border border-white/[0.06]"
          >
            {value}
          </motion.span>
        </div>
      </div>
    );
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20, filter: "blur(3px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, x: -20, filter: "blur(3px)", transition: { duration: 0.25 } },
  } as const;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/[0.05] backdrop-blur-3xl border border-white/[0.12] w-full rounded-[2rem] shadow-[0_8px_60px_rgba(0,0,0,0.5)] p-10 sm:p-14 text-center overflow-hidden"
      >
        {/* Particle burst */}
        <AnimatePresence>
          {showCelebrate &&
            celebrateParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none z-20"
                style={{
                  left: "50%", top: "40%",
                  width: p.size, height: p.size,
                  backgroundColor: p.color,
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="text-6xl mb-6">💌</div>
          <h2 className="text-3xl font-black mb-3 tracking-tight">灵魂测试完成</h2>
          <p className="text-zinc-400 text-lg mb-1 font-light">你的答卷已锁定，算法将在下周二晚 9:00 为你匹配。</p>
          <p className="text-zinc-500 text-sm font-light">届时留意你的校园邮箱 <span className="text-rose-300 font-medium">{userEmail}</span></p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
              </span>
              <span className="text-xs text-zinc-400">等待周二掉落中…</span>
            </div>
            <div className="flex gap-5">
              <a href="/status" className="text-sm text-zinc-400 hover:text-rose-400 transition-colors underline underline-offset-4">
                查看我的匹配状态 →
              </a>
              {onBack && (
                <button onClick={onBack} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4">
                  返回首页
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-white/[0.05] backdrop-blur-3xl border border-white/[0.12] w-full rounded-[2rem] shadow-[0_8px_60px_rgba(0,0,0,0.5),0_0_120px_rgba(251,113,133,0.03)] p-6 sm:p-12 text-white overflow-hidden"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-400/[0.08] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-400/[0.04] rounded-full blur-[130px] pointer-events-none" />

      {/* Progress bar */}
      <div className="w-full mb-8 relative z-10">
        <div className="flex justify-between text-xs font-medium mb-3 px-1">
          <span className="text-zinc-500 uppercase tracking-[0.2em]">
            {currentStep === TOTAL_STEPS ? "最后一步" : `第 ${currentStep} / ${TOTAL_STEPS} 步`}
          </span>
          <span className="text-rose-300/60 text-xs">{userEmail}</span>
        </div>
        <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 rounded-full shadow-[0_0_8px_rgba(251,113,133,0.3)]"
            initial={{ width: `${((currentStep - 1) / TOTAL_STEPS) * 100}%` }}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step indicators with connecting lines */}
      <div className="flex justify-center items-center gap-0 mb-10 relative z-10">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className="flex items-center">
            <button onClick={() => setCurrentStep(i + 1)} className="flex flex-col items-center gap-1.5 group">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i + 1 === currentStep
                    ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)] scale-125 ring-4 ring-rose-400/10"
                    : i + 1 < currentStep
                      ? "bg-rose-400/40"
                      : "bg-white/10 group-hover:bg-white/20"
                }`}
              />
              <span
                className={`text-[11px] transition-all duration-300 ${
                  i + 1 === currentStep
                    ? "text-rose-300/80 font-medium"
                    : i + 1 < currentStep
                      ? "text-rose-400/30"
                      : "text-zinc-700 group-hover:text-zinc-600"
                }`}
              >
                {stepNames[i]}
              </span>
            </button>
            {i < TOTAL_STEPS - 1 && (
              <div className={`w-5 sm:w-8 h-px mb-5 transition-all duration-500 ${i + 1 < currentStep ? "bg-rose-400/20" : "bg-white/[0.04]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step header */}
      <div className="relative z-10 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-black tracking-tight">
            {stepTitles[currentStep].title}
            <span className="ml-3 opacity-40 text-2xl">{stepTitles[currentStep].emoji}</span>
          </h2>
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="ml-auto text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
          >
            为什么要问？
            <svg className={`w-3 h-3 transition-transform duration-300 ${showWhy ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <p className="text-zinc-400 text-base font-light">{stepTitles[currentStep].sub}</p>
        <AnimatePresence>
          {showWhy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-sm text-zinc-400 leading-relaxed">{stepTitles[currentStep].why}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step content */}
      <div className="relative z-10 min-h-[360px]">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你的性别</h3>
                <div className="grid grid-cols-2 gap-3">
                  {GENDER_OPTIONS.map((g) => renderOption("user_gender", g.value, g.label))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你期待的 TA 的性别</h3>
                <div className="grid grid-cols-3 gap-3">
                  {PREF_GENDER_OPTIONS.map((g) => renderOption("pref_gender", g.value, g.label))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你所在的大学</h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderOption("user_university", "lzu", "兰州大学", "lzu.edu.cn")}
                  {renderOption("user_university", "nwnu", "西北师范大学", "nwnu.edu.cn")}
                </div>
              </div>
              {formData.user_university && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                  <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">
                    你在{formData.user_university === "lzu" ? "兰州大学" : "西北师范大学"}的校区
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(formData.user_university === "lzu" ? LZU_CAMPUSES : NWNU_CAMPUSES).map((c) =>
                      renderOption("user_campus", c.value, c.label, c.desc)
                    )}
                  </div>
                </motion.div>
              )}
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你期望对方在哪些大学（多选）</h3>
                <div className="flex flex-wrap gap-2.5">
                  <div
                    onClick={() => {
                      const all = ["lzu", "nwnu"];
                      const cur = formData.pref_university as string[];
                      setField("pref_university", cur.length === all.length ? [] : all);
                    }}
                    className={`px-4 py-2.5 rounded-full cursor-pointer border transition-all duration-300 text-sm active:scale-[0.97] ${
                      (formData.pref_university as string[]).length === 2
                        ? "border-rose-400/50 bg-rose-400/[0.14] text-white"
                        : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    全选
                  </div>
                  {renderMultiOption("pref_university", "lzu", "兰州大学")}
                  {renderMultiOption("pref_university", "nwnu", "西北师范大学")}
                </div>
              </div>
              {(formData.pref_university as string[]).length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                  <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你期望对方在哪些校区（多选）</h3>
                  <div className="space-y-4">
                    {(formData.pref_university as string[]).includes("lzu") && (
                      <div>
                        <p className="text-xs text-rose-300/60 mb-2 font-medium">兰州大学</p>
                        <div className="flex flex-wrap gap-2.5">
                          {LZU_CAMPUSES.map((c) => renderMultiOption("pref_campus", c.value, c.label))}
                        </div>
                      </div>
                    )}
                    {(formData.pref_university as string[]).includes("nwnu") && (
                      <div>
                        <p className="text-xs text-amber-300/60 mb-2 font-medium">西北师范大学</p>
                        <div className="flex flex-wrap gap-2.5">
                          {NWNU_CAMPUSES.map((c) => renderMultiOption("pref_campus", c.value, c.label))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-3">已选 {(formData.pref_campus as string[]).length} 项</p>
                </motion.div>
              )}
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你的专业大类</h3>
                <div className="grid grid-cols-2 gap-3">
                  {MAJOR_CATEGORIES.map((m) => renderOption("major_category", m.value, m.label, m.desc))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl mb-6">
                <h3 className="text-sm text-rose-300/80 uppercase tracking-[0.2em] mb-6 font-medium border-b border-white/[0.04] pb-4">作息</h3>
                {renderSlider("my_sleep", "你的真实作息", "早睡早起 22:00", "熬夜冠军 2:00+")}
                {renderSlider("pref_sleep", "你期待对方的作息", "必须早睡早起", "最好一起熬夜")}
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl mb-6">
                <h3 className="text-sm text-pink-300/80 uppercase tracking-[0.2em] mb-6 font-medium border-b border-white/[0.04] pb-4">社交</h3>
                {renderSlider("my_social", "周末你的充电方式", "宅在宿舍不出门", "必须出去见人")}
                {renderSlider("pref_social", "你期待对方的社交模式", "各忙各的互不打扰", "去哪都要一起")}
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <motion.div key="s3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl">
                <h3 className="text-sm text-violet-300/80 uppercase tracking-[0.2em] mb-6 font-medium border-b border-white/[0.04] pb-4">学业</h3>
                {renderSlider("my_study", "你的学习投入状态", "及格万岁心态松弛", "卷王之王全年无休")}
                {renderSlider("pref_study", "你期待对方的学业状态", "一起躺平享受生活", "互相监督一起卷")}
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <motion.div key="s4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你的兴趣爱好（多选）</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HOBBY_OPTIONS.map((h) => renderMultiOption("hobbies", h.value, h.label))}
                </div>
                <p className="text-xs text-zinc-600 mt-3">已选 {(formData.hobbies as string[]).length} 项</p>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你平时喜欢听什么类型的音乐？（多选）</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MUSIC_OPTIONS.map((m) => renderMultiOption("music_preference", m.value, m.label))}
                </div>
                <p className="text-xs text-zinc-600 mt-3">已选 {(formData.music_preference as string[]).length} 项</p>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你喜欢看什么类型的视频内容？（多选）</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {VIDEO_OPTIONS.map((v) => renderMultiOption("video_preference", v.value, v.label))}
                </div>
                <p className="text-xs text-zinc-600 mt-3">已选 {(formData.video_preference as string[]).length} 项</p>
              </div>
            </motion.div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <motion.div key="s5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你觉得人生的重心应该在哪？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("life_priority", "career", "事业优先", "个人成就和自我实现是第一位的")}
                  {renderOption("life_priority", "life", "生活优先", "幸福感和体验浓度比成功重要")}
                  {renderOption("life_priority", "balance", "平衡型", "两手都要抓，不极端")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">和朋友聚餐，你的消费态度是？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("spending_style", "frugal", "能省则省", "食堂也行，重要的是人")}
                  {renderOption("spending_style", "moderate", "适度消费", "人均50-80，偶尔小资")}
                  {renderOption("spending_style", "enjoy", "享受当下", "好吃的不能将就")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">考试挂科了，你的第一反应是？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("stress_response", "talk", "找人倾诉", "给朋友打电话、约人吐槽")}
                  {renderOption("stress_response", "alone", "独自消化", "一个人待着慢慢收拾情绪")}
                  {renderOption("stress_response", "distract", "转移注意", "打游戏、追剧，先不想了")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">做重大决定时，你更依赖什么？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderOption("decision_style", "rational", "理性分析", "列出利弊，充分收集信息")}
                  {renderOption("decision_style", "intuitive", "直觉感受", "更相信第六感和第一反应")}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6 */}
          {currentStep === 6 && (
            <motion.div key="s6" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">核心期待 <span className="text-rose-400">*</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("intent", "casual", "随缘交友", "从朋友做起，不强求结果")}
                  {renderOption("intent", "serious", "认真脱单", "以长期稳定关系为目标")}
                  {renderOption("intent", "open", "开放心态", "不预设框架，看对眼了都行")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">地理距离 <span className="text-rose-400">*</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderOption("accept_long_distance", "no", "不接受异地", "毕业去向不同直接 pass")}
                  {renderOption("accept_long_distance", "yes", "可以接受异地", "灵魂契合比距离重要")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你谈过几次恋爱？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("dating_experience", "never", "没谈过")}
                  {renderOption("dating_experience", "once", "一次", "有过认真的一段")}
                  {renderOption("dating_experience", "multiple", "多次", "经历比较多")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你介意对方谈过几次恋爱？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("pref_dating_experience", "never", "希望是初恋", "对方没谈过最好")}
                  {renderOption("pref_dating_experience", "open", "不介意", "过去不重要，重要的是现在")}
                  {renderOption("pref_dating_experience", "experienced", "有经验更好", "经历过才知道自己要什么")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">社交场合让你感到？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("social_energy", "extrovert", "充电", "人群让我兴奋，越聊越嗨")}
                  {renderOption("social_energy", "introvert", "耗电", "社交后需要独处回血")}
                  {renderOption("social_energy", "ambivert", "看情况", "分人分场合")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">伴侣做了什么你最感动？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderOption("love_language", "words", "真诚的赞美", "告诉你「你真棒」")}
                  {renderOption("love_language", "acts", "实际的行动", "默默帮你做完不爱做的事")}
                  {renderOption("love_language", "time", "高质量的陪伴", "放下手机，专注和你待在一起")}
                  {renderOption("love_language", "touch", "身体接触", "拥抱、牵手、拍拍头")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">你和伴侣吵架了，你会？<span className="text-rose-400">*</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("conflict_style", "active", "直接沟通", "必须立刻把问题聊清楚")}
                  {renderOption("conflict_style", "cool_down", "冷静缓冲", "情绪平复后再复盘")}
                  {renderOption("conflict_style", "passive", "给台阶就下", "对方主动一点就顺势和解")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">理想的约会频率</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("date_frequency", "high", "能天天见最好")}
                  {renderOption("date_frequency", "mid", "一周两三次", "有各自的空间")}
                  {renderOption("date_frequency", "low", "一周一次", "慢节奏，质量>数量")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">学段偏好</h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderOption("target_year", "undergrad", "本科生")}
                  {renderOption("target_year", "grad", "研究生/博士")}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7 */}
          {currentStep === 7 && (
            <motion.div key="s7" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">毕业后你想去哪？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("future_city", "lanzhou", "留在兰州", "喜欢这里的节奏")}
                  {renderOption("future_city", "bigcity", "去大城市", "北上广深杭")}
                  {renderOption("future_city", "unsure", "不确定", "看 offer 和缘分")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">有继续深造的打算吗？</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("edu_plan", "yes", "考研/保研/申PhD")}
                  {renderOption("edu_plan", "no", "毕业后直接工作")}
                  {renderOption("edu_plan", "unsure", "还没想好")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">对婚姻的规划</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderOption("marriage_timeline", "early", "25岁前", "趁年轻安定下来")}
                  {renderOption("marriage_timeline", "mid", "25-30岁", "事业有基础后")}
                  {renderOption("marriage_timeline", "late", "30岁后", "先闯一闯")}
                  {renderOption("marriage_timeline", "noplan", "没有时间表", "遇到对的人才重要")}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">关系发展节奏</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderOption("relationship_pace", "slow", "慢热型", "从朋友做起，慢慢确认心意")}
                  {renderOption("relationship_pace", "natural", "随缘型", "感觉对了就在一起")}
                  {renderOption("relationship_pace", "fast", "直球型", "第一感觉对了就主动推进")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-between items-center pt-6 relative z-10">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-full font-medium transition-all text-sm ${
            currentStep === 1
              ? "text-zinc-700 cursor-not-allowed"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05] active:scale-[0.97]"
          }`}
        >
          ← 上一题
        </button>
        {error && <p className="text-xs text-red-400/70">{error}</p>}
        {currentStep < TOTAL_STEPS ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1))}
            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 hover:-translate-y-0.5 transition-all active:scale-[0.97] shadow-[0_0_20px_rgba(255,255,255,0.12)]"
          >
            下一步 →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-[0.97] shadow-[0_0_20px_rgba(251,113,133,0.3)] hover:shadow-[0_0_32px_rgba(251,113,133,0.5)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? (
              <span className="flex items-center gap-1">
                提交中
                <span className="inline-flex gap-0.5">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-1 h-1 rounded-full bg-white" />
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 rounded-full bg-white" />
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 rounded-full bg-white" />
                </span>
              </span>
            ) : (
              "完成并锁定 →"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
