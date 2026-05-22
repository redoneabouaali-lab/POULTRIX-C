"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Eye, Activity, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/lightswind/scroll-reveal";

const features = [
  {
    tag: "المراقبة",
    title: "مراقبة حية للضيعة",
    desc: "تابع كل حظائر الدجاج في الوقت الحقيقي مع تنبيهات فورية عند اكتشاف أي مشكل.",
    icon: Eye,
    items: ["كاميرات متصلة", "حساسات درجة الحرارة", "مؤشرات الرطوبة"],
    from: COLORS.aqua, to: COLORS.gold,
  },
  {
    tag: "التوقعات",
    title: "توقعات بالذكاء الاصطناعي",
    desc: "النظام كيتوقع الأمراض قبل 48 ساعة من ظهورها ويقترح العلاج المناسب.",
    icon: Activity,
    items: ["كشف مبكر للأمراض", "تحليل السلوك", "توصيات علاجية"],
    from: COLORS.blue, to: COLORS.aqua,
  },
  {
    tag: "المالية",
    title: "تدبير مالي ذكي",
    desc: "حلل التكاليف والأرباح وتوقع الميزانية القادمة بدقة عالية.",
    icon: TrendingUp,
    items: ["تحليل التكاليف", "توقعات الأرباح", "تقارير مالية"],
    from: COLORS.gold, to: COLORS.blue,
  },
];

export default function FeaturesSection() {
  return (
    <section id="services" className="relative py-28 md:py-36 overflow-hidden" dir="rtl" style={{ background: "#F5EDE3" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <div className="text-center lg:text-right mb-16 lg:mb-20">
          <span className="section-label block mb-3">ماذا نقدم</span>
          <div className="section-divider mb-5" />
          <ScrollReveal
            size="xl"
            align="center"
            variant="default"
            threshold={0.3}
            baseOpacity={0}
            baseRotation={2}
            blurStrength={6}
            containerClassName="w-full"
          >
            كل ما تحتاجه لتدبير ضيعتك
          </ScrollReveal>
          <p className="text-base md:text-lg max-w-lg mx-auto lg:mx-0 mt-4" style={{ color: "#5A6A5A" }}>
            منصة متكاملة تجمع المراقبة، التحليل، والتدبير المالي في مكان واحد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((f, idx) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-[1px] rounded-[1.5rem]" style={{ background: `linear-gradient(135deg, ${f.from}30, ${f.to}15)` }}>
                <div className="rounded-[calc(1.5rem-0.25rem)] overflow-hidden" style={{ background: "#FAF7F2" }}>
                  <div className="relative h-48 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${f.from}10, ${f.to}08)` }}>
                    <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${f.from}20, ${f.to}15)` }}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <f.icon size={28} style={{ color: f.from }} />
                    </motion.div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center gap-1.5 h-10 opacity-30">
                      {[40, 60, 45, 75, 55, 85, 50].map((h, i) => (
                        <motion.div key={i}
                          style={{ width: 8, background: f.from, borderRadius: "2px 2px 0 0" }}
                          animate={{ height: [h * 0.7, h, h * 0.7] }}
                          transition={{ duration: 2, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 text-center lg:text-right">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-3" style={{ background: `${f.from}10` }}>
                      <span className="text-[0.65rem] font-bold tracking-[0.1em]" style={{ color: f.from }}>{f.tag}</span>
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl mb-2" style={{ color: "#1E2B22" }}>{f.title}</h3>
                    <p className="text-sm md:text-base mb-4" style={{ color: "#5A6A5A", lineHeight: 1.7 }}>{f.desc}</p>
                    <ul className="space-y-1.5">
                      {f.items.map((item) => (
                          <li key={item} className="flex items-center justify-center lg:justify-start gap-2 text-xs md:text-sm" style={{ color: "#1E2B22" }}>
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: f.from }} />
                          {item}
                        </li>
                      ))}
                    </ul>
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
