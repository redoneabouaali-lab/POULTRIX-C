"use client";

import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageSkeleton } from "@/components/ui/loading-state";
import { AppProviders } from "@/components/providers/app-providers";
import ChatButton from "@/modules/ai/components/chat-button";
import Footer from "@/components/layout/footer";
import { COLORS } from "@/constants";
import Header from "@/components/marketing/header";
import HeroSection from "@/components/marketing/hero";
import TrustMetricsBar from "@/components/marketing/trust-metrics";
import FeaturesSection from "@/components/marketing/features";
import NarrativeFlow from "@/components/marketing/narrative";
import StepsScrollSection from "@/components/ui/steps-scroll";
import CTASection from "@/components/marketing/cta";

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="h-full spring-transition" style={{
      width: `${progress * 100}%`,
      background: `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.blue}, ${COLORS.gold}, ${COLORS.cream})`,
    }} />
  );
}

export default function MarketingPage() {
  return (
    <AppProviders>
      <ErrorBoundary fallback={<PageSkeleton />}>
        <div className="fixed top-0 left-0 right-0 h-[2px] z-50">
          <ScrollProgressBar />
        </div>
        <div className="noise-overlay" />
        <Header />
        <HeroSection />
        <TrustMetricsBar />
        <FeaturesSection />
        <NarrativeFlow />
        <StepsScrollSection />
        <CTASection />
        <ChatButton />
        <Footer />
      </ErrorBoundary>
    </AppProviders>
  );
}
