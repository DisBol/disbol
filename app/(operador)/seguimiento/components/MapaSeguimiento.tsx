"use client";

import { useEffect, useRef } from "react";
import type { Geofence } from "../../configuraciones/services/monnet/getGeofences";
import { useCarStore } from "../store/useCarStore";
import { Datum as RequestDatum } from "../interface/getrequestbycar.interface";

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

const createChickenIconDataUrl = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g fill="none">
        <path fill="#9b9b9b" d="M30.356 26.452L27.71 14.587c-.947-4.928-5.37-8.608-10.622-8.376c-1.592.069-3.018.848-4.221 1.941c-1.206 1.094-2.252 2.556-3.108 4.135C8.053 15.427 6.99 19.233 6.99 22v5.2c0 2.045 1.629 3.785 3.722 3.8a3.73 3.73 0 0 0 2.688-1.108A3.74 3.74 0 0 0 16.06 31a3.76 3.76 0 0 0 2.66-1.107A3.74 3.74 0 0 0 21.38 31a3.76 3.76 0 0 0 2.66-1.107a3.748 3.748 0 0 0 6.41-2.643v-.025l-.001-.025a4.5 4.5 0 0 0-.093-.748"></path>
        <path fill="#f9c23c" d="m9.3 16.66l.78.39c.63.31 1.03.96 1.03 1.67V21H7.82l-4.783-1.348a.92.92 0 0 1 .013-.632l.29-.72a6.14 6.14 0 0 1 4.85-3.79c.45-.06.84.28.84.73v.99c0 .18.11.35.27.43"></path>
        <path fill="#ffb02e" d="M3.34 20.11C4.3 21.08 6.18 22 7.82 22h3.29v-1.26l-.51-1.1H3.035c.05.17.165.33.305.47"></path>
        <path fill="#f8312f" d="M20.72 11.86v-.44a4.77 4.77 0 0 1-3.53-2.02c-.61.75-1.5 1.28-2.51 1.41a3.872 3.872 0 0 1-4 4.49C8.7 15.21 7.09 13.59 7 11.61a3.88 3.88 0 0 1 2.76-3.89c.33-.1.55-.4.55-.74v-.01c0-2.14 1.73-3.87 3.87-3.87c.56 0 1.09.12 1.57.33c.76.34 1.66.21 2.3-.33a4.72 4.72 0 0 1 3-1.1h.14c3.45.08 5.08 4.31 2.64 6.75zM9 23.5l-1.01 1.9c0 .88-.71 1.6-1.6 1.6c-1.14 0-1.91-1.16-1.48-2.22l.77-1.84c.24-.57.79-.94 1.41-.94h.9z"></path>
        <path fill="#fff" d="m29.38 26.67l-2.65-11.88c-.85-4.46-4.85-7.79-9.6-7.58c-5.13.22-9.14 4.52-9.14 9.65V27.2c0 1.52 1.21 2.79 2.73 2.8c.94.01 1.77-.46 2.28-1.18c.2-.28.61-.28.8 0c.5.71 1.32 1.18 2.26 1.18c.93 0 1.76-.47 2.26-1.18c.2-.28.61-.28.8 0c.5.71 1.32 1.18 2.26 1.18c.93 0 1.76-.47 2.26-1.18c.2-.28.61-.28.8 0c.5.71 1.32 1.18 2.26 1.18c1.52 0 2.75-1.23 2.75-2.75c-.01-.2-.03-.4-.07-.58"></path>
        <path fill="#212121" d="M13.5 18a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"></path>
      </g>
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
  rutasSeleccionadas?: RequestDatum[];
}

export default function MapaSeguimiento({
  vehiculosEnVivo,
  zonasPoligonales,
  rutasSeleccionadas,
}: MapaSeguimientoProps) {
  const { selectedCar } = useCarStore();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rutasMarkersRef = useRef<any[]>([]);
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

      // Clear previous client markers
      if (rutasMarkersRef.current.length > 0) {
        rutasMarkersRef.current.forEach((marker) => map.removeLayer(marker));
        rutasMarkersRef.current = [];
      }

      // Draw client route points
      if (rutasSeleccionadas && rutasSeleccionadas.length > 0) {
        rutasSeleccionadas.forEach((req) => {
          if (
            req.Client_lat &&
            req.Client_long &&
            !isNaN(req.Client_lat) &&
            !isNaN(req.Client_long)
          ) {
            const clientPopup = `
              <div style="font-size: 13px;">
                <b>${req.Client_name}</b><br/>
                REQ: ${req.Request_id}<br/>
                Estado: ${req.RequestState_name}<br/>
                Monto: Bs. ${req.RequestStage_payment || 0}
              </div>
            `;
            const clientIconUrl = createChickenIconDataUrl();
            const clientIcon = L.icon({
              iconUrl: clientIconUrl,
              iconSize: [28, 28],
              iconAnchor: [14, 28],
              popupAnchor: [0, -28],
            });

            const marker = L.marker([req.Client_lat, req.Client_long], {
              icon: clientIcon,
            })
              .bindPopup(clientPopup)
              .addTo(map);

            rutasMarkersRef.current.push(marker);
          }
        });
      }
    });

    // We no longer destroy the map instance inside the hook unless it's an unmount (see below)
  }, [vehiculosEnVivo, zonasPoligonales, selectedCar, rutasSeleccionadas]);

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
