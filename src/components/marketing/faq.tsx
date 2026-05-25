"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { COLORS } from "@/constants";

const faqs = [
  {
    q: "ما هي منصة POULTRIX؟",
    a: "POULTRIX هي منصة ذكاء اصطناعي متكاملة لإدارة ضيعات الدواجن. توفر تتبع الإنتاج، تحليل الأداء، إدارة القطيع، والتشخيص المبكر للأمراض بالذكاء الاصطناعي — مصممة خصيصًا لمربي الدجاج في المغرب والعالم العربي.",
  },
  {
    q: "كيف يمكن أن تساعدني POULTRIX في زيادة أرباح ضيعتي؟",
    a: "POULTRIX تقدم لك توقعات ذكية للأمراض قبل 48 ساعة من ظهورها، مما يقلل النفوق ويوفر تكاليف العلاج. كما توفر تحليلات مالية دقيقة لتتبع التكاليف والأرباح، مع توصيات لتحسين كفاءة العلف والماء.",
  },
  {
    q: "هل POULTRIX مناسبة لمزارع الدواجن في المغرب؟",
    a: "نعم، POULTRIX مصممة خصيصًا لمربي الدواجن في المغرب والعالم العربي. الواجهة بالعربية وتدعم المقاييس المحلية، وتتوافق مع أنظمة التربية المعتمدة في المغرب.",
  },
  {
    q: "ما هي الميزات الرئيسية لـ POULTRIX؟",
    a: "تشمل الميزات: تتبع إنتاج البيض، حساب FCR، إدارة القطيع، تحليلات مالية، تشخيص بيطري بالذكاء الاصطناعي، موسوعة سلالات الدجاج، مراقبة حية للحظائر، تنبيهات فورية، وتقارير أداء شاملة.",
  },
  {
    q: "هل المنصة مجانية؟",
    a: "نعم، POULTRIX تقدم باقة مجانية للبدء في إدارة ضيعتك. الباقة المدفوعة (Pro) توفر ميزات متقدمة مثل التوقعات الذكية، تقارير مالية شاملة، ودعم فوري — متاحة مقابل 299 درهم شهريًا.",
  },
  {
    q: "كيف يحمي POULTRIX بيانات ضيعتي؟",
    a: "جميع بياناتك مشفرة باستخدام SSL/TLS. خوادمنا مؤمنة بالكامل ولا نشارك بياناتك مع أي طرف ثالث. يمكنك حذف بياناتك في أي وقت.",
  },
  {
    q: "What is POULTRIX?",
    a: "POULTRIX is a comprehensive AI-powered poultry management platform. It offers flock tracking, production analytics, FCR calculations, AI veterinary diagnosis, and breed encyclopedia — designed for poultry farmers in Morocco and the Arab world.",
  },
  {
    q: "Is POULTRIX free?",
    a: "Yes, POULTRIX offers a free tier to get started with poultry management. Premium features including AI predictions, financial reports, and priority support are available at 299 MAD/month.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border-b border-[#1E2B22]/10"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-right spring-transition hover:opacity-80"
        aria-expanded={open}
      >
        <h3 className="text-base md:text-lg font-bold leading-relaxed" style={{ color: "#1E2B22" }}>
          {q}
        </h3>
        <ChevronDown
          size={18}
          style={{ color: COLORS.aqua, flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm md:text-base leading-relaxed" style={{ color: "#5A6A5A", lineHeight: 1.8 }}>
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" dir="rtl" className="relative py-28 md:py-36" style={{ background: "#FAF7F2" }}>
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="section-label block mb-3">الأسئلة الشائعة</span>
          <div className="section-divider mb-5 mx-auto" />
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl" style={{ color: "#1E2B22", letterSpacing: "-0.03em" }}>
            كل ما تحتاج معرفته عن POULTRIX
          </h2>
          <p className="text-base md:text-lg mt-4" style={{ color: "#5A6A5A" }}>
            إجابات على أكثر الأسئلة شيوعًا حول منصة إدارة ضيعات الدواجن
          </p>
        </div>

        <div className="rounded-2xl p-6 md:p-8" style={{ background: "#F5EDE3" }}>
          {faqs.map((faq, i) => (
            <FaqItem key={i} {...faq} index={i} />
          ))}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "#7A8A7A" }}>
          عندك سؤال آخر؟{" "}
          <a href="/login" className="font-bold spring-hover" style={{ color: COLORS.aqua }}>
            تواصل معنا
          </a>
        </p>
      </div>
    </section>
  );
}
