import { create } from "zustand";
import type { Farm } from "@/types";

interface FarmState {
  farm: Farm | null;
  loading: boolean;
  setFarm: (farm: Farm) => void;
  clearFarm: () => void;
}

export const useFarmStore = create<FarmState>((set) => ({
  farm: null,
  loading: true,
  setFarm: (farm) => set({ farm, loading: false }),
  clearFarm: () => set({ farm: null, loading: false }),
}));
