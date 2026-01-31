"use client";

import { useTransactionRole } from "@/app/(auth)/login/hooks/useTransactionRole";
import { useRoutePermissions } from "@/hooks/useRoutePermissions";

export function UserPermissionsDebug() {
  const { transactions, loading, error } = useTransactionRole();
  const { getAllowedRoutes } = useRoutePermissions();

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700">Cargando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  const allowedRoutes = getAllowedRoutes();

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-green-800 mb-3">
        Permisos del Usuario
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-green-700 mb-2">
            Transacciones Permitidas:
          </h4>
          <ul className="space-y-1">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="text-sm text-green-600">
                • {transaction.name}{" "}
                {transaction.active === "true" ? "✅" : "❌"}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-green-700 mb-2">Rutas Accesibles:</h4>
          <ul className="space-y-1">
            {allowedRoutes.map((route) => (
              <li key={route} className="text-sm text-green-600">
                • {route}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
