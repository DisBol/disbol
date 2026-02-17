import { apiCall } from "../../configuraciones/services/apiClient";
import { AddProductAssignmentResponse } from "../interfaces/addproductassignment.interface";

export async function AddProductAssignment(
  container: number,
  units: number,
  menudencia: string,
  net_weight: string,
  gross_weight: string,
  payment: string,
  Tickets_id: string,
  Product_id: string,
): Promise<AddProductAssignmentResponse> {
  return apiCall("addproductassignment", {
    container,
    units,
    menudencia,
    net_weight,
    gross_weight,
    payment,
    active: "true",
    Tickets_id,
    Product_id,
  });
}
