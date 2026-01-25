import { useState } from "react";
import { UpdateCategory } from "../../services/productos/updatecategory";
import { UpdateCategoryResponse } from "../../interfaces/productos/updatecategory.interface";

export function useUpdateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UpdateCategoryResponse | null>(null);

  const updateCategory = async (
    id: number,
    name: string,
    active: string = "true",
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await UpdateCategory(id, name, active);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar la categoría";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCategory, isLoading, error, data };
}
