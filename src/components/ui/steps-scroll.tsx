"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "1",
    title: "توصيل الحظائر",
    desc: "ندخلو بيانات الحظائر والقطيع في المنصة — العملية كاتقل 5 دقائق.",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1000&h=800&fit=crop",
    accent: COLORS.aqua,
  },
  {
    number: "2",
    title: "مراقبة ذكية",
    desc: "الـ AI كيحلل البيانات فورياً ويبدا يولد التوقعات والتنبيهات.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&h=800&fit=crop",
    accent: COLORS.blue,
  },
  {
    number: "3",
    title: "قرارات ربحية",
    desc: "كتاخد قرارات مبنية على بيانات دقيقة — وقت أقل، ربح أكثر.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1000&h=800&fit=crop",
    accent: COLORS.gold,
  },
];

export default function StepsScrollSection() {
  const container = useRef(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const images = imageRefs.current;
      const totalCards = images.length;
      if (!images[0]) return;

      gsap.set(images[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < totalCards; i++) {
        if (!images[i]) continue;
        gsap.set(images[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const current = images[i];
        const next = images[i + 1];
        if (!current || !next) continue;

        tl.to(current, { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, i);
        tl.to(next, { y: "0%", duration: 1, ease: "none" }, i);
      }

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) ro.observe(container.current);

      return () => {
        ro.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: container },
  );

  return (
    <div dir="rtl">
      {/* ─── Header ─── */}
      <div className="py-24 md:py-32 text-center" style={{ background: COLORS.cream }}>
        <div className="max-w-[1320px] mx-auto px-4 md:px-8">
          <span className="section-label block text-center mb-3" style={{ color: "#7A8A7A" }}>
            كيفاش كتخدم
          </span>
          <div className="section-divider mx-auto mb-5" />
          <h2 className="text-3xl md:text-5xl font-display leading-tight" style={{ color: "#1a1a24" }}>
            3 خطوات فقط للانطلاق
          </h2>
        </div>
      </div>

      {/* ─── Sticky Cards (exact Skiper17 DOM pattern) ─── */}
      <div ref={container}>
        <div className="sticky-cards relative flex items-center justify-center overflow-hidden" style={{ height: "100vh" }}>
          <div className="relative w-full max-w-5xl" style={{ height: "90vh" }}>
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { imageRefs.current[i] = el; }}
                className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${step.image})` }}
              >
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${step.accent}80, ${step.accent}20 60%, transparent 100%)` }} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 w-full h-full flex items-center justify-center px-4 md:px-8">
                  <div className="w-full max-w-xl p-1" style={{ borderRadius: "2rem", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <div className="p-8 md:p-12 text-center" style={{ borderRadius: "calc(2rem - 0.25rem)", background: "rgba(255,255,255,0.85)" }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6" style={{ background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)`, color: "#000", fontFamily: "'ChikenSteeak', 'Masko', sans-serif" }}>
                        {step.number}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-heading mb-4" style={{ color: "#1a1a24" }}>
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg leading-relaxed mx-auto" style={{ color: "#5A6A5A", maxWidth: 480 }}>
                        {step.desc}
                      </p>
                      <div className="mt-8 h-1 rounded-full mx-auto" style={{ width: 80, background: `linear-gradient(90deg, ${step.accent}, transparent)` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
