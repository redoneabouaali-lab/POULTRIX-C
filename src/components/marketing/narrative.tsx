"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { COLORS } from "@/constants";
import { Brain, BarChart3, ShieldCheck, AlertTriangle, Users, Zap, Check } from "lucide-react";

/* ─── Double-Bezel Card ─── */

function DoubleBezelCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className="spring-transition" style={{ background: "rgba(0,0,0,0.03)", padding: "1.5px", borderRadius: "2rem", border: "1px solid rgba(0,0,0,0.04)", ...style }}>
      <div className="overflow-hidden" style={{ borderRadius: "calc(2rem - 0.375rem)", background: "#ffffff", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5)" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Animated Counter ─── */

function AnimatedCounter({ value, label, color, suffix = "" }: { value: number; label: string; color: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(value / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(interval); }
      else setCount(start);
    }, duration / 60);
    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-black tabular-nums font-metric" style={{ color, letterSpacing: "-0.02em" }}>{count}{suffix}</p>
      <p className="text-xs font-medium mt-1" style={{ color: "#5A6A5A", fontSize: "0.75rem" }}>{label}</p>
    </div>
  );
}

/* ─── Bento Feature Card ─── */

function BentoCard({ icon: Icon, title, desc, color, imgSrc, index }: {
  icon: any; title: string; desc: string; color: string; imgSrc: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden spring-hover micro-shimmer"
      style={{ aspectRatio: "4/3", minHeight: 220, borderRadius: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
    >
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${imgSrc})` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(255,255,255,0.95) 100%)" }} />

      <div className="absolute inset-0 p-1.5">
        <div className="w-full h-full rounded-[1.5rem] flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon size={13} style={{ color }} />
            </div>
            <p className="text-sm font-bold" style={{ color: "#1E2B22" }}>{title}</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#5A6A5A", fontSize: "0.7rem" }}>{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Pricing Card ─── */

function PricingCard({ name, price, period, desc, features, popular, color, cta, index }: {
  name: string; price: string; period: string; desc: string; features: string[];
  popular: boolean; color: string; cta: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="relative"
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
          style={{ background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`, color: "#000" }}>
          الأكثر طلباً
        </div>
      )}
      <DoubleBezelCard style={{ height: "100%" }}>
        <div className="p-6 flex flex-col h-full" style={{ background: popular ? `${COLORS.aqua}04` : "#fff" }}>
          <div className="space-y-3 mb-6">
            <p className="text-lg font-bold" style={{ color: "#1E2B22" }}>{name}</p>
            <p className="text-xs" style={{ color: "#5A6A5A", fontSize: "0.75rem" }}>{desc}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tabular-nums font-metric" style={{ color: "#1E2B22" }}>{price}</span>
              <span className="text-xs" style={{ color: "#7A8A7A" }}>{period}</span>
            </div>
          </div>
          <ul className="space-y-2 flex-1">
            {features.map((f, j) => (
              <li key={j} className="flex items-center gap-2 text-sm">
                <Check size={13} style={{ color }} />
                <span style={{ color: "#5A6A5A", fontSize: "0.75rem" }}>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a href="/sign-up" className="group relative inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-sm font-bold spring-transition hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: popular ? `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})` : "rgba(0,0,0,0.04)",
                color: popular ? "#000" : "#5A6A5A",
                border: popular ? "none" : "1px solid rgba(0,0,0,0.06)",
              }}>
              <span>{cta}</span>
              {popular && (
                <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </a>
          </div>
        </div>
      </DoubleBezelCard>
    </motion.div>
  );
}

/* ─── Infinite Marquee ─── */

function InfiniteMarquee() {
  const partners = ["دواجن الأطلس", "تمارة پولتري", "المزارع الخضراء", "بياض بريس", "فلاحة مكناس", "أطلس دواجن", "الفلاحة الذكية", "فيلاج فلاحي"];
  const items = [...partners, ...partners, ...partners];
  const colors = [COLORS.aqua, COLORS.blue, COLORS.gold, COLORS.cream, COLORS.aqua, COLORS.blue, COLORS.gold, COLORS.cream];
  const dajajColors = ["#C4893A", "#2D5541", "#BF7A5A", "#F5EDE3"];

  return (
    <div className="overflow-hidden py-6" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <motion.div
        className="flex gap-4 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap spring-transition hover:scale-105"
            style={{
              background: `${colors[i % colors.length]}15`,
              border: `1px solid ${colors[i % colors.length]}25`,
            }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill={colors[i % colors.length]}>
              <circle cx="3" cy="3" r="3" />
            </svg>
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#5A6A5A" }}>
              {name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Live User Counter ─── */

function LiveUserCounter() {
  const [count, setCount] = useState(28470);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setCount(prev => prev + Math.floor(Math.random() * 3)), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-medium glass-light">
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: COLORS.aqua }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <Users size={12} style={{ color: "#5A6A5A" }} />
      <span className="tabular-nums font-bold font-metric" style={{ color: "#1E2B22" }}>{mounted ? count.toLocaleString("ar-MA") : "28,470"}</span>
      <span style={{ color: "#5A6A5A" }}>مزارع يستخدمون POULTRIX الآن</span>
    </div>
  );
}

/* ─── Scarcity Badge ─── */

function ScarcityBadge() {
  const [spots, setSpots] = useState(128);
  useEffect(() => {
    const t = setInterval(() => setSpots(prev => Math.max(0, prev - Math.floor(Math.random() * 2))), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: COLORS.gold }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-xs font-bold tabular-nums font-metric" style={{ color: COLORS.gold, fontSize: "0.7rem" }}>
        {spots} بقعة متبقية بسعر الـ Pro — 30% خصم مدى الحياة
      </span>
    </div>
  );
}

/* ─── Wikipedia Image Fetcher ─── */

const WIKI_IMAGES: Record<string, string> = {
  "chicken-dashboard": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop",
  "chicken-barn": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
  "farmer-phone": "https://images.unsplash.com/photo-1599058918144-1ff0d4e9e4d0?w=400&h=300&fit=crop",

};

/* ─── Main Narrative Flow ─── */

export default function NarrativeFlow() {
  const features = [
    { icon: BarChart3, title: "لوحة القيادة", desc: "كل المؤشرات الحية ديال الضيعة في مكان واحد — النفوق، العلف، الماء، والربح.", color: COLORS.aqua, imgSrc: WIKI_IMAGES["chicken-dashboard"] },
    { icon: Brain, title: "التوقعات الذكية", desc: "الـ AI كيتوقع المشكل قبل 48 ساعة من الوقوع — تنبيه استباقي بلا مفاجآت.", color: COLORS.blue, imgSrc: WIKI_IMAGES["chicken-barn"] },
    { icon: AlertTriangle, title: "التنبيهات الفورية", desc: "تنبيه فوري عند أي تغير في الحرارة، العلف، أو الماء — حتى فالتلفون.", color: COLORS.gold, imgSrc: WIKI_IMAGES["farmer-phone"] },
  ];

  const plans = [
    { name: "مجاني", price: "0", period: "دائماً", desc: "للبداية والتعرف على المنصة", features: ["حظيرة واحدة", "مؤشرات أساسية", "تاريخ 7 أيام", "تنبيهات البريد"], popular: false, color: COLORS.cream, cta: "ابدأ مجاناً" },
    { name: "Pro", price: "299", period: "DH/شهر", desc: "للمزارع المتوسطة والاحترافية", features: ["6 حظائر", "توقعات AI", "تاريخ سنة كاملة", "تقارير مالية", "تنبيهات فورية", "دعم فوري"], popular: true, color: COLORS.aqua, cta: "جرب 30 يوم مجاناً" },
    { name: "Enterprise", price: "899", period: "DH/شهر", desc: "للشركات والحظائر الكبيرة", features: ["غير محدود الحظائر", "AI متقدم", "تاريخ غير محدود", "تحليلات مالية", "API كامل", "SLA 99.9%", "مدير حساب مخصص"], popular: false, color: COLORS.gold, cta: "اتصل بنا" },
  ];

  return (
    <FlowArt>
      {/* ────── SLIDE 1: المشكلة والحل (Problem + Solution) ────── */}
      <FlowSection aria-label="المشكلة والحل" style={{
        background: `linear-gradient(180deg, #FAF7F2 0%, #F5EDE3 100%)`
      }}>
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[1320px] mx-auto py-16 md:py-28">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 mx-auto"
            style={{ background: `${COLORS.gold}15` }}
          >
            <Zap size={10} style={{ color: COLORS.gold }} />
            <span className="section-label" style={{ color: COLORS.gold }}>الذكاء الاصطناعي لتدبير الضيعات</span>
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-divider mb-6"
          />

          {/* H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-4 w-full max-w-5xl mx-auto"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            <span className="block font-display" style={{ color: "#1E2B22" }}>37% من أرباحك تضيع ونتا ما كتعرفش</span>
            <span className="block mt-1 font-display text-gradient-accent">POULTRIX كتحل المشكل بالذكاء الاصطناعي</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm md:text-base text-center w-full max-w-2xl mx-auto mb-10"
            style={{ color: "#5A6A5A", lineHeight: 1.8 }}
          >
            منصة ذكاء اصطناعي كتحول ضيعتك إلى عملية رقمية متكاملة — مراقبة حية، توقعات دقيقة، وتدبير تلقائي.
          </motion.p>

          {/* Animated Counters */}
          <div className="flex items-center justify-center gap-10 md:gap-16 mb-14">
            <AnimatedCounter value={12} label="معدل النفوق السنوي" color={COLORS.gold} suffix="%" />
            <AnimatedCounter value={847} label="تكلفة كل طير (درهم)" color={COLORS.gold} suffix="" />
            <AnimatedCounter value={42} label="هدر في العلف يومياً" color={COLORS.gold} suffix="%" />
          </div>

          {/* Bento Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {features.map((f, i) => <BentoCard key={i} {...f} index={i} />)}
          </div>

          {/* Ornamental Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 my-16"
          >
            <div className="section-divider" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill={COLORS.aqua}><circle cx="4" cy="4" r="4" /></svg>
            <div className="section-divider" style={{ background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.gold})` }} />
          </motion.div>

        </div>
      </FlowSection>

      {/* ────── SLIDE 2: النتائج وابدأ دابا (Results + Action) ────── */}
      <FlowSection aria-label="النتائج والتسعير" style={{
        background: `linear-gradient(180deg, #FAF7F2 0%, #F5EDE3 100%)`
      }}>
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[1320px] mx-auto py-16 md:py-28">
          {/* Live User Counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <LiveUserCounter />
          </motion.div>

          {/* Stats Counters */}
          <div className="flex items-center justify-center gap-10 md:gap-16 mb-14">
            <AnimatedCounter value={28470} label="مزارع يثقو فينا" color={COLORS.aqua} suffix="+" />
            <AnimatedCounter value={97} label="دقة التوقعات" color={COLORS.blue} suffix="%" />
            <AnimatedCounter value={34} label="زيادة الربح" color={COLORS.gold} suffix="%" />
          </div>

          {/* Infinite Marquee Partners */}
          <div className="mb-14">
            <InfiniteMarquee />
          </div>

          {/* Ornamental Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 my-12"
          >
            <div className="section-divider" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill={COLORS.gold}><circle cx="4" cy="4" r="4" /></svg>
            <div className="section-divider" style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.aqua})` }} />
          </motion.div>

          {/* Pricing Section */}
          <div className="text-center mb-6">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-label block text-center mb-3"
            >
              الخطط والتسعير
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="section-divider mb-5"
            />
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mt-2 mb-4"
              style={{ color: "#1E2B22", letterSpacing: "-0.02em" }}
            >
              ابدأ الرحلة — اختر خطتك
            </motion.h3>

            {/* Scarcity + Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center gap-3 mb-8"
            >
              <ScarcityBadge />
              <div className="flex items-center gap-2">
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill={COLORS.gold}>
                    <polygon points="6,0 7.5,4 12,4 8.5,7 10,12 6,9 2,12 3.5,7 0,4 4.5,4" />
                  </svg>
                ))}
                <span className="text-xs font-bold" style={{ color: COLORS.gold }}>4.9/5</span>
                <span className="text-xs" style={{ color: "#7A8A7A" }}>من 2,847 مزارع</span>
              </div>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {plans.map((p, i) => <PricingCard key={i} {...p} index={i} />)}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs"
            style={{ color: "#7A8A7A" }}
          >
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} style={{ color: COLORS.aqua }} /> SSL مشفر</div>
            <div className="flex items-center gap-1.5"><Zap size={12} style={{ color: COLORS.gold }} /> 99.9% Uptime</div>
            <div className="flex items-center gap-1.5"><Users size={12} style={{ color: COLORS.blue }} /> دعم 24/7</div>
            <div className="flex items-center gap-1.5"><Check size={12} style={{ color: COLORS.blue }} /> إلغاء في أي وقت</div>
          </motion.div>
        </div>
      </FlowSection>
    </FlowArt>
  );
}
