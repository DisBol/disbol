import { getMonnetToken } from "./getToken";
import { getGeofences, type Geofence } from "./getGeofences";
import {
  getVehicleGetAllComplete,
  type VehicleComplete,
} from "./vehicleGetAllComplete";
import { getMonnetData, type UnitData } from "./getData";

export interface MonnetGeofencesService {
  getGeofencesList: () => Promise<Geofence[]>;
  getVehicleGetAllCompleteList: () => Promise<VehicleComplete[]>;
  getMonnetDataList: () => Promise<UnitData[]>;
}

class MonnetService implements MonnetGeofencesService {
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  private async getValidToken(): Promise<string> {
    // Si no hay token o ha expirado (asumimos que el token dura 1 hora)
    if (!this.token || !this.tokenExpiry || Date.now() > this.tokenExpiry) {
      this.token = await getMonnetToken();
      // Establecer expiración en 55 minutos (para renovar antes de que expire)
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;
    }
    return this.token;
  }

  async getGeofencesList(): Promise<Geofence[]> {
    const token = await this.getValidToken();
    return await getGeofences(token);
  }

  async getVehicleGetAllCompleteList(): Promise<VehicleComplete[]> {
    const token = await this.getValidToken();
    return await getVehicleGetAllComplete(token);
  }

  async getMonnetDataList(): Promise<UnitData[]> {
    const token = await this.getValidToken();
    return await getMonnetData(token);
  }
}

export const monnetService = new MonnetService();

export * from "./getToken";
export * from "./getGeofences";
export * from "./vehicleGetAll";
export * from "./vehicleGetAllComplete";
export * from "./getData";
