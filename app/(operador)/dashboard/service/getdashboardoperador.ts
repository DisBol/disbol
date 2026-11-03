import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetDashboardOperadorResponse } from "../interfaces/getdashboardoperador.interface";

// fecha: día local 'YYYY-MM-DD'
export async function GetDashboardOperador(
  fecha: string,
): Promise<GetDashboardOperadorResponse> {
  return apiCall("getdashboardoperador", { fecha });
}
