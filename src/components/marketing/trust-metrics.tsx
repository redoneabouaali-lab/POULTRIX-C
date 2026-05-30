"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, Eye } from "lucide-react";
import { COLORS } from "@/constants";
import { CountUp } from "@/components/lightswind/count-up";

const metrics = [
  { value: 34, label: "متوسط زيادة الأرباح", suffix: "%", icon: TrendingUp, color: COLORS.aqua },
  { value: 28, label: "مزرعة تستخدم المنصة", suffix: "K+", icon: Users, color: COLORS.blue },
  { value: 97, label: "دقة التوقعات", suffix: "%", icon: Activity, color: COLORS.gold },
  { value: 48, label: "كشف مبكر للأمراض", suffix: "h", icon: Eye, color: COLORS.aqua },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrustMetricsBar() {
  return (
    <section dir="rtl" style={{ background: "#1E2B22" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {metrics.map((m) => (
            <motion.div
              key={m.label}
              variants={cardVariants}
              className="relative overflow-hidden rounded-2xl p-[1px]"
              style={{ background: `linear-gradient(135deg, ${m.color}40, ${m.color}10)` }}
            >
              <div
                className="rounded-[calc(1rem-0.25px)] h-full p-5 md:p-6 flex flex-col items-center text-center relative"
                style={{ background: "#1A2D23" }}
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }}
                />

                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${m.color}18` }}
                >
                  <m.icon size={18} style={{ color: m.color }} />
                </div>

                {/* CountUp with brand color */}
                <CountUp
                  value={m.value}
                  suffix={m.suffix}
                  duration={2}
                  animationStyle="energetic"
                  colorScheme="custom"
                  customColor={m.color}
                  numberClassName="!text-3xl md:!text-4xl !font-black !font-display"
                />

                {/* Label */}
                <span className="text-xs md:text-sm mt-1.5 leading-relaxed" style={{ color: "#C4BCB0" }}>
                  {m.label}
                </span>

                {/* Subtle shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{ background: `linear-gradient(135deg, ${m.color}, transparent 50%)` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
