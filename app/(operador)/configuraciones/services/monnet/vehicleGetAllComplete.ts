export interface VehicleComplete {
  id: string;
  nombre: string;
  patente: string;
  file_foto: string;
  idgps: string;
  gatewayip: string;
  conductor: string;
  grupo: string | null;
  marca: string | null;
  modelo: string;
  color: string;
  anio: string;
  numero_serie: string;
  num_economico: string;
  tipo_vehiculo: string;
  icono_vehiculo: string;
  ignorar_equipo: string;
  idequipo_gps: string;
  idtipo_vehiculo: string;
  idmarca_vehiculo: string;
  idconductor: string;
  idgrupo_vehiculo: string;
}

export interface VehicleGetAllCompleteResponse {
  status: number;
  data: VehicleComplete[];
}

export async function getVehicleGetAllComplete(
  token: string,
): Promise<VehicleComplete[]> {
  const baseUrl = process.env.NEXT_MONNET_API;
  const apiKey = process.env.MONNET_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Monnet API configuration missing");
  }

  const formData = new FormData();
  formData.append("apikey", apiKey);
  formData.append("token", token);

  const response = await fetch(`${baseUrl}/vehicleGetAllComplete`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get vehicleGetAllComplete: ${response.statusText}`,
    );
  }

  const result: VehicleGetAllCompleteResponse = await response.json();

  if (result.status !== 200) {
    throw new Error(`Monnet API error: Status ${result.status}`);
  }

  return result.data;
}
