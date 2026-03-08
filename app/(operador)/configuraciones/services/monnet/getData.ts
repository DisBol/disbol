export interface UnitData {
  UnitId: string;
  UnitPlate: string;
  GpsIdentif: string;
  ReportDate: string;
  Latitude: string;
  Longitude: string;
  UrlLocation: string;
  Altitude: number;
  GpsSpeed: string;
  Direction: string;
  Satellites: string;
  Ignition: string;
  Odometer: string;
  IdEvento: string;
  Domicilio: string;
  Puerto: number;
  IpOrigen: number;
  BateriaGps: string;
  BateriaVeh: string;
  Grupo: string | null;
  Conductor: string;
  Inputs: string;
  TipoDato: string;
  Senal: string;
  InsertionDate: string;
  Gmt: string;
  Sensores: string;
}

export interface GetDataResponse {
  status: number;
  data: UnitData[];
}

export async function getMonnetData(token: string): Promise<UnitData[]> {
  const baseUrl = process.env.NEXT_MONNET_API;
  const apiKey = process.env.MONNET_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Monnet API configuration missing");
  }

  const formData = new FormData();
  formData.append("apikey", apiKey);
  formData.append("token", token);

  const response = await fetch(`${baseUrl}/getdata`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to get data: ${response.statusText}`);
  }

  const result: GetDataResponse = await response.json();

  if (result.status !== 200) {
    throw new Error(`Monnet API error: Status ${result.status}`);
  }

  return result.data;
}
