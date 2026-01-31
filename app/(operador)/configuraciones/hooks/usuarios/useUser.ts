import { useState, useEffect } from "react";
import { GetUsers } from "../../services/usuarios/getuser";
import { Datum } from "../../interfaces/usuarios/user.interface";

export function useUser() {
  const [users, setUsers] = useState<Datum[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await GetUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Error al cargar usuarios");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, error, refetch: fetchUsers };
}
