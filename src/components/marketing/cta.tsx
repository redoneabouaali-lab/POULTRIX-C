"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/constants";
import { Cpu, Shield, Users, Check, Sparkles } from "lucide-react";
import { ShineButton } from "@/components/lightswind/shine-button";

export default function CTASection() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden px-4 py-28 md:py-36" dir="rtl"
      style={{ background: `linear-gradient(135deg, ${COLORS.aqua}20, ${COLORS.blue}10, ${COLORS.cream}20, ${COLORS.aqua}10)` }}>
      <motion.div className="absolute pointer-events-none" style={{ top: "15%", right: "5%", width: 80, height: 80 }}
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <svg width="80" height="80" viewBox="-30 -30 60 60"><rect x="-20" y="-20" width="40" height="40" rx="8" fill={COLORS.aqua} opacity="0.15" /></svg>
      </motion.div>
      <motion.div className="absolute pointer-events-none" style={{ bottom: "20%", left: "8%", width: 50, height: 50 }}
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <svg width="50" height="50" viewBox="-30 -30 60 60"><circle cx="0" cy="0" r="20" fill={COLORS.gold} opacity="0.12" /></svg>
      </motion.div>

      <div className="relative z-10 text-center w-full max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
          <span className="section-label block text-center mb-4">أبدا دابا</span>
          <div className="section-divider mb-6" />

          <h2 className="text-4xl md:text-6xl font-black font-display leading-[0.9]" style={{ color: "#1E2B22", letterSpacing: "-0.03em" }}>خدم بالذكاء...</h2>
          <h2 className="text-4xl md:text-6xl font-black font-display leading-[0.9] text-gradient-accent">ماشي بالتخمين</h2>
          <p className="text-base md:text-lg font-light max-w-lg mx-auto" style={{ color: "#5A6A5A" }}>منصة ذكاء حية. مراقبة فورية. توقعات بالذكاء الاصطناعي. دقة مالية.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <ShineButton
              label="ابدأ شهراً مجاناً"
              size="lg"
              onClick={() => window.location.href = "/sign-up"}
              bgColor="linear-gradient(325deg, #C4893A 0%, #81BABA 55%, #C4893A 90%)"
            />
            <a href="/login"
              className="px-8 py-4 rounded-full text-sm font-medium spring-hover glass-light"
              style={{ color: "#5A6A5A" }}>
              عندي حساب
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs flex-wrap" style={{ color: "#7A8A7A" }}>
            <div className="flex items-center gap-1.5"><Shield size={12} style={{ color: COLORS.aqua }} /> بدون بطاقة بنكية</div>
            <div className="flex items-center gap-1.5"><Users size={12} style={{ color: COLORS.gold }} /> إلغاء في أي وقت</div>
            <div className="flex items-center gap-1.5"><Check size={12} style={{ color: "#2D5541" }} /> دعم فوري</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
