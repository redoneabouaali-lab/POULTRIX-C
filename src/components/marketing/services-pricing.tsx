"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Check, Bird, TrendingUp, Building2, Shield, Users, HeadphonesIcon } from "lucide-react";
import { ShineButton } from "@/components/lightswind/shine-button";

const plans = [
  {
    name: "بداية",
    subtitle: "للضيعات الصغيرة",
    price: "مجاني",
    period: "شهر واحد",
    icon: Bird,
    from: COLORS.aqua,
    to: "#81BABA",
    features: [
      "مراقبة ضيعة واحدة",
      "تحديثات كل ساعة",
      "تقارير أساسية",
      "تنبيهات فورية",
      "دعم عبر البريد",
    ],
    cta: "ابدأ مجاناً",
    popular: false,
  },
  {
    name: "نمو",
    subtitle: "للضيعات المتوسطة",
    price: "299",
    period: "درهم/شهر",
    icon: TrendingUp,
    from: COLORS.gold,
    to: COLORS.aqua,
    features: [
      "مراقبة حتى 5 ضيعات",
      "تحديثات في الوقت الحقيقي",
      "تقارير وتحليلات متقدمة",
      "توقعات بالذكاء الاصطناعي",
      "كشف مبكر للأمراض (48h)",
      "دعم عبر الهاتف والدردشة",
    ],
    cta: "اختر النمو",
    popular: true,
  },
  {
    name: "احترافية",
    subtitle: "للشركات الكبرى",
    price: "799",
    period: "درهم/شهر",
    icon: Building2,
    from: "#2D5541",
    to: COLORS.aqua,
    features: [
      "مراقبة ضيعات غير محدودة",
      "واجهة تحكم مخصصة",
      "API للتكامل مع أنظمتك",
      "تحليلات متقدمة + تنبؤات",
      "مدير حساب مخصص",
      "تدريب الفريق وتأهيله",
      "دعم فوري 24/7",
    ],
    cta: "اختر الاحترافية",
    popular: false,
  },
];

const guarantees = [
  { icon: Shield, text: "إلغاء في أي وقت. لا التزام" },
  { icon: Users, text: "دعم فني بالدارجة" },
  { icon: HeadphonesIcon, text: "تأهيل مجاني خلال 48 ساعة" },
];

export default function ServicesPricingSection() {
  return (
    <section id="pricing" className="relative py-28 md:py-36 overflow-hidden" dir="rtl" style={{ background: "#FAF7F2" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="section-label block mb-3">الباقات والأسعار</span>
          <div className="section-divider mb-5" />
          <h2 className="text-4xl md:text-6xl font-black font-display leading-[0.9] mb-4" style={{ color: "#1E2B22", letterSpacing: "-0.03em" }}>
            اختر الباقة اللي تناسبك
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#5A6A5A" }}>
            من ضيعة صغيرة إلى شركة كبرى — عندنا الحل المناسب. أول شهر مجاناً، بدون بطاقة بنكية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, idx) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-[0.65rem] font-bold tracking-[0.12em]"
                  style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.aqua})`, color: "#fff" }}>
                  الأكثر طلباً
                </div>
              )}
              <div className="relative h-full p-[1px] rounded-[1.5rem]" style={{
                background: plan.popular
                  ? `linear-gradient(135deg, ${COLORS.gold}40, ${COLORS.aqua}30)`
                  : `linear-gradient(135deg, ${plan.from}15, ${plan.to}08)`,
              }}>
                <div className="rounded-[calc(1.5rem-0.25rem)] h-full overflow-hidden" style={{
                  background: plan.popular ? "#FAF7F2" : "#FFFFFF",
                  boxShadow: plan.popular ? "0 8px 40px rgba(196,137,58,0.12)" : "0 2px 20px rgba(0,0,0,0.03)",
                }}>
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${plan.from}20, ${plan.to}15)` }}>
                        <plan.icon size={24} style={{ color: plan.from }} />
                      </div>
                    </div>

                    <h3 className="font-heading text-2xl font-bold mb-1" style={{ color: "#1E2B22" }}>{plan.name}</h3>
                    <p className="text-sm mb-4" style={{ color: "#7A8A7A" }}>{plan.subtitle}</p>

                    <div className="mb-6">
                      <span className="text-4xl md:text-5xl font-black font-display" style={{ color: "#1E2B22" }}>{plan.price}</span>
                      {plan.period && <span className="text-xs font-medium mr-1" style={{ color: "#7A8A7A" }}>{plan.period}</span>}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-sm" style={{ color: "#1E2B22" }}>
                          <Check size={16} style={{ color: plan.from }} className="flex-shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <ShineButton
                      label={plan.cta}
                      size="md"
                      className="w-full"
                      onClick={() => window.location.href = "/sign-up"}
                      bgColor={plan.popular
                        ? "linear-gradient(325deg, #C4893A 0%, #81BABA 55%, #C4893A 90%)"
                        : `linear-gradient(325deg, ${plan.from}99, ${plan.to}66)`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 md:gap-8 mt-10 text-xs flex-wrap" style={{ color: "#7A8A7A" }}>
          {guarantees.map((g) => (
            <div key={g.text} className="flex items-center gap-1.5">
              <g.icon size={12} style={{ color: COLORS.aqua }} />
              {g.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
