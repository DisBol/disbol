import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateProductAssignmentResponse } from "../interfaces/updateproductassignment.interface";

export async function UpdateProductAssignment(
  id: string,
  container: number,
  units: number,
  menudencia: string,
  net_weight: string,
  gross_weight: string,
  payment: string,
  active: string,
  Tickets_id: string,
  Product_id: string,
): Promise<UpdateProductAssignmentResponse> {
  return apiCall("updateproductassignment", {
    id,
    container,
    units,
    menudencia,
    net_weight,
    gross_weight,
    payment,
    active,
    Tickets_id,
    Product_id,
  });
}
