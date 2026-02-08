import { apiCall } from "../../configuraciones/services/apiClient";
import { AddProductrequestResponse } from "../interfaces/addproductrequest.interface";

export async function AddProductRequest(
  containers: number,
  units: number,
  menudencia: string, // prompt says "true" string, keeping it string or maybe check interface? Let's use string to be safe based on prompt "true", but usually boolean. Prompt says "active":"true", "menudencia":"true".
  net_weight: number,
  gross_weight: number,
  payment: number,
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
    active: "true",
    RequestStage_id,
    Product_id,
  });
}
