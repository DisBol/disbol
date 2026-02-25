export interface Vehicle {
  id: string;
  nombre: string;
  patente: string;
  idgps: string;
  gatewayip: string;
  conductor: string;
  grupo: string | null;
  marca: string | null;
  modelo: string;
  color: string;
  anio: string;
  numero_serie: string;
  odometro: string;
  tipo_vehiculo: string;
  notas: string;
  idgrupo_vehiculo: string;
}

interface VehiclesApiResponse {
  success: boolean;
  data: Vehicle[];
  total?: number;
  error?: string;
}

export async function vehicleGetAll(): Promise<Vehicle[]> {
  const response = await fetch("/api/monnet/vehicles", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener vehículos: ${response.statusText}`);
  }

  const result: VehiclesApiResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error ?? "Error desconocido al obtener vehículos");
  }

  return result.data;
}
