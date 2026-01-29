import { useState } from "react";
import { AddContainer } from "../../services/contenedor/addcontainer";
import { AddContainerResponse } from "../../interfaces/contenedores/addcontainer.interface";

interface UseAddContainerReturn {
  addContainer: (params: {
    name: string;
    destare: number;
    deff: boolean | string | number;
    active: boolean | string | number;
  }) => Promise<AddContainerResponse | null>;
  loading: boolean;
  error: string | null;
}

export function useAddContainer(): UseAddContainerReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContainer = async ({
    name,
    destare,
    deff,
    active,
  }: {
    name: string;
    destare: number;
    deff: boolean | string | number;
    active: boolean | string | number;
  }): Promise<AddContainerResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddContainer(name, destare, deff, active);
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al agregar el contenedor",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addContainer, loading, error };
}
