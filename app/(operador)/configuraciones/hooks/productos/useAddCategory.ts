import { useState } from "react";
import { AddCategory } from "../../services/productos/addcategory";
import { AddCategoryResponse } from "../../interfaces/productos/addcategory.interface";

export function useAddCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AddCategoryResponse | null>(null);

  const addCategory = async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AddCategory(name);
      setData(response);
      return response;

      // Verificar que la respuesta sea exitosa
      //   if (response.data && response.data.changes > 0) {
      //     return response;
      //   } else {
      //     setError("Error al crear la categoría");
      //     return null;
      //   }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear la categoría";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { addCategory, isLoading, error, data };
}
