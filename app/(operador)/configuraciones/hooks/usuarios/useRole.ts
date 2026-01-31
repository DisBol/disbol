import { useState, useEffect } from "react";
import { GetRoles } from "../../services/usuarios/getrole";
import { Datum } from "../../interfaces/usuarios/role.interface";

export function useRole() {
  const [roles, setRoles] = useState<Datum[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await GetRoles();
      setRoles(response.data);
    } catch (err) {
      setError("Error al cargar roles");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, isLoading, error, refetch: fetchRoles };
}
