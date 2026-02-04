export interface Geofence {
  id: number;
  name: string;
  description?: string;
  type?: string;
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

  const response = await fetch(`${baseUrl}/getGeofences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apikey: apiKey,
      token: token,
    }),
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
