import { apiCall } from "../../configuraciones/services/apiClient";
import { AddRequestRequestSatateResponse } from "../interfaces/addrequestrequeststate.interface";

export async function AddRequestRequestState(
    Request_id: number
): Promise<AddRequestRequestSatateResponse> {
    return apiCall("addrequestrequeststate", {
        RequestState_id: 1,
        Request_id,
        active: "true",
    });
}
