import { create } from "zustand";
import {
  Datum,
  CategoryProviderResponse,
} from "../interfaces/proveedores/getcategoryprovider.interface";
import { GetCategoryProviders } from "../services/provedores/getcategoryprovider";

interface ProviderState {
  rawData: Datum[] | null;
  loading: boolean;
  error: Error | null;
  fetchProviders: () => Promise<void>;
}

export const useProviderStore = create<ProviderState>((set) => ({
  rawData: null,
  loading: false,
  error: null,
  fetchProviders: async () => {
    set({ loading: true, error: null });
    try {
      const result: CategoryProviderResponse = await GetCategoryProviders();
      set({ rawData: result.data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error("Unknown error"),
        loading: false,
      });
    }
  },
}));
