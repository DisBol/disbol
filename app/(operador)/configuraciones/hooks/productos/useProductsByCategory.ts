import { useState, useEffect, useMemo } from "react";
import {
  ProductByCategoryResponse,
  Datum,
} from "../../interfaces/productos/getproductbycategory.interface";
import { GetProductByCategory } from "../../services/productos/getproductbycategory";

export interface CategoryView {
  id: number;
  name: string;
  CategoryProvider_id: number;
  products: ProductView[];
}

export interface ProductView {
  id: number;
  name: string;
}

interface UseProductsByCategoryReturn {
  rawData: Datum[] | null;
  categories: CategoryView[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProductsByCategory(): UseProductsByCategoryReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result: ProductByCategoryResponse = await GetProductByCategory();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Agrupar productos por categoría
  const categories = useMemo<CategoryView[]>(() => {
    if (!data) return [];

    const categoryMap = new Map<number, CategoryView>();

    data.forEach((item) => {
      // Si la categoría no existe, la creamos
      if (!categoryMap.has(item.id_0)) {
        categoryMap.set(item.id_0, {
          id: item.id_0,
          name: item.name_0,
          CategoryProvider_id: item.CategoryProvider_id,
          products: [],
        });
      }

      // Agregamos el producto a la categoría
      const category = categoryMap.get(item.id_0);
      if (category) {
        category.products.push({
          id: item.id,
          name: item.name,
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [data]);

  return { rawData: data, categories, loading, error, refetch };
}
