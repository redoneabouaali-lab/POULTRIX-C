"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("[POULTRIX ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#BF7A5A15" }}>
              <span className="text-2xl" style={{ color: "#BF7A5A" }}>!</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-sm max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
              {this.state.error?.message || "An unexpected error occurred. Our team has been notified."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #C4893A, #2D5541)", color: "#000" }}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
