"use client";
import { useState, useEffect } from "react";
import {
  vehicleGetAll,
  type Vehicle,
} from "../../services/monnet/vehicleGetAll";

interface UseVehicleGetAllReturn {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVehicleGetAll(): UseVehicleGetAllReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await vehicleGetAll();
        if (!cancelled) {
          setVehicles(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar los vehículos GPS",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchVehicles();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);

  return { vehicles, isLoading, error, refetch };
}
