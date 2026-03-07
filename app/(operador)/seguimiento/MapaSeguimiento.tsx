"use client";

import { useEffect, useRef } from "react";

export interface Parada {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  tipo: "entregado" | "pendiente" | "actual";
}

interface Props {
  paradas: Parada[];
  centroLat?: number;
  centroLng?: number;
}

export default function MapaSeguimiento({
  paradas,
  centroLat = -16.5,
  centroLng = -68.15,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // Avoid double-init
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [centroLat, centroLng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom icons
      const redIcon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:34px;position:relative;">
          <svg viewBox="0 0 28 34" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 28 14 28s14-18.667 14-28C28 6.268 21.732 0 14 0z" fill="#e53e3e"/>
            <circle cx="14" cy="14" r="6" fill="white"/>
          </svg>
        </div>`,
        iconSize: [28, 34],
        iconAnchor: [14, 34],
      });

      const blueIcon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:34px;position:relative;">
          <svg viewBox="0 0 28 34" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 28 14 28s14-18.667 14-28C28 6.268 21.732 0 14 0z" fill="#3b82f6"/>
            <circle cx="14" cy="14" r="6" fill="white"/>
          </svg>
        </div>`,
        iconSize: [28, 34],
        iconAnchor: [14, 34],
      });

      const latlngs: [number, number][] = [];

      paradas.forEach((p) => {
        const icon =
          p.tipo === "actual"
            ? redIcon
            : p.tipo === "pendiente"
              ? blueIcon
              : redIcon;
        L.marker([p.lat, p.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${p.nombre}</b>`);
        latlngs.push([p.lat, p.lng]);
      });

      // Draw dashed route line
      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: "#374151",
          weight: 1.5,
          dashArray: "6 6",
          opacity: 0.7,
        }).addTo(map);
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
