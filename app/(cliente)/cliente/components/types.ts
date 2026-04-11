export const CODIGOS = ["104", "105", "106", "107", "108", "109", "110"] as const;
export type Codigo = (typeof CODIGOS)[number];

export interface ProductoInput {
  cajas: string;
  unidades: string;
}

export interface MovimientoCanasto {
  fecha: string;
  tipo: "entregado" | "devuelto";
  cantidad: number;
  saldo: number;
}

export const proveedores = [
  { value: "pio", label: "PIO" },
  { value: "alas", label: "ALAS" },
  { value: "sofia", label: "SOFIA" },
];

// Datos estáticos de ejemplo
export const extractoData: MovimientoCanasto[] = [
  { fecha: "2025-12-20", tipo: "entregado", cantidad: 5, saldo: 12 },
  { fecha: "2025-12-18", tipo: "devuelto", cantidad: 2, saldo: 14 },
  { fecha: "2025-12-15", tipo: "entregado", cantidad: 8, saldo: 6 },
  { fecha: "2025-12-10", tipo: "devuelto", cantidad: 1, saldo: 7 },
];
