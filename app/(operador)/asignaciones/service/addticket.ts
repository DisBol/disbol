import { apiCall } from "../../configuraciones/services/apiClient";
import { AddTicketResponse } from "../interfaces/addticket.interface";

export async function AddTicket(
  code: string,
  deferred_payment: string,
  total_payment: string,
  product_payment: string,
  AssignmentStage_id: string,
  total_container: number,
  total_units: number
): Promise<AddTicketResponse> {
  return apiCall("addticket", {
    code,
    deferred_payment,
    total_payment,
    product_payment,
    total_container,
    total_units,
    active: "true",
    AssignmentStage_id,
  });
}
