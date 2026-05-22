"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageSkeleton } from "@/components/ui/loading-state";
import { AppProviders } from "@/components/providers/app-providers";
import ChatButton from "@/modules/ai/components/chat-button";
import Footer from "@/components/layout/footer";
import Header from "@/components/marketing/header";
import HeroSection from "@/components/marketing/hero";
import TrustMetricsBar from "@/components/marketing/trust-metrics";
import FeaturesSection from "@/components/marketing/features";
import NarrativeFlow from "@/components/marketing/narrative";
import StepsScrollSection from "@/components/ui/steps-scroll";
import CTASection from "@/components/marketing/cta";
import { TopLoader } from "@/components/lightswind/top-loader";

export default function MarketingPage() {
  return (
    <AppProviders>
      <ErrorBoundary fallback={<PageSkeleton />}>
        <TopLoader color="#C4893A" height={3} showSpinner={false} />
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
