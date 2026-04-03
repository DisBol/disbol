import type { Cliente, Movimiento, MovimientoProveedor, RutaItem } from "./types";

export const MAX_RUTA = 475;

export const clientes: Cliente[] = [
  { nombre: "Distribuidor Sucre", ruta: "Sucre Centro", canastos: 160, ultimoMovimiento: "2025-12-18", moraDias: 7 },
  { nombre: "Hotel Continental", ruta: "La Paz Centro", canastos: 130, ultimoMovimiento: "2025-12-11", moraDias: 16 },
  { nombre: "Supermercado Andino", ruta: "La Paz Centro", canastos: 110, ultimoMovimiento: "2025-12-14", moraDias: 12 },
  { nombre: "Restaurante La Cumbre", ruta: "La Paz Centro", canastos: 95, ultimoMovimiento: "2025-12-15", moraDias: 10 },
  { nombre: "Minimarket Plaza", ruta: "Sucre Centro", canastos: 90, ultimoMovimiento: "2025-12-12", moraDias: 15 },
  { nombre: "Carnicería Los Andes", ruta: "El Alto Sur", canastos: 85, ultimoMovimiento: "2025-12-13", moraDias: 14 },
  { nombre: "Doña Juana", ruta: "El Alto Sur", canastos: 80, ultimoMovimiento: "2025-12-21", moraDias: 3 },
  { nombre: "Mercado Central – Puesto 4", ruta: "La Paz Centro", canastos: 75, ultimoMovimiento: "2025-12-20", moraDias: 4 },
  { nombre: "Pollería El Rey", ruta: "El Alto Norte", canastos: 60, ultimoMovimiento: "2025-12-19", moraDias: 5 },
  { nombre: "Feria 16 de Julio – Sector A", ruta: "El Alto Norte", canastos: 55, ultimoMovimiento: "2025-12-17", moraDias: 7 },
];

export const movimientos: Movimiento[] = [
  { fecha: "2026-01-29 16:17:23", canastilla: "Canastilla Roja", cliente: "cliente ceja 1", grupo: "operation", cantidad: -1000 },
  { fecha: "2026-01-28 10:30:15", canastilla: "Canastilla Roja", cliente: "Pollería El Rey", grupo: "operation", cantidad: 500 },
  { fecha: "2026-01-27 14:45:22", canastilla: "Canastilla Azul", cliente: "Doña Juana", grupo: "retail", cantidad: -800 },
  { fecha: "2026-01-26 09:15:33", canastilla: "Canastilla Verde", cliente: "cliente ceja 1", grupo: "operation", cantidad: 300 },
  { fecha: "2026-01-25 11:22:44", canastilla: "Canastilla Roja", cliente: "Distribuidor Sucre", grupo: "retail", cantidad: -600 },
  { fecha: "2026-01-24 15:30:12", canastilla: "Canastilla Azul", cliente: "Pollería El Rey", grupo: "operation", cantidad: 400 },
  { fecha: "2026-01-23 13:18:56", canastilla: "Canastilla Verde", cliente: "Doña Juana", grupo: "retail", cantidad: -450 },
  { fecha: "2026-01-22 08:45:22", canastilla: "Canastilla Roja", cliente: "Mercado Central", grupo: "wholesale", cantidad: -700 },
  { fecha: "2026-01-21 12:00:00", canastilla: "Canastilla Azul", cliente: "cliente ceja 1", grupo: "operation", cantidad: 250 },
];

export const rutas: RutaItem[] = [
  { nombre: "La Paz Centro", canastos: 475 },
  { nombre: "El Alto Norte", canastos: 340 },
  { nombre: "Sucre Centro", canastos: 250 },
  { nombre: "El Alto Sur", canastos: 230 },
];

export const movimientosProveedor: MovimientoProveedor[] = [
  { fecha: "2026-01-28 20:26:40", canastilla: "Canastilla Roja", proveedor: "SOFIA", cantidad: 15 },
  { fecha: "2026-01-27 18:15:22", canastilla: "Canastilla Azul", proveedor: "TRANSPORTES BOLIVIA", cantidad: 20 },
  { fecha: "2026-01-26 14:30:00", canastilla: "Canastilla Verde", proveedor: "SOFIA", cantidad: 10 },
  { fecha: "2026-01-25 10:45:33", canastilla: "Canastilla Roja", proveedor: "LOGISTICA ANDINA", cantidad: 25 },
  { fecha: "2026-01-24 16:20:15", canastilla: "Canastilla Azul", proveedor: "SOFIA", cantidad: 18 },
  { fecha: "2026-01-23 12:00:00", canastilla: "Canastilla Verde", proveedor: "TRANSPORTES BOLIVIA", cantidad: 12 },
  { fecha: "2026-01-22 09:30:45", canastilla: "Canastilla Roja", proveedor: "LOGISTICA ANDINA", cantidad: 22 },
  { fecha: "2026-01-21 15:15:30", canastilla: "Canastilla Azul", proveedor: "SOFIA", cantidad: 16 },
  { fecha: "2026-01-20 11:45:00", canastilla: "Canastilla Verde", proveedor: "TRANSPORTES BOLIVIA", cantidad: 14 },
];
