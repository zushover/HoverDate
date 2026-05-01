"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Questionnaire from "@/components/Questionnaire";
import PageShell from "@/components/PageShell";

function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (emailParam && (emailParam.endsWith(".edu.cn") || emailParam.endsWith("test.edu.cn"))) {
      setEmail(emailParam);
    } else {
      const saved = localStorage.getItem("hoverdate_email");
      if (saved && (saved.endsWith(".edu.cn") || saved.endsWith("test.edu.cn"))) setEmail(saved);
      else router.replace("/");
    }
  }, [emailParam, router]);

  if (!email) {
    return (
      <div className="z-10 flex flex-col items-center justify-center min-h-screen text-center space-y-4">
        <p className="text-zinc-400">请先从首页输入校园邮箱</p>
        <Link href="/" className="text-rose-400 hover:underline">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>
      <Questionnaire userEmail={email} onBack={() => router.push("/")} />
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <PageShell ambientOrbs orbIntensity="light">
      <Suspense fallback={
        <div className="z-10 flex items-center justify-center min-h-screen">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      }>
        <QuestionnaireContent />
      </Suspense>
    </PageShell>
  );
}
