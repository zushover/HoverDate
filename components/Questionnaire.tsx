"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; // 确保你已经创建了这个文件

// 定义组件接收的参数类型
interface QuestionnaireProps {
  userEmail: string;
}

const questions = [
  { id: 1, text: "兰州牛肉面，你属于哪一派？", options: ["肉蛋双飞（豪华版）", "只吃清汤（纯粹派）", "加辣加醋（重口派）", "细面党"] },
  { id: 2, text: "关于放哈甜胚子奶茶，你的态度是？", options: ["必加双份甜胚子", "正常糖就好", "不太感冒", "只喝纯茶"] },
  { id: 3, text: "周末的完美下午，你更愿意出现在？", options: ["中山桥吹风看黄河", "培黎广场安静散步", "吾悦广场吃喝玩乐", "宿舍/实验室搞科研"] },
  { id: 4, text: "第一次约会，你更倾向于去？", options: ["安静的咖啡馆", "地道的火锅店", "黄河边的精酿吧", "看一场电影"] },
  { id: 5, text: "关于未来，你的首选计划是？", options: ["留在新一线城市奋斗", "考公考编追求稳定", "回家乡陪伴父母", "出国深造"] }
];

export default function Questionnaire({ userEmail }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 新增：提交状态控制

  const handleAnswer = async (option: string) => {
    // 1. 记录当前答案
    const newAnswers = { ...answers, [questions[currentStep].id]: option };
    setAnswers(newAnswers);

    // 2. 判断是否是最后一题
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 3. 最后一题，触发上传逻辑
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .insert([
            { 
              email: userEmail, 
              answers: newAnswers // 直接存入 JSONB 字段
            }
          ]);

        if (error) throw error;
        setIsFinished(true);
      } catch (error: any) {
        console.error("提交失败:", error);
        alert("提交失败: " + (error.message || "请检查网络或邮箱是否已注册"));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-3xl font-bold text-white mb-4">灵魂契合度录入成功</h2>
        <p className="text-zinc-400">你的数据已进入本周二 21:00 的匹配池</p>
        <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-full border border-white/10 text-zinc-400 hover:text-white transition-all">
          返回首页
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <p className="text-white animate-pulse text-lg tracking-widest">正在同步灵魂特征...</p>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="flex flex-col gap-10"
        >
          {/* 进度条 */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-medium text-white leading-tight">
              {questions[currentStep].text}
            </h2>
            <div className="grid gap-3">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isSubmitting}
                  className="w-full py-6 text-left text-zinc-500 border-b border-zinc-900 hover:text-white hover:border-zinc-400 transition-all text-sm tracking-widest uppercase font-light"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}