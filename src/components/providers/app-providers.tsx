"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
