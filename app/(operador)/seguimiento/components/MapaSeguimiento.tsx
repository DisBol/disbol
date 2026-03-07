"use client";

import { useEffect, useRef } from "react";
import { Vehiculo } from "../types";

interface MapaSeguimientoProps {
  vehiculos: Vehiculo[];
  seleccionado: Vehiculo;
}

export default function MapaSeguimiento({
  vehiculos,
  seleccionado,
}: MapaSeguimientoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

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
        center: [-16.505, -68.135],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const makeMarkerIcon = (color: string) =>
        L.divIcon({
          className: "",
          html: `<svg viewBox="0 0 28 40" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.3 0 0 6.3 0 14c0 9.5 14 30 14 30s14-20.5 14-30C28 6.3 21.7 0 14 0z"
              fill="${color}" stroke="white" stroke-width="1.5"/>
            <circle cx="14" cy="14" r="5" fill="white"/>
          </svg>`,
          iconSize: [28, 40],
          iconAnchor: [14, 40],
          popupAnchor: [0, -42],
        });

      const redIcon = makeMarkerIcon("#dc2626");
      const blueIcon = makeMarkerIcon("#2563eb");
      const grayIcon = makeMarkerIcon("#6b7280");

      vehiculos.forEach((v) => {
        const icon =
          v.estado === "retornando"
            ? blueIcon
            : v.estado === "en_ruta"
              ? redIcon
              : grayIcon;
        L.marker([v.lat, v.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:12px;min-width:160px;">
              <b style="font-size:13px;">${v.codigo} · ${v.placa}</b><br/>
              <span style="color:#6b7280;">Chofer: ${v.chofer}</span><br/>
              <span style="color:#6b7280;">Ruta: ${v.ruta}</span>
            </div>`,
          );
      });

      // Draw dashed polyline + stop markers for selected vehicle
      const coords: [number, number][] = [];

      seleccionado.paradas.forEach((p) => {
        coords.push([p.lat, p.lng]);

        const stopColor = p.estadoEnvio === "ENTREGADO" ? "#dc2626" : "#2563eb";
        const stopIcon = makeMarkerIcon(stopColor);

        const estadoColor =
          p.estadoEnvio === "ENTREGADO" ? "#16a34a" : "#d97706";
        const pagoLabel = p.estadoPago === "PAGADO" ? "SÍ" : "NO";
        const pagoColor = p.estadoPago === "PAGADO" ? "#16a34a" : "#dc2626";

        L.marker([p.lat, p.lng], { icon: stopIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:12px;min-width:180px;line-height:1.6;">
              <b style="font-size:13px;display:block;margin-bottom:4px;">📍 ${p.nombre}</b>
              <span style="color:#6b7280;">Ruta: </span>${seleccionado.ruta}<br/>
              <span style="color:#6b7280;">Vehículo: </span>${seleccionado.codigo}<br/>
              <span style="color:#6b7280;">Chofer: </span>${seleccionado.chofer}<br/>
              <span style="color:#6b7280;">Órdenes: </span>${p.ordenes}<br/>
              <span style="color:#6b7280;">Canastos: </span>${p.canastas}<br/>
              <span style="color:#6b7280;">Estado: </span>
                <span style="background:${estadoColor};color:white;padding:1px 6px;border-radius:3px;font-size:11px;font-weight:700;">${p.estadoEnvio}</span><br/>
              <span style="color:#6b7280;">Pago: </span>
                <span style="color:${pagoColor};font-weight:700;">${pagoLabel}</span><br/>
              <span style="color:#6b7280;">Hora: </span>${p.hora}
            </div>`,
            { maxWidth: 240 },
          );
      });

      if (coords.length > 1) {
        L.polyline(coords, {
          color: "#1f2937",
          weight: 1.5,
          dashArray: "6 5",
          opacity: 0.65,
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
  }, [seleccionado.id]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
