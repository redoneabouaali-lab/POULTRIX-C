"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api-client";
import { CACHE_TTL, API } from "@/constants";
import type {
  DashboardMetric,
  FlockSummary,
  MortalityPrediction,
  BarnAlert,
  FinancialSnapshot,
  AIInsight,
  RealtimeEvent,
  ApiResponse,
} from "@/types";

/* ─── useDashboard ─── */

interface DashboardData {
  metrics: DashboardMetric[];
  flock: FlockSummary;
  financial: FinancialSnapshot;
  insights: AIInsight[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, flockRes, financialRes, insightsRes] = await Promise.all([
        api.get<DashboardMetric[]>(API.DASHBOARD, { ttl: CACHE_TTL.DASHBOARD }),
        api.get<FlockSummary>(API.FLOCK, { ttl: CACHE_TTL.FLOCK }),
        api.get<FinancialSnapshot>(`${API.DASHBOARD}/financial`, { ttl: CACHE_TTL.DASHBOARD }),
        api.get<AIInsight[]>(`${API.DASHBOARD}/insights`, { ttl: CACHE_TTL.AI_INSIGHTS }),
      ]);
      if (metricsRes.error) throw new Error(metricsRes.error);
      setData({
        metrics: metricsRes.data!,
        flock: flockRes.data!,
        financial: financialRes.data!,
        insights: insightsRes.data!,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/* ─── useRealtime (SSE) ─── */

export function useRealtime(onEvent?: (event: RealtimeEvent) => void) {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const es = useRef<EventSource | null>(null);

  useEffect(() => {
    const source = new EventSource(API.STREAM);
    es.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (msg) => {
      try {
        const event: RealtimeEvent = JSON.parse(msg.data);
        setEvents((prev) => [event, ...prev].slice(0, 50));
        onEvent?.(event);
      } catch { /* ignore malformed */ }
    };

    return () => {
      source.close();
      es.current = null;
      setConnected(false);
    };
  }, [onEvent]);

  return { connected, events };
}

/* ─── usePredictions ─── */

export function usePredictions() {
  const [predictions, setPredictions] = useState<MortalityPrediction[]>([]);
  const [alerts, setAlerts] = useState<BarnAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const [predRes, alertRes] = await Promise.all([
      api.get<MortalityPrediction[]>(API.PREDICTIONS, { ttl: CACHE_TTL.PREDICTIONS }),
      api.get<BarnAlert[]>(`${API.PREDICTIONS}/alerts`, { ttl: CACHE_TTL.PREDICTIONS }),
    ]);
    if (!predRes.error && predRes.data) setPredictions(predRes.data);
    if (!alertRes.error && alertRes.data) setAlerts(alertRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { predictions, alerts, loading, refetch: fetch };
}
