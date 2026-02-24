import { getMonnetToken } from "./getToken";
import { getGeofences, type Geofence } from "./getGeofences";

export interface MonnetGeofencesService {
  getGeofencesList: () => Promise<Geofence[]>;
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
}

export const monnetService = new MonnetService();

export * from "./getToken";
export * from "./getGeofences";
export * from "./vehicleGetAll";
