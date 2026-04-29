// Mapeo centralizado de rutas a nombres de transacciones
export const ROUTE_TRANSACTION_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/solicitudes": "Solicitudes",
  "/asignaciones": "Asignaciones",
  "/seguimiento": "Seguimiento",
  "/canastos": "Canastos",
  "/chofer": "App Chofer",
  "/configuraciones": "Configuracion",
} as const;

export type AllowedRoute = keyof typeof ROUTE_TRANSACTION_MAP;
export type TransactionName = (typeof ROUTE_TRANSACTION_MAP)[AllowedRoute];
