import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hover DATE | 兰州高校专属匹配",
    template: "%s | Hover DATE",
  },
  description:
    "仅限 .edu.cn 校园邮箱认证，深度灵魂问卷算法匹配，每周二晚 9:00 掉落结果。兰州大学生的专属 Drop。",
  keywords: ["兰州大学", "交友", "匹配", "校园", "恋爱", "DATE", "Hover"],
  openGraph: {
    title: "Hover DATE — 兰州高校专属匹配",
    description: "每周二晚 9 点，遇见频率相同的人。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-[#0b0806] text-[#f0ebe4] selection:bg-rose-500/30">
        <Header />
        {children}
      </body>
    </html>
  );
}
