export interface Cliente {
  nombre: string;
  ruta: string;
  canastos: number;
  ultimoMovimiento: string;
  moraDias: number;
}

export interface Movimiento {
  fecha: string;
  canastilla: string;
  cliente: string;
  grupo: string;
  cantidad: number;
}

export interface MovimientoProveedor {
  fecha: string;
  canastilla: string;
  proveedor: string;
  cantidad: number;
}

export interface RutaItem {
  nombre: string;
  canastos: number;
}
