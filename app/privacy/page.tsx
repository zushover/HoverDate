import Link from "next/link";

const SECTIONS = [
  { t: "信息收集", b: "我们仅收集你的校园邮箱地址和问卷答案。我们不会收集你的姓名、手机号码、地理位置或其他个人身份信息。" },
  { t: "信息使用", b: "你的问卷答案仅用于匹配算法计算。我们不会将你的数据用于任何商业目的，不会出售或分享给第三方。" },
  { t: "信息存储", b: "所有数据存储在 Supabase 的安全服务器上。我们采取合理的技术措施保护你的数据安全。" },
  { t: "匹配结果", b: "匹配结果仅通过你提供的校园邮箱通知。我们不会在平台上公开你的个人资料或匹配详情。" },
  { t: "数据保留", b: "你可以在任何时候通过联系我们删除你的数据。我们会在收到请求后 7 个工作日内处理。" },
  { t: "Cookie", b: "我们使用浏览器本地存储（localStorage）保存你的问卷进度，不会使用跟踪型 Cookie。" },
];

export default function PrivacyPage() {
  return (
    <div className="z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-20 space-y-6">
      <section className="text-center space-y-3 pt-8 pb-8">
        <h1 className="text-3xl font-bold">隐私政策</h1>
        <p className="text-zinc-500 text-xs">最后更新：2026年5月1日</p>
      </section>

      <section className="space-y-10">
        {SECTIONS.map((s, i) => (
          <div key={i} className="flex gap-6 group">
            <span className="text-6xl font-black text-indigo-400/[0.05] flex-shrink-0 leading-none select-none tabular-nums w-14 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="space-y-2 pt-2">
              <h3 className="text-base font-bold text-white">{s.t}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">{s.b}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="text-center pt-8">
        <Link href="/" className="text-sm text-zinc-400 hover:text-rose-400 transition-colors underline underline-offset-4">← 返回首页</Link>
      </div>
    </div>
  );
}
