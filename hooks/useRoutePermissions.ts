"use client";

import { useCallback } from "react";
import { useTransactionRole } from "@/app/(auth)/login/hooks/useTransactionRole";
import { ROUTE_TRANSACTION_MAP } from "../constants/route-permissions";

export function useRoutePermissions() {
  const { hasAccess, getActiveTransactions, loading, error } =
    useTransactionRole();

  const canAccess = useCallback(
    (route: string): boolean => {
      const transactionName = ROUTE_TRANSACTION_MAP[route];
      return transactionName ? hasAccess(transactionName) : false;
    },
    [hasAccess],
  );

  const getAllowedRoutes = useCallback((): string[] => {
    return Object.keys(ROUTE_TRANSACTION_MAP).filter((route) =>
      canAccess(route),
    );
  }, [canAccess]);

  return {
    canAccess,
    getAllowedRoutes,
    getActiveTransactions,
    loading,
    error,
  };
}
