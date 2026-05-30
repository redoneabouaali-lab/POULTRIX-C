"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

const HeroSection = () => {
  const mounted = useRef(true);

  useEffect(() => {
    const paths = document.querySelectorAll<SVGPathElement>(".animation-line");
    const timers: ReturnType<typeof setTimeout>[] = [];

    paths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}px`;
      path.style.strokeDashoffset = `${len}px`;
      const timer = setTimeout(() => {
        if (!mounted.current) return;
        path.style.transition = "stroke-dashoffset 2s ease-in-out";
        path.style.strokeDashoffset = "0px";
      }, 500);
      timers.push(timer);
    });

    return () => {
      mounted.current = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes patternScroll {
          0% { transform: translate(-5%, -5%); }
          100% { transform: translate(5%, 5%); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-patternScroll {
          animation: patternScroll 20s linear infinite;
        }
        .gradient-text {
          background: linear-gradient(270deg, #C4893A, #81BABA, #4A90D9, #D4A853, #C4893A);
          background-size: 600% 600%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 15s ease infinite;
        }
        .animation-line {
          fill: none;
          stroke: rgba(255,255,255,0.25);
          stroke-width: 2;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 5px rgba(196,137,58,0.3); }
          50% { box-shadow: 0 0 25px rgba(196,137,58,0.6); }
          100% { box-shadow: 0 0 5px rgba(196,137,58,0.3); }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div
        dir="rtl"
        className="relative min-h-screen flex items-center justify-center bg-black text-white font-sans overflow-hidden"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,137,58,0.08)_0%,transparent_70%)]" />

        {/* Animated pattern grid */}
        <div
          className="pattern absolute w-[200%] h-[200%] opacity-[0.04] animate-patternScroll"
          style={{
            top: "-50%",
            left: "-50%",
            backgroundImage:
              "repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)",
          }}
        />
        <div
          className="pattern absolute w-[200%] h-[200%] opacity-[0.04] animate-patternScroll"
          style={{
            top: "50%",
            left: "50%",
            backgroundImage:
              "repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)",
          }}
        />

        {/* Animated SVG Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 177 159"
            preserveAspectRatio="none"
          >
            <path
              className="animation-line"
              d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
            />
          </svg>
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 176 59"
            preserveAspectRatio="none"
          >
            <path
              className="animation-line"
              d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center px-4 animate-fadeIn">
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] leading-tight font-display">
            زد أرباح ضيعتك<br />
            <span className="gradient-text inline-block">بالذكاء الاصطناعي</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            POULTRIX توقّع المرض قبل 48 ساعة وراقب ضيعتك فوراً —
            <span className="text-[#C4893A] font-semibold"> بدون أجهزة معقدة</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="/sign-up"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black rounded-full text-lg font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,137,58,0.4)] hover:scale-105 pulse-animation"
            >
              ابدأ شهراً مجاناً
              <ArrowLeft size={18} />
            </a>

            <a
              href="/login"
              className="px-8 py-4 rounded-full text-sm font-medium text-white/60 hover:text-white transition-colors duration-300"
            >
              تسجيل الدخول
            </a>
          </div>

          <p className="mt-6 text-sm text-white/40">
            بدون بطاقة بنكية — جرب المنصة كاملة
          </p>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
