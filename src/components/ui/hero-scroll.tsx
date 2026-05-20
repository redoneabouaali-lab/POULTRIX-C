"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { COLORS } from "@/constants";

function StrikeWord({
  children,
  progress,
  idx,
  total,
}: {
  children: string;
  progress: MotionValue<number>;
  idx: number;
  total: number;
}) {
  const span = 0.55;
  const gap = 0.035;
  const part = (span - gap * (total - 1)) / total;
  const start = idx * (part + gap);
  const mid = start + part * 0.35;
  const end = start + part;

  const strikeX = useTransform(progress, [start, mid], [0, 1]);
  const opacity = useTransform(progress, [start, start + part * 0.7], [1, 0]);

  return (
    <span className="relative inline-block">
      <motion.span className="block" style={{ opacity }}>
        {children}
      </motion.span>
      <motion.span
        className="absolute left-0 top-[0.55em] h-[1px] md:h-[2px] origin-left"
        style={{ scaleX: strikeX, background: "#fff", right: 0 }}
      />
    </span>
  );
}

function HeadingBlock({ progress }: { progress: MotionValue<number> }) {
  const words = [
    { text: "+34%", replacement: "+45%" as const },
    { text: "بالذكاء", replacement: "بالمراقبة" as const },
    { text: "الاصطناعي", replacement: "الذكية" as const },
  ];
  const total = words.length;

  return (
    <div className="relative text-white">
      <div className="text-[clamp(2.2rem,6vw,4.8rem)] font-display leading-[1.08]" style={{ letterSpacing: "-0.03em" }}>
        زد أرباحك لـ{' '}
        <span style={{ color: COLORS.aqua }}>+45%</span>{' '}
        بالمراقبة الذكية
      </div>

      <div className="absolute top-0 right-0 left-0 text-[clamp(2.2rem,6vw,4.8rem)] font-display leading-[1.08]" style={{ letterSpacing: "-0.03em" }}>
        زد أرباحك لـ{' '}
        {words.map((w, i) => (
          <span key={w.text}>
            <StrikeWord progress={progress} idx={i} total={total}>
              {w.text}
            </StrikeWord>
            {i < total - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

function Eyebrow({ labelO, labelY }: { labelO: MotionValue<number>; labelY: MotionValue<number> }) {
  return (
    <motion.div className="mb-4 md:mb-5" style={{ opacity: labelO, y: labelY }}>
      <span
        className="inline-block text-[0.55rem] md:text-xs font-bold tracking-[0.25em]"
        style={{ color: `${COLORS.aqua}99` }}
      >
        لمنصات الدواجن الذكية
      </span>
    </motion.div>
  );
}

function Subtitle({ subO, subY }: { subO: MotionValue<number>; subY: MotionValue<number> }) {
  return (
    <motion.p
      className="text-sm md:text-base leading-relaxed max-w-xl"
      style={{ opacity: subO, y: subY, color: "#6A6A62" }}
    >
      منصة ذكاء اصطناعي كتوقع المشكل قبل 48 ساعة، تراقب الضيعة فوراً، وتدبر الحظائر
    </motion.p>
  );
}

function HeroContent({ progress }: { progress: MotionValue<number> }) {
  const labelO = useTransform(progress, [0, 0.08], [1, 0]);
  const labelY = useTransform(progress, [0, 0.08], [0, -6]);
  const subO2 = useTransform(progress, [0.06, 0.14], [0, 1]);
  const subO = useTransform(progress, [0.22, 0.3], [1, 0]);
  const subY = useTransform(progress, [0.06, 0.14], [6, 0]);

  return (
    <div
      className="sticky top-0 h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: "#0C0C08" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] noise-overlay" />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 md:px-12">
        <Eyebrow labelO={labelO} labelY={labelY} />
        <HeadingBlock progress={progress} />
        <Subtitle subO={subO2} subY={subY} />
      </div>
    </div>
  );
}

export default function HeroScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroProg = useTransform(scrollYProgress, [0, 0.55], [0, 1]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <HeroContent progress={heroProg} />
    </section>
  );
}
