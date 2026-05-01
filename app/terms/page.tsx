import Link from "next/link";

const SECTIONS = [
  { t: "服务说明", b: "Hover DATE 是面向兰州高校学生的校园匹配平台。我们通过深度问卷和算法匹配，每周为用户提供一次匹配结果。" },
  { t: "资格要求", b: "你必须是在校大学生，并持有有效的 .edu.cn 校园邮箱。每人限注册一个账号。如果发现虚假信息，我们有权停止服务。" },
  { t: "用户行为", b: "你承诺在问卷中提供真实、准确的个人偏好信息。你理解匹配结果基于算法计算，不保证一定符合个人期望。" },
  { t: "知识产权", b: "Hover DATE 的名称、Logo、网站设计、问卷内容及匹配算法均为本平台的知识产权。未经许可不得复制或使用。" },
  { t: "免责声明", b: "本平台仅提供匹配建议，不对用户之间的实际交往结果负责。我们鼓励用户在交往过程中保持理性和安全。" },
  { t: "服务变更", b: "我们保留随时修改或终止服务的权利。重大变更会通过邮件提前通知。继续使用即视为接受更新后的条款。" },
];

export default function TermsPage() {
  return (
    <div className="z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-20 space-y-6">
      <section className="text-center space-y-3 pt-8 pb-8">
        <h1 className="text-3xl font-bold">服务条款</h1>
        <p className="text-zinc-500 text-xs">最后更新：2026年5月1日</p>
      </section>

      <section className="space-y-10">
        {SECTIONS.map((s, i) => (
          <div key={i} className="flex gap-6 group">
            <span className="text-6xl font-black text-amber-400/[0.05] flex-shrink-0 leading-none select-none tabular-nums w-14 text-right">
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
