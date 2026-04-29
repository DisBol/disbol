import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";

export async function entregarSolicitud(Request_id: number): Promise<unknown> {
  return apiCall("addrequestrequeststate", {
    RequestState_id: 3,
    Request_id,
    active: "true",
  });
}
