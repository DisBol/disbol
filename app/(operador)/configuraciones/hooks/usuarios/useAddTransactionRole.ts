import { useState } from "react";
import { AddRoleTransaction } from "../../services/usuarios/addroletransaction";
import { AddRoleTransactionResponse } from "../../interfaces/usuarios/addroletransaction";

interface UseAddTransactionRoleReturn {
  addTransactionRole: (
    Transaction_id: number,
    Role_id: number,
  ) => Promise<AddRoleTransactionResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useAddTransactionRole(): UseAddTransactionRoleReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransactionRole = async (
    Transaction_id: number,
    Role_id: number,
  ): Promise<AddRoleTransactionResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AddRoleTransaction(Transaction_id, Role_id);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al asignar la transacción al rol";
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { addTransactionRole, isLoading, error };
}
