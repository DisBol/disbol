"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet en Next.js
//evitar esta linea de eslint

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

interface MapSelectorProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string | number;
}

// Componente para manejar los clicks en el mapa
const MapClickHandler: React.FC<{
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ onLocationChange }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });
  return null;
};

export const MapSelector: React.FC<MapSelectorProps> = ({
  lat,
  lng,
  onLocationChange,
  height = 256,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  // Actualizar la vista del mapa cuando cambien las coordenadas
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  }, [lat, lng]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
        }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
        <MapClickHandler onLocationChange={onLocationChange} />
      </MapContainer>

      {/* Información de coordenadas */}
      <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600 border-t">
        <span className="font-medium">Coordenadas:</span>
        <span className="ml-2">Lat: {lat.toFixed(6)}</span>
        <span className="ml-3">Lng: {lng.toFixed(6)}</span>
        <span className="ml-3 text-gray-500">
          • Haga clic en el mapa para cambiar la ubicación
        </span>
      </div>
    </div>
  );
};

export default MapSelector;
