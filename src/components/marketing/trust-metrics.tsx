"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { CountUp } from "@/components/lightswind/count-up";

const metrics = [
  { value: 34, label: "متوسط زيادة الأرباح", suffix: "%" },
  { value: 28, label: "مزرعة تستخدم المنصة", suffix: "K+" },
  { value: 97, label: "دقة التوقعات", suffix: "%" },
  { value: 48, label: "كشف مبكر للأمراض", suffix: "h" },
];

export default function TrustMetricsBar() {
  return (
    <section dir="rtl" style={{ background: "#1E2B22" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1320px] mx-auto px-4 md:px-6 py-8 md:py-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center">
              <CountUp
                value={m.value}
                suffix={m.suffix}
                duration={2}
                animationStyle="energetic"
                colorScheme="custom"
                customColor={COLORS.aqua}
                numberClassName="font-display text-4xl md:text-5xl font-black"
              />
              <span className="text-sm mt-1" style={{ color: "#C4BCB0" }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
