import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hover DATE | 兰州高校专属认证",
  description: "每周二晚 9 点，遇见频率相同的人。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-zinc-950 text-white font-sans selection:bg-purple-500/40">
        {children}
      </body>
    </html>
  );
}