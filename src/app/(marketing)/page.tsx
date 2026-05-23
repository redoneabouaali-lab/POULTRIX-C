"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageSkeleton } from "@/components/ui/loading-state";
import { AppProviders } from "@/components/providers/app-providers";
import dynamic from "next/dynamic";
import ChatButton from "@/modules/ai/components/chat-button";
import Footer from "@/components/layout/footer";
import Header from "@/components/marketing/header";
import HeroSection from "@/components/marketing/hero";
import BrandTrustSection from "@/components/marketing/brand-trust";
import TrustMetricsBar from "@/components/marketing/trust-metrics";
import FeaturesSection from "@/components/marketing/features";
import ServicesPricingSection from "@/components/marketing/services-pricing";
import TestimonialsSection from "@/components/marketing/testimonials";
import NextStepsSection from "@/components/marketing/next-steps";
import { TopLoader } from "@/components/lightswind/top-loader";

const NarrativeFlow = dynamic(() => import("@/components/marketing/narrative"), { ssr: false });
const StepsScrollSection = dynamic(() => import("@/components/ui/steps-scroll"), { ssr: false });

export default function MarketingPage() {
  return (
    <AppProviders>
      <ErrorBoundary fallback={<PageSkeleton />}>
        <TopLoader color="#C4893A" height={3} showSpinner={false} />
        <div className="noise-overlay" />
        <Header />
        <HeroSection />
        <BrandTrustSection />
        <TrustMetricsBar />
        <FeaturesSection />
        <ServicesPricingSection />
        <NarrativeFlow />
        <TestimonialsSection />
        <StepsScrollSection />
        <NextStepsSection />
        <ChatButton />
        <Footer />
      </ErrorBoundary>
    </AppProviders>
  );
}
