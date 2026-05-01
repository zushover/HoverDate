"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LogoMark from "@/components/LogoMark";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [matchStatus, setMatchStatus] = useState<"none" | "submitted" | "matched">("none");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    const checkStatus = () => {
      const email = localStorage.getItem("hoverdate_email");
      if (email) {
        const submitted = localStorage.getItem("hoverdate_submitted");
        if (submitted === "true") setMatchStatus("submitted");
      }
    };
    checkStatus();
    window.addEventListener("storage", checkStatus);
    window.addEventListener("focus", checkStatus);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("storage", checkStatus);
      window.removeEventListener("focus", checkStatus);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* 磨砂背景层 — 独立于内容，避免 border 过渡白边 */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          scrolled
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[#0b0806]/90" />
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
      {/* 底部阴影 — 独立过渡 */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out pointer-events-none ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        }}
      />
      <div className="relative max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex items-center justify-center shrink-0"
          >
            <LogoMark size="sm" />
          </motion.div>
          <span className="text-lg font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">Hover</span>
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">DATE</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-5">
          <Link
            href="/about"
            className={`text-sm transition-colors duration-300 ${
              scrolled ? "text-zinc-400 hover:text-white" : "text-zinc-300/80 hover:text-white"
            }`}
          >
            关于
          </Link>
          <Link
            href="/status"
            className={`text-sm transition-colors duration-300 ${
              scrolled ? "text-zinc-400 hover:text-white" : "text-zinc-300/80 hover:text-white"
            }`}
          >
            我的匹配
          </Link>

          <Link href="/status" className="flex items-center gap-2 group">
            <span className="relative flex h-2.5 w-2.5">
              {matchStatus === "matched" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-500 ${
                  matchStatus === "matched"
                    ? "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]"
                    : matchStatus === "submitted"
                      ? "bg-rose-400/60"
                      : "bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </span>
            <span
              className={`text-xs transition-colors duration-300 ${
                scrolled ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400/70 group-hover:text-white"
              }`}
            >
              {matchStatus === "matched" ? "匹配已到" : matchStatus === "submitted" ? "等待周二" : "未参与"}
            </span>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col gap-1 p-2 -mr-2"
          aria-label="菜单"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="w-5 h-px bg-zinc-400 block"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-px bg-zinc-400 block"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="w-5 h-px bg-zinc-400 block"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sm:hidden overflow-hidden bg-[#0b0806]/98 border-b border-white/[0.04]"
          >
            <div className="px-6 py-6 space-y-5">
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="block text-base text-zinc-300 hover:text-white transition-colors"
              >
                关于
              </Link>
              <Link
                href="/status"
                onClick={() => setMenuOpen(false)}
                className="block text-base text-zinc-300 hover:text-white transition-colors"
              >
                我的匹配
                <span className="ml-3 inline-flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full h-2 w-2 ${
                      matchStatus === "matched"
                        ? "bg-rose-400"
                        : matchStatus === "submitted"
                          ? "bg-rose-400/60"
                          : "bg-white/20"
                    }`}
                  />
                  <span className="text-xs text-zinc-500">
                    {matchStatus === "matched" ? "匹配已到" : matchStatus === "submitted" ? "等待周二" : "未参与"}
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
