import { useState } from "react";
import { UpdateCar } from "../../services/vehiculos/updatecar";
import { UpdateCarResponse } from "../../interfaces/vehiculos/updatecar";

interface UseUpdateCarReturn {
  updateCar: (
    id: number,
    name: string,
    idCar: string,
    license: string,
    active: string,
  ) => Promise<UpdateCarResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateCar(): UseUpdateCarReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCar = async (
    id: number,
    name: string,
    idCar: string,
    license: string,
    active: string,
  ): Promise<UpdateCarResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UpdateCar(id, name, idCar, license, active);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar el vehículo";
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCar, isLoading, error };
}
