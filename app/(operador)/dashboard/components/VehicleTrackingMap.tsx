"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Mock data for vehicles
const vehicles = [
  {
    id: 1,
    name: "Camión 01",
    lat: -16.5,
    lng: -68.1193,
    status: "En movimiento",
    lastUpdate: "Hace 2 min",
  }, // Near La Paz center
  {
    id: 2,
    name: "Furgoneta 03",
    lat: -16.51,
    lng: -68.125,
    status: "Detenido",
    lastUpdate: "Hace 15 min",
  },
  {
    id: 3,
    name: "Moto 05",
    lat: -16.495,
    lng: -68.13,
    status: "En entrega",
    lastUpdate: "Hace 5 min",
  },
  {
    id: 4,
    name: "Camión 02",
    lat: -16.52,
    lng: -68.11,
    status: "En ruta",
    lastUpdate: "Hace 1 min",
  },
];

export default function VehicleTrackingMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 w-full bg-slate-100 animate-pulse rounded-lg"></div>
    );
  }

  // Center the map roughly around the vehicles
  const centerPosition: [number, number] = [-16.505, -68.12];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-slate-800">
          Seguimiento de Vehículos en Tiempo Real
        </h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {vehicles.length} Unidades Activas
        </span>
      </div>

      <div className="h-[400px] w-full rounded-lg overflow-hidden relative z-0">
        <MapContainer
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
