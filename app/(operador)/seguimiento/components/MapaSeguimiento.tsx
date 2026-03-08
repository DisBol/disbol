"use client";

import { useEffect, useRef } from "react";
import type { Geofence } from "../../configuraciones/services/monnet/getGeofences";
import type { Datum } from "../interface/getrequestbycar.interface";

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
  seleccionado?: Datum;
}

export default function MapaSeguimiento({
  vehiculosEnVivo,
  zonasPoligonales,
  seleccionado,
}: MapaSeguimientoProps) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

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

      if (seleccionado) {
        // Fallback temporal para tus datos de prueba: Si la BD dice "SOFIA", usamos "5231-KSB"
        const targetPlaca =
          seleccionado.Provider_name === "SOFIA"
            ? "5231-KSB"
            : seleccionado.Provider_name;

        vehicleToCenter = vehiculosEnVivo.find(
          (v) => v.nombreCompleto === targetPlaca || v.id === targetPlaca,
        );

        if (vehicleToCenter) {
          vehiclesToRender = [vehicleToCenter];
        } else {
          // If no match is found, show nothing to indicate mismatch, or you could change to show all
          vehiclesToRender = [];
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
          // Marker doesn't exist, create it
          const iconUrl =
            v.icono &&
            !v.icono.startsWith(".") &&
            v.icono !== "default-icon.png"
              ? v.icono
              : "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";

          const iconToUse = L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            shadowSize: [41, 41],
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
  }, [vehiculosEnVivo, zonasPoligonales, seleccionado]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
