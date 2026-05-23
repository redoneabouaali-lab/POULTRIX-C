"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "عبد الرحمن",
    role: "صاحب ضيعة دواجن — الدار البيضاء",
    avatar: "ع",
    content: "من قبل كنت كنعتمد على التخمين فالتغذية والعلاج. دابا المنصة كتقطعلنا التوقعات قبل 48 ساعة، ووفرنا فلوس البيوطرة بزاف. الربح زاد ب 40% فشهر واحد.",
    rating: 5,
    from: COLORS.aqua,
    highlight: "الربح زاد ب 40% فشهر واحد",
  },
  {
    name: "فاطمة",
    role: "مديرة مزرعة — مراكش",
    avatar: "ف",
    content: "كنت كنقلق على الضيعة فالسفر. دابا كنجي نشوف التطبيق ونعرف شنو كاين. التنبيهات فورية والتحليلات المالية ساعدوني نفهم فين كيخرج الفلوس.",
    rating: 5,
    from: COLORS.blue,
    highlight: "التنبيهات الفورية نقصت الخسائر ب 60%",
  },
  {
    name: "رشيد",
    role: "مقاول فلاحي — فاس",
    avatar: "ر",
    content: "جربت بزاف ديال الحلول قبل، ولكن POULTRIX-C هو أول واحد شد الخدمة من đầu. الذكاء الاصطناعي ديالو مازال ما غلط فالتشخيص. والتقارير المالية كتعطيني صورة واضحة على الربحية.",
    rating: 5,
    from: COLORS.gold,
    highlight: "أول حل شغل بشكل ممتاز من اليوم الأول",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill={COLORS.aqua} color={COLORS.aqua} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden" dir="rtl" style={{ background: "#F5EDE3" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="section-label block mb-3">شهادات المستخدمين</span>
          <div className="section-divider mb-5" />
          <h2 className="text-4xl md:text-6xl font-black font-display leading-[0.9] mb-4" style={{ color: "#1E2B22", letterSpacing: "-0.03em" }}>
            هادو لي جربو، شهدو
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#5A6A5A" }}>
            أكثر من 28,000 مزرعة كتثق ف POULTRIX-C. شنو كيقولو المغاربة لي جربو المنصة؟
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative h-full p-[1px] rounded-[1.5rem]" style={{ background: `linear-gradient(135deg, ${t.from}20, transparent)` }}>
                <div className="rounded-[calc(1.5rem-0.25rem)] h-full overflow-hidden" style={{ background: "#FFFFFF" }}>
                  <div className="p-6 md:p-8 flex flex-col h-full">
                    <div className="mb-4">
                      <Stars count={t.rating} />
                    </div>

                    <div className="mb-4" style={{ color: `${t.from}15` }}>
                      <Quote size={32} />
                    </div>

                    <p className="text-sm md:text-base leading-relaxed mb-6 flex-1" style={{ color: "#5A6A5A" }}>
                      {t.content}
                    </p>

                    <div className="p-3 rounded-xl mb-4" style={{ background: `${t.from}08` }}>
                      <p className="text-sm font-bold" style={{ color: t.from }}>
                        {t.highlight}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: `${t.from}15`, color: t.from }}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#1E2B22" }}>{t.name}</p>
                        <p className="text-xs" style={{ color: "#7A8A7A" }}>{t.role}</p>
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
