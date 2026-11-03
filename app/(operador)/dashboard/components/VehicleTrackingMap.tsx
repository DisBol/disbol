"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGetTrackingData } from "@/app/(operador)/seguimiento/hook/useGetTrackingData";
import { useGetVehicleComplete } from "@/app/(operador)/seguimiento/hook/useGetVehicleComplete";

// Fix para los íconos de Leaflet en Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DEFAULT_CENTER: [number, number] = [-16.505, -68.12];

function vehicleStatus(speed: number, ignition: boolean) {
  if (speed > 0) return "En movimiento";
  return ignition ? "Detenido (encendido)" : "Apagado";
}

export default function VehicleTrackingMap() {
  // Se carga con dynamic(..., { ssr: false }) desde el dashboard, así que no hay render en servidor.
  // Misma fuente que la pantalla Seguimiento: posiciones GPS de Monnet cada 30 s
  const { trackingData, error } = useGetTrackingData(30000);
  const { vehicles: vehiclesInfo } = useGetVehicleComplete();

  const vehicles = useMemo(
    () =>
      trackingData
        .map((gps) => {
          const info = vehiclesInfo.find(
            (v) => v.nombre === gps.UnitId || v.patente === gps.UnitPlate,
          );
          const speed = Number(gps.GpsSpeed) || 0;
          return {
            id: gps.UnitId,
            name: info?.nombre || gps.UnitPlate || gps.UnitId,
            lat: parseFloat(gps.Latitude),
            lng: parseFloat(gps.Longitude),
            status: vehicleStatus(speed, gps.Ignition === "1"),
            speed,
            lastUpdate: gps.ReportDate,
          };
        })
        .filter((v) => Number.isFinite(v.lat) && Number.isFinite(v.lng)),
    [trackingData, vehiclesInfo],
  );

  // Centro: promedio de las posiciones de los vehículos
  const centerPosition: [number, number] =
    vehicles.length > 0
      ? [
          vehicles.reduce((sum, v) => sum + v.lat, 0) / vehicles.length,
          vehicles.reduce((sum, v) => sum + v.lng, 0) / vehicles.length,
        ]
      : DEFAULT_CENTER;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-slate-800">
          Seguimiento de Vehículos en Tiempo Real
        </h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {vehicles.filter((v) => v.speed > 0).length} en movimiento ·{" "}
          {vehicles.length} unidades
        </span>
      </div>
      {error && (
        <p className="mb-2 text-xs text-rose-600">
          No se pudo obtener la ubicación de los vehículos: {error}
        </p>
      )}

      <div className="h-[400px] w-full rounded-lg overflow-hidden relative z-0">
        <MapContainer
          key={vehicles.length > 0 ? "con-vehiculos" : "sin-vehiculos"}
          center={centerPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {vehicles.map((vehicle) => (
            <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm mb-1">{vehicle.name}</h3>
                  <p className="text-xs text-slate-600">
                    Estado:{" "}
                    <span className="font-medium text-slate-800">
                      {vehicle.status}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Velocidad:{" "}
                    <span className="font-medium text-slate-800">
                      {vehicle.speed} km/h
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {vehicle.lastUpdate}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
