export type EstadoVehiculo = "en_ruta" | "entregando" | "retornando";

export interface ParadaRuta {
  id: string;
  nombre: string;
  hora: string;
  ordenes: number;
  canastas: number;
  estadoEnvio: "ENTREGADO" | "ENVIADO";
  estadoPago: "PAGADO" | "PENDIENTE";
  lat: number;
  lng: number;
}

export interface Vehiculo {
  id: string;
  codigo: string;
  placa: string;
  chofer: string;
  ruta: string;
  estado: EstadoVehiculo;
  ordenesEntregadas: number;
  ordenesTotales: number;
  canastas: number;
  canastasTotal: number;
  lat: number;
  lng: number;
  paradas: ParadaRuta[];
}

export const ESTADO_LABELS: Record<EstadoVehiculo, string> = {
  en_ruta: "En ruta",
  entregando: "Entregando",
  retornando: "Retornando",
};

export const ESTADO_BADGE_STYLE: Record<EstadoVehiculo, React.CSSProperties> = {
  en_ruta: { backgroundColor: "#16a34a", color: "#fff" },
  entregando: { backgroundColor: "#2563eb", color: "#fff" },
  retornando: { backgroundColor: "#d97706", color: "#fff" },
};
