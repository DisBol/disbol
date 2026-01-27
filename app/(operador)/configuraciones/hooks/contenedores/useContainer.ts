import { useState, useEffect } from "react";
import {
  GetContainerResponse,
  Container,
} from "../../interfaces/contenedores/getcontainer.interface";
import { GetContainer } from "../../services/contenedor/getcontainer";

export interface ContainerOption {
  value: string;
  label: string;
}

export interface UseContainerReturn {
  containers: ContainerOption[];
  containersData: Container[] | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useContainer(): UseContainerReturn {
  const [data, setData] = useState<Container[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result: GetContainerResponse = await GetContainer();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al cargar contenedores"),
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transformar datos para el SelectField (que espera value/label)
  const containers: ContainerOption[] =
    data?.map((container) => ({
      value: container.id.toString(),
      label: container.name,
    })) || [];

  return {
    containers,
    containersData: data,
    isLoading,
    error,
    refresh: fetchData,
  };
}
