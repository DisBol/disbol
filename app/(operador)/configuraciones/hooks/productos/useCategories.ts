import { useState, useEffect } from "react";
import {
  CategoryResponse,
  CategoryData,
} from "../../interfaces/productos/getcategory.interface";
import { GetCategories } from "../../services/productos/getcategory";

export interface CategoryOption {
  value: string;
  label: string;
}

interface UseCategoriesReturn {
  categories: CategoryOption[];
  isLoading: boolean;
  error: Error | null;
}

export function useCategories(): UseCategoriesReturn {
  const [data, setData] = useState<CategoryData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result: CategoryResponse = await GetCategories();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Error al cargar categorías"),
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transformar datos para el SelectField (que espera value/label)
  const categories: CategoryOption[] =
    data?.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })) || [];

  return { categories, isLoading, error };
}
