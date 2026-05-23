"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { UserPlus, Monitor, Settings, BarChart3, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { ShineButton } from "@/components/lightswind/shine-button";

const steps = [
  {
    step: "01",
    title: "سجل حسابك",
    desc: "أقل من دقيقة. ما كاين حتى بطاقة بنكية ولا التزام.",
    icon: UserPlus,
    color: COLORS.aqua,
  },
  {
    step: "02",
    title: "وصّل ضيعتك",
    desc: "نربط حساساتك وكاميراتك مع المنصة فخطوات بسيطة. ولا جرب بالبيانات التجريبية.",
    icon: Monitor,
    color: COLORS.gold,
  },
  {
    step: "03",
    title: "خصص التنبيهات",
    desc: "حدد شنو كتحب تراقب: الحرارة، الرطوبة، الأمراض، التكاليف... النظام غادي يشتغل نيابة عليك.",
    icon: Settings,
    color: COLORS.blue,
  },
  {
    step: "04",
    title: "تابع وقرر بذكاء",
    desc: "استقبل توقعات دقيقة وتقارير مالية وتنبيهات فورية. قراراتك دابا مبنية على البيانات.",
    icon: BarChart3,
    color: COLORS.aqua,
  },
];

const stepLineStyle = (idx: number) => ({
  background: `linear-gradient(to bottom, ${steps[idx].color}20, ${idx < steps.length - 1 ? steps[idx + 1].color : steps[idx].color}10)`,
});

export default function NextStepsSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden" dir="rtl" style={{ background: "#FAF7F2" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20">
          <span className="section-label block mb-3">كيفاش تبدا</span>
          <div className="section-divider mb-5" />
          <h2 className="text-4xl md:text-6xl font-black font-display leading-[0.9] mb-4" style={{ color: "#1E2B22", letterSpacing: "-0.03em" }}>
            ابدأ فالطريق الصحيح
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#5A6A5A" }}>
            4 خطوات فقط وتكون منطلق. الضيعة ديالك فالأمان، والربح كايتحسن من أول شهر.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((s, idx) => (
            <motion.div key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-6 md:gap-8 pb-12 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-display font-black text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${s.color}20, ${s.color}10)`,
                    color: s.color,
                    border: `2px solid ${s.color}30`,
                    boxShadow: `0 0 0 4px ${s.color}08`,
                  }}>
                  {s.step}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-[3rem] mt-2" style={stepLineStyle(idx)} />
                )}
              </div>

              <div className="flex-1 pt-2 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}12` }}>
                    <s.icon size={16} style={{ color: s.color }} />
                  </div>
                  <h3 className="font-heading text-lg md:text-xl font-bold" style={{ color: "#1E2B22" }}>
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base pr-11" style={{ color: "#5A6A5A" }}>
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-12"
        >
          <p className="text-sm mb-6" style={{ color: "#7A8A7A" }}>
            <Sparkles size={14} className="inline-block ml-1.5" style={{ color: COLORS.aqua }} />
            أول شهر مجاني — جرب من غير خطر
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShineButton
              label="ابدأ الآن — مجاناً"
              size="lg"
              onClick={() => window.location.href = "/sign-up"}
              bgColor="linear-gradient(325deg, #C4893A 0%, #81BABA 55%, #C4893A 90%)"
            />
            <a href="/login"
              className="px-8 py-4 rounded-full text-sm font-medium spring-hover glass-light"
              style={{ color: "#5A6A5A" }}>
              عندي حساب — تسجيل الدخول
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-xs flex-wrap" style={{ color: "#7A8A7A" }}>
            <div className="flex items-center gap-1.5"><Shield size={12} style={{ color: COLORS.aqua }} /> بدون بطاقة بنكية</div>
            <div className="flex items-center gap-1.5"><ArrowLeft size={12} style={{ color: COLORS.gold }} /> إلغاء في أي وقت</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
