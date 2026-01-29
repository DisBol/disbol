import { useState } from "react";
import { UpdateContainer } from "../../services/contenedor/updatecontainer";
import { UpdateContainerResponse } from "../../interfaces/contenedores/updatecontainer.interface";

interface UseUpdateContainerReturn {
  updateContainer: (params: {
    id: number;
    name: string;
    destare: number;
    deff: boolean | string | number;
    active: boolean | string | number;
  }) => Promise<UpdateContainerResponse | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateContainer(): UseUpdateContainerReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContainer = async ({
    id,
    name,
    destare,
    deff,
    active,
  }: {
    id: number;
    name: string;
    destare: number;
    deff: boolean | string | number;
    active: boolean | string | number;
  }): Promise<UpdateContainerResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await UpdateContainer(id, name, destare, deff, active);
      return response;
    } catch (err) {
      console.error("Error in useUpdateContainer:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar el contenedor",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateContainer, loading, error };
}
