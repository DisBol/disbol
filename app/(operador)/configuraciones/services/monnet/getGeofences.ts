export interface GeofencePoint {
  lat: number;
  lng: number;
}

export interface Geofence {
  idCerca: number;
  idtipo_cerca: number;
  tipo_cerca: string;
  nombre: string;
  color: string;
  puntos: GeofencePoint[];
  radio: number;
  limite_velocidad: number;
  solo_mi_usuario: number;
  visible: number;
  umbral: {
    puntos_poligono: GeofencePoint[];
    tolerancia: number;
  };
  grupo: string;
  compartida: number;
}

export interface GeofencesResponse {
  status: number;
  data: Geofence[];
}

export async function getGeofences(token: string): Promise<Geofence[]> {
  const baseUrl = process.env.NEXT_MONNET_API;
  const apiKey = process.env.MONNET_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Monnet API configuration missing");
  }

  const formData = new FormData();
  formData.append("apikey", apiKey);
  formData.append("token", token);

  const response = await fetch(`${baseUrl}/getGeofences`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to get geofences: ${response.statusText}`);
  }

  const result: GeofencesResponse = await response.json();

  if (result.status !== 200) {
    throw new Error(`Geofences API error: Status ${result.status}`);
  }

  return result.data;
}
