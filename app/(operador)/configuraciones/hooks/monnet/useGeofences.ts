import { useState, useEffect } from "react";

export interface Geofence {
  idCerca: number;
  nombre: string;
  tipo_cerca: string;
  color: string;
  grupo: string;
  visible: number;
  // Otros campos opcionales
  puntos?: Array<{ lat: number; lng: number }>;
  radio?: number;
  limite_velocidad?: number;
  solo_mi_usuario?: number;
  compartida?: number;
}

interface UseGeofencesReturn {
  geofences: Geofence[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useGeofences = (): UseGeofencesReturn => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGeofences = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/monnet/geofences");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      setGeofences(result.data || []);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al cargar las rutas");
      setError(error);
      console.error("Error fetching geofences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeofences();
  }, []);

  return {
    geofences,
    loading,
    error,
    refetch: fetchGeofences,
  };
};
