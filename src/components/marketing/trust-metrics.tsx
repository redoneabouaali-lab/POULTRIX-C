"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "@/constants";

const metrics = [
  { value: "+34%", label: "متوسط زيادة الأرباح" },
  { value: "28K+", label: "مزرعة تستخدم المنصة" },
  { value: "97%", label: "دقة التوقعات" },
  { value: "48h", label: "كشف مبكر للأمراض" },
];

export default function TrustMetricsBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % metrics.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section dir="rtl" style={{ background: "#1E2B22" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          <AnimatePresence mode="wait">
            {metrics.map(
              (metric, idx) =>
                idx === i && (
                  <motion.div
                    key={metric.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 md:gap-6"
                  >
                    <span
                      className="font-display"
                      style={{
                        fontSize: "clamp(2.5rem, 5vw, 5rem)",
                        lineHeight: 1,
                        color: COLORS.aqua,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {metric.value}
                    </span>
                    <span
                      className="text-sm md:text-base"
                      style={{ color: "#C4BCB0", maxWidth: 140 }}
                    >
                      {metric.label}
                    </span>
                  </motion.div>
                )
            )}
          </AnimatePresence>
          <div className="flex md:mr-12 gap-2" dir="ltr">
            {metrics.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 24 : 6,
                  height: 6,
                  background: i === idx ? COLORS.aqua : "#5A6A5A",
                }}
                aria-label={`عرض مقياس ${metrics[idx].label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
