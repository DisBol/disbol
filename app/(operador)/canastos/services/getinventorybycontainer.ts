import { GetInventoryByContainerResponse } from "../interfaces/getinventorybycontainer.interface";
import { apiCall } from "../../configuraciones/services/apiClient";

export async function GetInventoryByContainer(
    Container_id: number,
): Promise<GetInventoryByContainerResponse> {
    return apiCall("getinventorybycontainer", { Container_id: Container_id });
}
