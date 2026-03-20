import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateTicketResponse } from "../interfaces/updateticket.interface";

export async function UpdateTicket(
  id: string,
  code: string,
  deferred_payment: string,
  total_payment: string,
  product_payment: string,
  active: string,
  AssignmentStage_id: number,
  total_container: number,
  total_units: number,
): Promise<UpdateTicketResponse> {
  return apiCall("updateticket", {
    id,
    code,
    deferred_payment,
    total_payment,
    product_payment,
    active,
    AssignmentStage_id,
    total_container,
    total_units,
  });
}
