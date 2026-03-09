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
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none"><path fill="url(#SVGIH9hheJl)" d="M2 6.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z"/><path fill="url(#SVGtHh0TdOD)" fill-opacity="0.8" d="M4 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15H4z"/><path fill="url(#SVGohUsNeAJ)" fill-opacity="0.8" d="M9 9.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z"/><path fill="url(#SVGW11LtdeX)" d="M7 2.5V1H4.5a.5.5 0 0 0-.312.11l-2.5 2c-.12.095-.164.24-.18.388L1.5 3.5v2a2.5 2.5 0 0 0 5 0v-2l-.417-.083z"/><path fill="url(#SVGaEDFociw)" d="M14.493 3.499c-.015-.149-.06-.293-.18-.39l-2.5-2A.5.5 0 0 0 11.5 1H9v1.5l.917.917L9.5 3.5v2a2.5 2.5 0 0 0 5 0v-2z"/><path fill="url(#SVGQUxYrdcs)" d="m9.5 1l1 2.5v2a2.5 2.5 0 0 1-5 0v-2l1-2.5z"/><defs><linearGradient id="SVGIH9hheJl" x1="5" x2="6.567" y1="6.818" y2="15.436" gradientUnits="userSpaceOnUse"><stop offset=".312" stop-color="#29c3ff"/><stop offset="1" stop-color="#0094f0"/></linearGradient><linearGradient id="SVGtHh0TdOD" x1="4.143" x2="8.022" y1="10.125" y2="12.812" gradientUnits="userSpaceOnUse"><stop stop-color="#0067bf"/><stop offset="1" stop-color="#003580"/></linearGradient><linearGradient id="SVGohUsNeAJ" x1="9.9" x2="10.996" y1="8.667" y2="12.612" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd"/><stop offset="1" stop-color="#b3e0ff"/></linearGradient><linearGradient id="SVGW11LtdeX" x1="4.038" x2="4.038" y1="1" y2="4.063" gradientUnits="userSpaceOnUse"><stop stop-color="#fb6f7b"/><stop offset="1" stop-color="#d7257d"/></linearGradient><linearGradient id="SVGaEDFociw" x1="11.539" x2="11.539" y1="1" y2="4.063" gradientUnits="userSpaceOnUse"><stop stop-color="#fb6f7b"/><stop offset="1" stop-color="#d7257d"/></linearGradient><linearGradient id="SVGQUxYrdcs" x1="8" x2="8" y1="1" y2="4.063" gradientUnits="userSpaceOnUse"><stop offset=".304" stop-color="#ff9fb2"/><stop offset="1" stop-color="#f97dbd"/></linearGradient></defs></g></svg>
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
