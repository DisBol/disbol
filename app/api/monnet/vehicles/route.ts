import { NextResponse } from "next/server";

interface MonnetTokenResponse {
  status: number;
  data: string;
}

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

interface VehicleGetAllResponse {
  status: number;
  data: Vehicle[];
}

async function getMonnetToken(): Promise<string> {
  const apiKey = process.env.MONNET_API_KEY;
  const username = process.env.MONNET_USERNAME;
  const password = process.env.MONNET_PASSWORD;
  const baseUrl = process.env.NEXT_MONNET_API;

  if (!apiKey || !username || !password || !baseUrl) {
    throw new Error("Monnet API credentials not configured");
  }

  const url = `${baseUrl}/gettoken?apikey=${apiKey}&token=&username=${username}&password=${password}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Monnet token: ${response.statusText}`);
  }

  const result: MonnetTokenResponse = await response.json();

  if (result.status !== 200) {
    throw new Error(`Monnet API error: Status ${result.status}`);
  }

  return result.data;
}

async function getAllVehicles(token: string): Promise<Vehicle[]> {
  const baseUrl = process.env.NEXT_MONNET_API;
  const apiKey = process.env.MONNET_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Monnet API configuration missing");
  }

  const formData = new FormData();
  formData.append("apikey", apiKey);
  formData.append("token", token);

  const response = await fetch(`${baseUrl}/vehicleGetAll`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to get vehicles: ${response.statusText}`);
  }

  const result: VehicleGetAllResponse = await response.json();

  if (result.status !== 200) {
    throw new Error(`Vehicles API error: Status ${result.status}`);
  }

  return result.data;
}

export async function GET() {
  try {
    const requiredEnvVars = [
      "NEXT_MONNET_API",
      "MONNET_API_KEY",
      "MONNET_USERNAME",
      "MONNET_PASSWORD",
    ];
    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return NextResponse.json(
        {
          success: false,
          error: `Configuración incompleta. Variables faltantes: ${missingVars.join(", ")}`,
        },
        { status: 500 },
      );
    }

    const token = await getMonnetToken();
    const vehicles = await getAllVehicles(token);

    return NextResponse.json({
      success: true,
      data: vehicles,
      total: vehicles.length,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener los vehículos";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
