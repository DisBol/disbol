import { monnetService } from "@/app/(operador)/configuraciones/services/monnet";
import { NextResponse } from "next/server";

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

    const vehiclesComplete = await monnetService.getVehicleGetAllCompleteList();

    return NextResponse.json({
      success: true,
      data: vehiclesComplete,
      total: vehiclesComplete.length,
    });
  } catch (error) {
    console.error("Error fetching vehiclesComplete:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener los vehículos completos";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
