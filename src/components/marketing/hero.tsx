"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "@/constants";
import { ArrowLeft } from "lucide-react";

/* ─── Ambient Background (quiet, visible, breathing) ─── */

function AmbientBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, ${COLORS.aqua}20 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 80%, ${COLORS.blue}20 0%, transparent 70%),
            linear-gradient(180deg, ${COLORS.cream} 0%, #F0EDE5 50%, ${COLORS.cream} 100%)
          `,
        }}
      />
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
      {/* Animated grid lines */}
      <motion.div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "0px 60px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── Hero ─── */

export default function HeroSection() {
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);

  return (
    <div dir="rtl">
      <section
        className="relative overflow-hidden flex items-center"
        style={{ background: COLORS.cream, minHeight: "100dvh" }}
      >
        <AmbientBg />

        <div className="relative z-20 max-w-[1320px] mx-auto px-4 md:px-6 w-full py-28 md:py-40">
          <div className="flex flex-col items-center text-center">
            {/* Blur-reveal headline */}
            <motion.h1
              initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
              animate={
                m
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { filter: "blur(8px)" }
              }
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display"
              style={{
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#1E2B22",
                maxWidth: 850,
              }}
            >
              زد أرباح ضيعتك بالذكاء الاصطناعي
            </motion.h1>

            {/* Subheadline — simple fade */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={m ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 md:mt-8 text-base md:text-lg max-w-[560px]"
              style={{ color: "#5A6A5A", lineHeight: 1.8 }}
            >
              منصة POULTRIX توقّع المرض قبل 48 ساعة وتراقب ضيعتك فوراً
            </motion.p>

            {/* CTAs — simple fade */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={m ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-10"
            >
              {/* Primary CTA */}
              <a
                href="/sign-up"
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm text-black spring-hover active:scale-[0.97]"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
                  boxShadow: "0 4px 24px rgba(196,137,58,0.35)",
                }}
              >
                <span>ابدأ شهراً مجاناً</span>
                <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a>

              {/* Secondary CTA */}
              <a
                href="/login"
                className="px-8 py-4 rounded-full text-sm font-medium spring-hover text-[#5A6A5A] hover:text-[#1E2B22] transition-colors duration-300"
              >
                تسجيل الدخول
              </a>
            </motion.div>

            {/* Secondary link below headline area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={m ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6"
            >
              <a
                href="/sign-up"
                className="inline-flex items-center gap-2 text-sm font-medium spring-hover"
                style={{ color: COLORS.aqua }}
              >
                <span>ابدأ شهراً مجاناً — بدون بطاقة بنكية</span>
                <ArrowLeft size={14} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
