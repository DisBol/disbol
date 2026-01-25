import { useState } from "react";
import { AddCategory } from "../../services/productos/addcategory";
import {
  CategoryAddRequest,
  CategoryAddResponse,
} from "../../interfaces/productos/addcategory.interface";

interface UseAddCategoryReturn {
  isLoading: boolean;
  error: string | null;
  addCategory: (categoryData: CategoryAddRequest) => Promise<boolean>;
}

export function useAddCategory(): UseAddCategoryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCategory = async (
    categoryData: CategoryAddRequest,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: CategoryAddResponse = await AddCategory(categoryData);

      // Verificar que la respuesta sea exitosa
      if (response.data && response.data.changes > 0) {
        return true;
      } else {
        setError("Error al crear la categoría");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear la categoría";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, addCategory };
}
