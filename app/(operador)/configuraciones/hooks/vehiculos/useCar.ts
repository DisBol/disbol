import { useState, useEffect } from "react";
import { GetCars } from "../../services/vehiculos/getcar";
import { Datum } from "../../interfaces/vehiculos/getcar";

export function useCar() {
  const [cars, setCars] = useState<Datum[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await GetCars();
      setCars(response.data);
    } catch (err) {
      setError("Error al cargar vehículos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return { cars, isLoading, error, refetch: fetchCars };
}
