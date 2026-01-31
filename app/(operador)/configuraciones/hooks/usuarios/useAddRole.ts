import { useState } from "react";
import { AddRole } from "../../services/usuarios/addrole";
import { AddRoleResponse } from "../../interfaces/usuarios/addrole";

interface UseAddRoleReturn {
  addRole: (name: string) => Promise<AddRoleResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useAddRole(): UseAddRoleReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRole = async (name: string): Promise<AddRoleResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AddRole(name);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el rol";
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { addRole, isLoading, error };
}
