import { useState, useEffect } from "react";
import type { Geofence } from "../../configuraciones/services/monnet/getGeofences";

interface UseGetGeofencesResult {
  geofences: Geofence[];
  loading: boolean;
  error: string | null;
}

export function useGetGeofences(): UseGetGeofencesResult {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGeofences() {
      try {
        setLoading(true);
        const response = await fetch("/api/monnet/geofences");

        if (!response.ok) {
          throw new Error("Failed to fetch geofences");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        if (isMounted) {
          setGeofences(result.data);
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

    fetchGeofences();

    return () => {
      isMounted = false;
    };
  }, []);

  return { geofences, loading, error };
}
