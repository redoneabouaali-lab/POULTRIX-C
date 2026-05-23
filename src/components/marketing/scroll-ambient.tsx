"use client";

import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Cpu } from "lucide-react";
import { COLORS } from "@/constants";

const orbs = [
  { size: 80, x: "12%", y: "20%", color: COLORS.aqua, delay: 0, duration: 12 },
  { size: 60, x: "85%", y: "35%", color: COLORS.gold, delay: 2, duration: 15 },
  { size: 50, x: "20%", y: "70%", color: COLORS.blue, delay: 4, duration: 10 },
  { size: 70, x: "80%", y: "80%", color: "#81BABA", delay: 1, duration: 14 },
  { size: 40, x: "50%", y: "10%", color: COLORS.aqua, delay: 3, duration: 11 },
  { size: 45, x: "45%", y: "90%", color: COLORS.gold, delay: 5, duration: 13 },
];

function Orb({ size, x, y, color, delay, duration }: typeof orbs[0]) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -30, 15, -20, 0],
        x: [0, 15, -10, 20, 0],
        opacity: [0.15, 0.3, 0.2, 0.35, 0.15],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}15, ${color}05, transparent)`,
          filter: "blur(30px)",
        }}
      />
    </motion.div>
  );
}

export default function ScrollAmbient() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  return (
    <>
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {orbs.map((o, i) => <Orb key={i} {...o} />)}
      </div>

      {/* Scroll progress bar (right edge) */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-[2px] z-50 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.gold}, ${COLORS.aqua})`,
          scaleY: progress,
          transformOrigin: "top",
          opacity: 0.6,
        }}
      />

      {/* Scroll progress dot */}
      <motion.div
        className="fixed right-[-3px] w-[8px] h-[8px] rounded-full z-50 pointer-events-none"
        style={{
          background: COLORS.aqua,
          boxShadow: `0 0 8px ${COLORS.aqua}60`,
          top: `${progress * 100}%`,
          translateY: "-50%",
          opacity: progress > 0.02 ? 0.8 : 0,
        }}
      />
    </>
  );
}
