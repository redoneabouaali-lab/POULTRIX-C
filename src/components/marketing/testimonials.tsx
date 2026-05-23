"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "عبد الرحمن",
    location: "الدار البيضاء",
    before: "كنت كنعتمد على التخمين فالتغذية والعلاج",
    after: "الربح زاد ب 40%",
    stat: "+40%",
    statLabel: "فشهر واحد",
    quote: "من قبل، النفوق كان كايديني فلوس بزاف والبيوطري كل أسبوع. دابا المنصة كتقطعلنا التوقعات قبل 48 ساعة — وفرنا 3 جولات للبيوطري فالشهر. الصراحة خدمة ذهبية.",
    color: COLORS.aqua,
  },
  {
    name: "فاطمة",
    location: "مراكش",
    before: "كنت كنقلق على الضيعة كل ما نسافر",
    after: "الخسائر نقصو ب 60%",
    stat: "-60%",
    statLabel: "خسائر أقل",
    quote: "هاد التطبيق قلب حياتي. دابا كنجي نشوف التلفون ونعرف شنو كاين فالحظائر. التنبيهات الفورية والتحليلات المالية ساعدوني نفهم فين كيخرج الفلوس — وأين كندير التغيير.",
    color: COLORS.blue,
  },
  {
    name: "سعيد",
    location: "فاس",
    before: "كنت نضيع الوقت فالوراق والجداول",
    after: "12 ساعة توفير كل أسبوع",
    stat: "12h",
    statLabel: "توفير فالوقت",
    quote: "جربت بزاف ديال الحلول، ولكن POULTRIX-C هو أول واحد شد الخدمة من اليوم الأول. التطبيق كيدير الحسابات والتقارير المالية والتوقعات — وأنا فقط كندير المراقبة والقرارات.",
    color: COLORS.gold,
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={COLORS.aqua} color={COLORS.aqua} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden" dir="rtl" style={{ background: "#FAF7F2" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20">
          <span className="section-label block mb-3">آراء المزارعين</span>
          <div className="section-divider mb-5" />
          <h2 className="text-4xl md:text-6xl font-black font-display leading-[0.9] mb-4" style={{ color: "#1E2B22", letterSpacing: "-0.03em" }}>
            هادو لي جربو راه
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#5A6A5A" }}>
            أكثر من 28,000 مزارع كيستعملو POULTRIX-C. شنو كيقولو المغاربة لي جربو؟
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Double-bezel card */}
              <div className="relative p-[1.5px] rounded-[2rem] h-full spring-transition hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${t.color}25, ${t.color}08)` }}>
                <div className="rounded-[calc(2rem-0.375rem)] h-full overflow-hidden"
                  style={{ background: "#FFFFFF", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5)" }}>
                  <div className="p-6 md:p-8 flex flex-col h-full">

                    {/* Star rating */}
                    <div className="mb-4">
                      <Stars />
                    </div>

                    {/* Before/After contrast */}
                    <div className="text-xs space-y-2 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#e0a0a0" }} />
                        <span style={{ color: "#999" }}>قبل: {t.before}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#34c759" }} />
                        <span style={{ color: "#1E2B22" }}>دابا: {t.after}</span>
                      </div>
                    </div>

                    {/* Big stat */}
                    <div className="mb-3">
                      <span className="text-3xl md:text-4xl font-black font-display tabular-nums"
                        style={{ color: t.color, letterSpacing: "-0.03em" }}>
                        {t.stat}
                      </span>
                      <span className="text-xs font-medium mr-1.5" style={{ color: t.color }}>
                        {t.statLabel}
                      </span>
                    </div>

                    {/* Quote */}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed" style={{ color: "#5A6A5A" }}>
                        {t.quote}
                      </p>
                    </div>

                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 pt-4 mt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: `${t.color}15`, color: t.color }}>
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#1E2B22" }}>{t.name}</p>
                        <p className="text-xs" style={{ color: "#7A8A7A" }}>{t.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
