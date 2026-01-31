import { useState, useCallback } from "react";
import { GetTransaction } from "../../services/usuarios/gettransacton";
import { Datum } from "../../interfaces/usuarios/transaction.interface";

interface UseTransactionReturn {
  transactions: Datum[];
  getTransactions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useTransaction(): UseTransactionReturn {
  const [transactions, setTransactions] = useState<Datum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await GetTransaction();
      setTransactions(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al obtener las transacciones";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { transactions, getTransactions, isLoading, error };
}
