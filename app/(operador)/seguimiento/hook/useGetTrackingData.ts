import { useState, useEffect } from "react";
import type { UnitData } from "../../configuraciones/services/monnet/getData";

interface UseGetTrackingDataResult {
  trackingData: UnitData[];
  loading: boolean;
  error: string | null;
}

export function useGetTrackingData(
  intervalMs: number = 30000,
): UseGetTrackingDataResult {
  const [trackingData, setTrackingData] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrackingData() {
      try {
        const response = await fetch("/api/monnet/getdata");

        if (!response.ok) {
          throw new Error("Failed to fetch tracking data");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        if (isMounted) {
          setTrackingData(result.data);
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

    fetchTrackingData();

    // Set polling interval
    const intervalId = setInterval(fetchTrackingData, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return { trackingData, loading, error };
}
