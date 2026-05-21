"use client";

import { type ReactNode, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";

type OrbTint = "rose" | "amber" | "indigo" | "violet" | "teal";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  backgroundImage?: boolean;
  backgroundSrc?: string;
  imageOpacity?: number;
  ambientOrbs?: boolean;
  orbTint?: OrbTint;
  orbIntensity?: "full" | "light" | "minimal";
}

const orbOpacity: Record<OrbTint, string> = {
  rose: "bg-rose-400",
  amber: "bg-amber-400",
  indigo: "bg-indigo-400",
  violet: "bg-violet-400",
  teal: "bg-teal-400",
};

const intensityMap = {
  full: { top: "/[0.15]", bottom: "/[0.10]" },
  light: { top: "/[0.08]", bottom: "/[0.05]" },
  minimal: { top: "/[0.04]", bottom: "/[0.02]" },
};

export default function PageShell({
  children,
  className = "",
  backgroundImage = false,
  backgroundSrc = "/background.jpg",
  imageOpacity = 0.22,
  ambientOrbs = true,
  orbTint = "rose",
  orbIntensity = "full",
}: PageShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const secondaryOrb = orbTint === "rose" ? "amber" : "rose";
  const intensity = intensityMap[orbIntensity];

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mouseX = useSpring(rawX, { stiffness: 120, damping: 24 });
  const mouseY = useSpring(rawY, { stiffness: 120, damping: 24 });

  const orbDx = useTransform(mouseX, [0, 1], [20, -20]);
  const orbDy = useTransform(mouseY, [0, 1], [16, -16]);
  const orb2Dx = useTransform(mouseX, [0, 1], [-14, 14]);
  const orb2Dy = useTransform(mouseY, [0, 1], [-10, 10]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth);
      rawY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  useMotionValueEvent(mouseX, "change", (v) => {
    if (shellRef.current) {
      shellRef.current.style.setProperty("--cursor-x", `${v * 100}%`);
    }
  });
  useMotionValueEvent(mouseY, "change", (v) => {
    if (shellRef.current) {
      shellRef.current.style.setProperty("--cursor-y", `${v * 100}%`);
    }
  });

  return (
    <main
      ref={shellRef}
      className={`relative min-h-screen text-[#f0ebe4] selection:bg-rose-500/30 overflow-x-hidden ${className}`}
    >
      {/* 最底层纯色 */}
      <div className="fixed inset-0 -z-20 bg-[#0b0806]" />

      {/* 背景图片 */}
      {backgroundImage && (
        <div
          className="fixed inset-0 -z-19 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundSrc}')`,
            opacity: imageOpacity,
          }}
        />
      )}

      {/* 背景图片渐变遮罩 */}
      {backgroundImage && (
        <div className="fixed inset-0 -z-18 bg-gradient-to-b from-[#0b0806]/50 via-transparent to-[#0b0806]/70" />
      )}

      {/* 环境光球 — 响应鼠标视差 */}
      {ambientOrbs && (
        <div className="fixed inset-0 -z-17 pointer-events-none">
          <motion.div
            className={`absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full ${orbOpacity[orbTint]}${intensity.top} blur-[220px] animate-orb-rose`}
            style={{ x: orbDx, y: orbDy }}
          />
          <motion.div
            className={`absolute bottom-1/4 left-0 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full ${orbOpacity[secondaryOrb]}${intensity.bottom} blur-[200px] animate-orb-gold`}
            style={{ x: orb2Dx, y: orb2Dy, animationDelay: "-6s" }}
          />
        </div>
      )}

      {/* 全局光标柔光 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(320px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(251,113,133,0.055) 0%, rgba(251,191,36,0.025) 40%, transparent 65%)",
        }}
      />

      {children}
    </main>
  );
}
