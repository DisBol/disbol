import { useState } from "react";
import { AddCar } from "../../services/vehiculos/addcar";
import { AddCarResponse } from "../../interfaces/vehiculos/addcar";

interface UseAddCarReturn {
  addCar: (
    name: string,
    idCar: string,
    license: string,
    active: string,
  ) => Promise<AddCarResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useAddCar(): UseAddCarReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCar = async (
    name: string,
    idCar: string,
    license: string,
    active: string,
  ): Promise<AddCarResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AddCar(name, idCar, license, active);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el vehículo";
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { addCar, isLoading, error };
}
