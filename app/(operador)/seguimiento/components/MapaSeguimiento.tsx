"use client";

import { useEffect, useRef } from "react";
import type { Geofence } from "../../configuraciones/services/monnet/getGeofences";
import { useCarStore } from "../store/useCarStore";

// Create truck icon as data URL
const createTruckIconDataUrl = (color = "#dd2e44") => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36">
      <path fill="${color}" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"></path>
      <path fill="#ffcc4d" d="m19 13l-.979-1H7.146C4 12 3 14 3 14l-3 5.959V25h19z"></path>
      <path fill="#55acee" d="M9 20H2l2-4s1-2 3-2h2z"></path>
      <circle cx="9" cy="31" r="4" fill="#292f33"></circle>
      <circle cx="9" cy="31" r="2" fill="#ccd6dd"></circle>
      <circle cx="27" cy="31" r="4" fill="#292f33"></circle>
      <circle cx="27" cy="31" r="2" fill="#ccd6dd"></circle>
      <path fill="#dd2e44" d="M32 8H17a4 4 0 0 0-4 4v13h23V12a4 4 0 0 0-4-4"></path>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

export interface VehiculoEnVivo {
  lat: number;
  lng: number;
  id: string;
  velocidad: string;
  encendido: boolean;
  bateriaGps: string;
  bateriaVehiculo: string;
  icono: string;
  tipoVehiculo: string;
  nombreCompleto: string;
}

interface MapaSeguimientoProps {
  vehiculosEnVivo: VehiculoEnVivo[];
  zonasPoligonales: Geofence[];
}

export default function MapaSeguimiento({
  vehiculosEnVivo,
  zonasPoligonales,
}: MapaSeguimientoProps) {
  const { selectedCar } = useCarStore();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ [key: string]: any }>({});
  const polygonsAddedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      // Initialize map only once
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current!, {
          center: [-16.505, -68.135], // Generic start coordinates
          zoom: 12,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Draw polygons once
      if (!polygonsAddedRef.current && zonasPoligonales.length > 0) {
        zonasPoligonales.forEach((geofence) => {
          if (geofence.puntos && geofence.puntos.length > 0) {
            const latlngs = geofence.puntos.map(
              (p) => [p.lat, p.lng] as [number, number],
            );
            L.polygon(latlngs, {
              color: geofence.color || "#B80028",
              fillColor: geofence.color || "#B80028",
              fillOpacity: 0.2,
            })
              .bindPopup(
                `<b>${geofence.nombre}</b><br/>Tipo: ${geofence.tipo_cerca}`,
              )
              .addTo(map);
          }
        });
        polygonsAddedRef.current = true;
      }

      // Filter logic: show ONLY the selected vehicle if there's a selection
      let vehicleToCenter: VehiculoEnVivo | undefined = undefined;
      let vehiclesToRender = vehiculosEnVivo;

      if (selectedCar) {
        // Find vehicle by license plate or name
        vehicleToCenter = vehiculosEnVivo.find(
          (v) =>
            v.nombreCompleto === selectedCar.license ||
            v.id === selectedCar.license ||
            v.nombreCompleto === selectedCar.name ||
            v.id === selectedCar.idCar,
        );

        if (vehicleToCenter) {
          vehiclesToRender = [vehicleToCenter];
        } else {
          // If no match is found, show all vehicles but highlight none
          vehiclesToRender = vehiculosEnVivo;
        }
      }

      // Add or update vehicle markers
      vehiclesToRender.forEach((v) => {
        const id = v.id;
        const latlng = [v.lat, v.lng] as [number, number];

        // Ensure array latitude/longitude is valid
        if (isNaN(v.lat) || isNaN(v.lng)) return;

        const popupContent = `
          <div style="font-size: 13px;">
            <b>${v.nombreCompleto}</b><br/>
            Tipo: ${v.tipoVehiculo}<br/>
            Velocidad: <b>${v.velocidad} km/h</b><br/>
            Motor: <span style="color: ${
              v.encendido ? "green" : "red"
            }">${v.encendido ? "Encendido" : "Apagado"}</span><br/>
            Bateria (GPS): ${v.bateriaGps}% | (Vehículo): ${v.bateriaVehiculo}V
          </div>
        `;

        if (markersRef.current[id]) {
          // Marker already exists, update position and popup content smoothly
          markersRef.current[id].setLatLng(latlng);
          markersRef.current[id].getPopup().setContent(popupContent);
        } else {
          // Marker doesn't exist, create it with truck icon
          const isSelectedVehicle =
            selectedCar &&
            (v.nombreCompleto === selectedCar.license ||
              v.id === selectedCar.license ||
              v.nombreCompleto === selectedCar.name ||
              v.id === selectedCar.idCar);

          const iconColor = isSelectedVehicle ? "#dc2626" : "#dd2e44";
          const iconUrl = createTruckIconDataUrl(iconColor);

          const iconToUse = L.icon({
            iconUrl: iconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
          });

          const marker = L.marker(latlng, { icon: iconToUse })
            .bindPopup(popupContent)
            .addTo(map);

          markersRef.current[id] = marker;
        }
      });

      // Remove markers for vehicles no longer in list
      const activeIds = new Set(vehiclesToRender.map((v) => v.id));
      Object.keys(markersRef.current).forEach((id) => {
        if (!activeIds.has(id)) {
          map.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });

      // Focus map to the selected vehicle based on the match
      if (vehicleToCenter) {
        map.flyTo([vehicleToCenter.lat, vehicleToCenter.lng], 15, {
          animate: true,
          duration: 1.5,
        });
        if (markersRef.current[vehicleToCenter.id]) {
          markersRef.current[vehicleToCenter.id].openPopup();
        }
      }
    });

    // We no longer destroy the map instance inside the hook unless it's an unmount (see below)
  }, [vehiculosEnVivo, zonasPoligonales, selectedCar]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />
  );
}
