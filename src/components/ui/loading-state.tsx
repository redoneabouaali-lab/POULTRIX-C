"use client";

import { cn } from "@/lib/utils";

const shimmer = "bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%] animate-pulse";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-xl", shimmer)}
      style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)", backgroundSize: "200% 100%" }}
      aria-hidden="true"
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl p-5 space-y-3" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <Skeleton className="w-10 h-10 rounded-lg" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6" style={{ background: "rgba(0,0,0,0.35)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="w-16 h-16 rounded-2xl mx-auto" style={{ background: "linear-gradient(135deg, #C4893A, #2D5541)" }} />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-md" style={{ background: i === 0 ? "#C4893A" : i === 1 ? "#2D5541" : i === 2 ? "#F5EDE3" : "#BF7A5A", opacity: 0.3 }} />
          ))}
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>Loading your intelligence platform...</p>
      </div>
    </div>
  );
}
