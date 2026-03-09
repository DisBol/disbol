import { create } from "zustand";

interface DistributeState {
  clientTotals: Record<number, number>; // Request_id -> total
  setClientTotal: (requestId: number, total: number) => void;
}

export const useDistributeStore = create<DistributeState>((set) => ({
  clientTotals: {},
  setClientTotal: (requestId, total) =>
    set((state) => {
      // Evitar actualizaciones innecesarias
      if (state.clientTotals[requestId] === total) {
        return state;
      }
      return {
        clientTotals: {
          ...state.clientTotals,
          [requestId]: total,
        },
      };
    }),
}));
