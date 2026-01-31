import { useState } from "react";
import { AddUser } from "../../services/usuarios/adduser";

export function useAddUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (
    username: string,
    password: string,
    Role_id: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddUser(username, password, Role_id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, error };
}
