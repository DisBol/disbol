import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { GetCenterCostResponse } from "../interfaces/getcentercost.interface";

export async function GetCenterCost(): Promise<GetCenterCostResponse> {
	return apiCall("getcentercost", {
		active: "true",
	});
}
