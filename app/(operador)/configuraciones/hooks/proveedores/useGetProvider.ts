import { useEffect, useState } from "react";
import { GetProvider } from "../../services/provedores/getprovider";

interface Option {
  value: string;
  label: string;
  [key: string]: any; 
}

export function useGetProvider() {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await GetProvider();
        const mappedOptions = response.data.map((provider) => ({
          value: provider.id.toString(), 
          label: provider.name,
        }));
        setOptions(mappedOptions);
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Error al cargar proveedores");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { options, isLoading, error };
}
