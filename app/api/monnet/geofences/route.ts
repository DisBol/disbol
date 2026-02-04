import { NextResponse } from "next/server";

interface MonnetTokenResponse {
  status: number;
  data: string;
}

interface Geofence {
  idCerca: number;
  nombre: string;
  tipo_cerca: string;
  color: string;
  grupo: string;
  visible: number;
  // Otros campos opcionales
  puntos?: Array<{ lat: number; lng: number }>;
  radio?: number;
  limite_velocidad?: number;
  solo_mi_usuario?: number;
  compartida?: number;
}

interface GeofencesResponse {
  status: number;
  data: Geofence[];
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
    headers: {
      "Content-Type": "application/json",
    },
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

async function getGeofences(token: string): Promise<Geofence[]> {
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

export async function GET() {
  try {
    // Validar configuración
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
    const geofences = await getGeofences(token);

    // Filtrar solo geofences visibles
    const visibleGeofences = geofences.filter(
      (geofence) => geofence.visible === 1,
    );

    return NextResponse.json({
      success: true,
      data: visibleGeofences,
      total: visibleGeofences.length,
    });
  } catch (error) {
    console.error("Error fetching geofences:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener las rutas";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
