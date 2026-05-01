"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";

interface LogoMarkProps {
  size?: "sm" | "lg" | "hero";
  interactive?: boolean;
}

const sizeMap = {
  sm: "w-7 h-7",
  lg: "w-12 h-12",
  hero: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40",
};

export default function LogoMark({ size = "lg", interactive = false }: LogoMarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 24 });

  const rotateX = useTransform(springY, [-1, 1], [10, -10]);
  const rotateY = useTransform(springX, [-1, 1], [-10, 10]);

  useMotionValueEvent(springX, "change", (v) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--glow-x", `${50 + v * 14}%`);
    }
  });
  useMotionValueEvent(springY, "change", (v) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--glow-y", `${50 + v * 14}%`);
    }
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(dx);
    mouseY.set(dy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${sizeMap[size]} select-none block`}
    >
      {/* 外呼吸光环 */}
      <motion.div
        className="absolute -inset-4 sm:-inset-6 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(251,113,133,0.5) 0%, transparent 70%)",
        }}
        animate={{ scale: [0.88, 1.12, 0.88], opacity: [0.15, 0.48, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 次级光晕 — 错相呼吸 */}
      <motion.div
        className="absolute -inset-2 sm:-inset-3 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(251,191,36,0.4) 0%, transparent 60%)",
        }}
        animate={{ scale: [1.05, 0.9, 1.05], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      />

      {/* 左圆 — rose */}
      <motion.div
        className="absolute w-[62%] h-[62%] rounded-full bg-gradient-to-br from-rose-400 via-rose-400 to-pink-500 shadow-[0_0_30px_rgba(251,113,133,0.5)]"
        style={{ top: "8%", left: "2%" }}
        animate={{ scale: [1, 1.04, 1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 右圆 — amber */}
      <motion.div
        className="absolute w-[62%] h-[62%] rounded-full bg-gradient-to-br from-amber-400 via-amber-400 to-pink-400 shadow-[0_0_30px_rgba(251,191,36,0.45)]"
        style={{ top: "30%", right: "2%" }}
        animate={{ scale: [1, 1.03, 1.04, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
      />

      {/* 交叠高光 */}
      <motion.div
        className="absolute w-[35%] h-[35%] rounded-full bg-white/25 blur-sm"
        style={{ top: "24%", left: "28%" }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

    </motion.div>
  );
}
