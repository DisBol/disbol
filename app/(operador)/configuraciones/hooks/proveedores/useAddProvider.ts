import { useState } from "react";
import { AddProvider } from "../../services/provedores/addprovider";
import { AddProviderResponse } from "../../interfaces/proveedores/addprovider.interface";

export function useAddProvider() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AddProviderResponse | null>(null);

  const addProvider = async (name: string) => {
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AddProvider(name);
      setData(response);
      return response;
    } catch (err) {
      setError("Error al agregar proveedor");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addProvider, loading, error, data };
}
