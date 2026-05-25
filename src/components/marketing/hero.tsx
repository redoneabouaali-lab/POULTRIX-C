"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { COLORS } from "@/constants";
import { ArrowLeft, Cpu, Sparkles, Shield, TrendingUp } from "lucide-react";
import { AuroraBackground } from "@/components/lightswind/aurora-background";
import { AuroraTextEffect } from "@/components/lightswind/aurora-text-effect";
import { DotPattern } from "@/components/lightswind/dot-pattern";
import { ShineButton } from "@/components/lightswind/shine-button";
const floatingIcons = [
  { Icon: Cpu, x: "5%", y: "15%", delay: 0, duration: 6, size: 28, color: COLORS.aqua },
  { Icon: Sparkles, x: "90%", y: "20%", delay: 0.5, duration: 7, size: 24, color: COLORS.gold },
  { Icon: Shield, x: "8%", y: "70%", delay: 1, duration: 8, size: 22, color: COLORS.blue },
  { Icon: TrendingUp, x: "88%", y: "75%", delay: 0.3, duration: 5.5, size: 26, color: "#81BABA" },
  { Icon: Cpu, x: "50%", y: "8%", delay: 0.8, duration: 9, size: 18, color: COLORS.aqua },
  { Icon: Sparkles, x: "50%", y: "85%", delay: 1.5, duration: 7.5, size: 20, color: COLORS.gold },
];

function FloatingIcon({ Icon, x, y, delay, duration, size, color }: any) {
  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.8, 0.2],
        scale: [0, 1, 0.8, 1.1, 1],
        y: [0, -20, 10, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div
        className="rounded-2xl flex items-center justify-center backdrop-blur-sm"
        style={{
          width: size * 2,
          height: size * 2,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 30px ${color}20`,
        }}
      >
        <Icon size={size} style={{ color }} />
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [m, setM] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setM(true); }, []);

  return (
    <div dir="rtl" ref={sectionRef} className="relative">
      <AuroraBackground className="min-h-screen">
        <section className="relative overflow-hidden flex items-center w-full min-h-screen">
          <DotPattern width={24} height={24} cx={1} cy={1} cr={0.8} className="fill-[#C4893A]/8" />

          {floatingIcons.map((item, i) => (
            <FloatingIcon key={i} {...item} />
          ))}

          <div className="relative z-20 max-w-[1320px] mx-auto px-4 md:px-6 w-full py-32 md:py-44">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
                animate={m ? { opacity: 1, y: 0, filter: "blur(0px)" } : { filter: "blur(8px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[1000px]"
              >
                <h1 className="sr-only">زد أرباح ضيعتك بالذكاء الاصطناعي — POULTRIX منصة ذكاء الدواجن لإدارة ضيعات الدجاج</h1>
                <AuroraTextEffect
                  text="زد أرباح ضيعتك بالذكاء الاصطناعي"
                  className="bg-transparent"
                  textClassName="font-display !text-[#1E2B22]"
                  fontSize="clamp(3.5rem, 8vw, 6.5rem)"
                  colors={{
                    first: "bg-[#C4893A]",
                    second: "bg-[#81BABA]",
                    third: "bg-[#4A90D9]",
                    fourth: "bg-[#D4A853]",
                  }}
                  blurAmount="blur-lg"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={m ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 md:mt-10 text-lg md:text-xl max-w-[640px]"
                style={{ color: "#5A6A5A", lineHeight: 1.8 }}
              >
                منصة POULTRIX توقّع المرض قبل 48 ساعة وتراقب ضيعتك فوراً — 
                <span className="font-semibold" style={{ color: COLORS.aqua }}> بدون أجهزة معقدة</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={m ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-12"
              >
                <ShineButton
                  label="ابدأ شهراً مجاناً"
                  size="lg"
                  onClick={() => window.location.href = "/sign-up"}
                  bgColor="linear-gradient(325deg, #C4893A 0%, #81BABA 55%, #C4893A 90%)"
                />

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
                className="mt-8"
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