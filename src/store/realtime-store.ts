import { create } from "zustand";
import type { RealtimeEvent } from "@/types";

interface RealtimeState {
  connected: boolean;
  events: RealtimeEvent[];
  addEvent: (event: RealtimeEvent) => void;
  setConnected: (connected: boolean) => void;
  clearEvents: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connected: false,
  events: [],
  addEvent: (event) => set((s) => ({ events: [...s.events.slice(-49), event] })),
  setConnected: (connected) => set({ connected }),
  clearEvents: () => set({ events: [] }),
}));
