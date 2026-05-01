import { apiCall } from "../../configuraciones/services/apiClient";
import { AddTicketResponse } from "../interfaces/addticket.interface";

export async function AddTicket(
  code: string,
  deferred_payment: string,
  total_payment: string,
  product_payment: string,
  AssignmentStage_id: number,
  total_container: string,
  total_units: string,
  ticket_payment: number,
  Account_id: number
): Promise<AddTicketResponse> {
  return apiCall("addticket", {
    code,
    deferred_payment,
    total_payment,
    total_container,
    total_units,
    product_payment,
    active: "true",
    AssignmentStage_id,
    ticket_payment,
    Account_id,
  });
}
