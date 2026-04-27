import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateProducteRequestResponse } from "../interfaces/updateproductrequest.interface";

export async function UpdateProductRequest(
  id: number,
  containers: number,
  units: number,
  menudencia: boolean,
  net_weight: number,
  gross_weight: number,
  payment: number,
  active: boolean,
  RequestStage_id: number,
  Product_id: number,
): Promise<UpdateProducteRequestResponse> {
  return apiCall("updateproductrequest", {
    id,
    containers,
    units,
    menudencia: String(menudencia),
    net_weight,
    gross_weight,
    payment,
    active: String(active),
    RequestStage_id,
    Product_id,
  });
}
