"use client";

import { motion, type Variants } from "framer-motion";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.997, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.998,
    filter: "blur(1px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
