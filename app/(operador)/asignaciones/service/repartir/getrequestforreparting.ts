import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetRequestForrepartingResponse } from "@/app/(operador)/asignaciones/interfaces/repartir/getrequestforreparting.interface";

export async function GetRequestForreparting(
  CategoryProvider_id: number,
  Employee_id: number = 0,
): Promise<GetRequestForrepartingResponse> {
  return apiCall("getrequestforreparting", {
    CategoryProvider_id: Number(CategoryProvider_id) || 0,
    Employee_id: 0, // Siempre 0 en el módulo de repartir del operador
  });
}
