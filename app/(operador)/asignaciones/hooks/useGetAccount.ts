import { useEffect, useState } from "react";
import { GetAccount } from "../service/getaccount";
import { Account } from "../interfaces/getaccount.interface";

interface UseGetAccountReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

export const useGetAccount = (): UseGetAccountReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await GetAccount("true");
        setAccounts(response.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar cuentas"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
  };
};
