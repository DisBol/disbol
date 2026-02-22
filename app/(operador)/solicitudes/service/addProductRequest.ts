import { apiCall } from "../../configuraciones/services/apiClient";
import { AddProductrequestResponse } from "../interfaces/addproductrequest.interface";

export async function AddProductRequest(
  containers: number,
  units: number,
  menudencia: string,
  net_weight: number,
  gross_weight: number,
  payment: number,
  active: boolean,
  RequestStage_id: number,
  Product_id: number,
): Promise<AddProductrequestResponse> {
  return apiCall("addproductrequest", {
    containers,
    units,
    menudencia,
    net_weight,
    gross_weight,
    payment,
    active: active ? "true" : "false",
    RequestStage_id,
    Product_id,
  });
}
