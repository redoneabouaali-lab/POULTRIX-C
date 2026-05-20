import { create } from "zustand";
import type { Flock } from "@/types";

interface FlockState {
  activeFlockId: string | null;
  flocks: Flock[];
  setActiveFlock: (id: string | null) => void;
  setFlocks: (flocks: Flock[]) => void;
  addFlock: (flock: Flock) => void;
  updateFlock: (id: string, updates: Partial<Flock>) => void;
  removeFlock: (id: string) => void;
}

export const useFlockStore = create<FlockState>((set) => ({
  activeFlockId: null,
  flocks: [],
  setActiveFlock: (id) => set({ activeFlockId: id }),
  setFlocks: (flocks) => set({ flocks }),
  addFlock: (flock) => set((s) => ({ flocks: [...s.flocks, flock] })),
  updateFlock: (id, updates) =>
    set((s) => ({ flocks: s.flocks.map((f) => (f.id === id ? { ...f, ...updates } : f)) })),
  removeFlock: (id) => set((s) => ({ flocks: s.flocks.filter((f) => f.id !== id) })),
}));
