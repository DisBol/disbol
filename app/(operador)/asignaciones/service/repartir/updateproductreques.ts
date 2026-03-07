import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateProductRequestResponse } from "../../interfaces/repartir/updateproductrequest.interface";

export async function UpdateProductRequest(
  id: number,
  containers: number,
  units: number,
  menudencia: string,
  net_weight: number,
  gross_weight: number,
  payment: number,
  active: string,
  RequestStage_id: number,
  Product_id: number,
): Promise<UpdateProductRequestResponse> {
  return apiCall("updateproductrequest", {
    id,
    containers,
    units,
    menudencia,
    net_weight,
    gross_weight,
    payment,
    active,
    RequestStage_id,
    Product_id,
  });
}
