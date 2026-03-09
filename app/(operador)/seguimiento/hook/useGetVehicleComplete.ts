import { useState, useEffect } from "react";
import type { VehicleComplete } from "../../configuraciones/services/monnet/vehicleGetAllComplete";

interface UseGetVehicleCompleteResult {
  vehicles: VehicleComplete[];
  loading: boolean;
  error: string | null;
}

export function useGetVehicleComplete(): UseGetVehicleCompleteResult {
  const [vehicles, setVehicles] = useState<VehicleComplete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchVehicles() {
      try {
        setLoading(true);
        const response = await fetch("/api/monnet/vehiclesComplete");

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles complete");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        if (isMounted) {
          setVehicles(result.data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Error desconocido");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  return { vehicles, loading, error };
}
