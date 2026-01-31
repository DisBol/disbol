import { useState } from "react";
import { UpdateUser } from "../../services/usuarios/updateuser";

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (
    id: number,
    username: string,
    password: string,
    active: string,
    Role_id: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await UpdateUser(
        id,
        username,
        password,
        active,
        Role_id,
      );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}
