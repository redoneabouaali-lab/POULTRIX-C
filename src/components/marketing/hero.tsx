"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { ArrowLeft } from "lucide-react";
import { AuroraBackground } from "@/components/lightswind/aurora-background";

export default function HeroSection() {
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);

  return (
    <div dir="rtl">
      <AuroraBackground className="min-h-screen">
        <section className="relative overflow-hidden flex items-center w-full">
          <div className="relative z-20 max-w-[1320px] mx-auto px-4 md:px-6 w-full py-28 md:py-40">
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
                animate={m ? { opacity: 1, y: 0, filter: "blur(0px)" } : { filter: "blur(8px)" }}
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

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={m ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 md:mt-8 text-base md:text-lg max-w-[560px]"
                style={{ color: "#5A6A5A", lineHeight: 1.8 }}
              >
                منصة POULTRIX توقّع المرض قبل 48 ساعة وتراقب ضيعتك فوراً
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={m ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-10"
              >
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
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>

                <a
                  href="/login"
                  className="px-8 py-4 rounded-full text-sm font-medium spring-hover text-[#5A6A5A] hover:text-[#1E2B22] transition-colors duration-300"
                >
                  تسجيل الدخول
                </a>
              </motion.div>

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
      </AuroraBackground>
    </div>
  );
}
