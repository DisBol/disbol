"use client";

import { useEffect, useRef } from "react";

// Create truck icon as data URL
const createTruckIconDataUrl = (color = "#dc2626") => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 36 36">
      <path fill="${color}" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"></path>
      <path fill="#ffcc4d" d="m19 13l-.979-1H7.146C4 12 3 14 3 14l-3 5.959V25h19z"></path>
      <path fill="#55acee" d="M9 20H2l2-4s1-2 3-2h2z"></path>
      <circle cx="9" cy="31" r="4" fill="#292f33"></circle>
      <circle cx="9" cy="31" r="2" fill="#ccd6dd"></circle>
      <circle cx="27" cy="31" r="4" fill="#292f33"></circle>
      <circle cx="27" cy="31" r="2" fill="#ccd6dd"></circle>
      <path fill="${color}" d="M32 8H17a4 4 0 0 0-4 4v13h23V12a4 4 0 0 0-4-4"></path>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// Create client icon as data URL
const createClientIconDataUrl = (color = "#22c55e") => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="${color}"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

interface Cliente {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  monto: number;
  estado: "pendiente" | "entregado" | "pagado";
  solicitud: string;
}

interface MapaChofertProps {
  vehiculoLat: number;
  vehiculoLng: number;
  vehiculoNombre: string;
  clientes: Cliente[];
}

export default function MapaChofer({
  vehiculoLat,
  vehiculoLng,
  vehiculoNombre,
  clientes,
}: MapaChofertProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rutasMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      // Initialize map only once
      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [vehiculoLat, vehiculoLng],
          zoom: 14,
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

      // Add truck marker (current position)
      const truckIconUrl = createTruckIconDataUrl("#dc2626");
      const truckIcon = L.icon({
        iconUrl: truckIconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const truckPopup = `
        <div style="font-size: 13px;">
          <b>${vehiculoNombre}</b><br/>
          Posición actual
        </div>
      `;

      if (markersRef.current["truck"]) {
        markersRef.current["truck"].setLatLng([vehiculoLat, vehiculoLng]);
      } else {
        const marker = L.marker([vehiculoLat, vehiculoLng], {
          icon: truckIcon,
        })
          .bindPopup(truckPopup)
          .addTo(map);
        markersRef.current["truck"] = marker;
      }

      // Clear previous client markers
      if (rutasMarkersRef.current.length > 0) {
        rutasMarkersRef.current.forEach((marker) => map.removeLayer(marker));
        rutasMarkersRef.current = [];
      }

      // Add client markers
      clientes.forEach((cliente) => {
        if (!isNaN(cliente.lat) && !isNaN(cliente.lng)) {
          const colorByEstado = {
            pendiente: "#f59e0b",
            entregado: "#3b82f6",
            pagado: "#22c55e",
          };

          const clientIconUrl = createClientIconDataUrl(
            colorByEstado[cliente.estado],
          );
          const clientIcon = L.icon({
            iconUrl: clientIconUrl,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
          });

          const clientPopup = `
            <div style="font-size: 13px;">
              <b>${cliente.nombre}</b><br/>
              Solicitud: ${cliente.solicitud}<br/>
              Estado: <span style="color: ${colorByEstado[cliente.estado]}">${cliente.estado}</span><br/>
              Monto: Bs. ${cliente.monto}
            </div>
          `;

          const marker = L.marker([cliente.lat, cliente.lng], {
            icon: clientIcon,
          })
            .bindPopup(clientPopup)
            .addTo(map);

          rutasMarkersRef.current.push(marker);
        }
      });

      // Fit map to show all markers
      if (markersRef.current["truck"] || rutasMarkersRef.current.length > 0) {
        const group = L.featureGroup([
          markersRef.current["truck"],
          ...rutasMarkersRef.current,
        ]);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    });
  }, [vehiculoLat, vehiculoLng, vehiculoNombre, clientes]);

  // Keep Leaflet synced with container size changes
  useEffect(() => {
    if (!mapRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize(false);
    });

    observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

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
