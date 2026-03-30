import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddAssignmentRequestResponse } from "../../interfaces/planificar/addassignmentrequest.interface";

export async function AddAssignmentRequest(
    Assignment_id: number,
    Request_id: number,
    active: string
): Promise<AddAssignmentRequestResponse> {
    return apiCall("addassignmentrequest", {
        Assignment_id,
        Request_id,
        active
    });
}
