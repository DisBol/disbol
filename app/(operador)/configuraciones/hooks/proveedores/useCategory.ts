import { useState, useEffect } from "react";
import { CategoryResponse, Datum } from "../../interfaces/proveedores/getcategory.interface";
import { GetCategory } from "../../services/provedores/getcategory";
import { SelectOption } from "@/components/ui/SelecMultipe";

export interface CategoryView {
  id: number;
  nombre: string;
  estado: string;
}

interface UseCategoryReturn {
  rawData: Datum[] | null;
  categories: SelectOption[];
  loading: boolean;
  error: Error | null;
}

export function useCategory(): UseCategoryReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: CategoryResponse = await GetCategory();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories: SelectOption[] = data
    ? data.map((item) => ({
        value: item.name,
        label: item.name,
      }))
    : [];

  return { rawData: data, categories, loading, error };
}
