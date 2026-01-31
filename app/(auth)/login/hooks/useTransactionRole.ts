"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { GetTransactionRole } from "../services/gettransactionrole";
import {
  GetTransactionRoleResponse,
  Datum,
} from "../interfaces/gettransactionrole.interface";

export function useTransactionRole() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      if (status === "loading") return;

      if (!session?.user?.roleId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response: GetTransactionRoleResponse = await GetTransactionRole(
          session.user.roleId,
        );
        setTransactions(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Error al cargar las transacciones permitidas");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [session?.user?.roleId, status]);

  const hasAccess = useCallback(
    (transactionName: string): boolean => {
      return transactions.some(
        (transaction) =>
          transaction.name.toLowerCase() === transactionName.toLowerCase() &&
          transaction.active === "true",
      );
    },
    [transactions],
  );

  const getActiveTransactions = useMemo((): Datum[] => {
    return transactions.filter((transaction) => transaction.active === "true");
  }, [transactions]);

  return {
    transactions,
    loading,
    error,
    hasAccess,
    getActiveTransactions,
  };
}
