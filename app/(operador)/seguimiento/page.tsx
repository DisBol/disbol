"use client";

import React, { useState, useEffect, useRef } from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import "leaflet/dist/leaflet.css";

// ─── Types ───────────────────────────────────────────────────────────────────

type EstadoVehiculo = "en_ruta" | "entregando" | "retornando";

interface ParadaRuta {
  id: string;
  nombre: string;
  hora: string;
  ordenes: number;
  canastas: number;
  estadoEnvio: "ENTREGADO" | "ENVIADO";
  estadoPago: "PAGADO" | "PENDIENTE";
  lat: number;
  lng: number;
}

interface Vehiculo {
  id: string;
  codigo: string;
  placa: string;
  chofer: string;
  ruta: string;
  estado: EstadoVehiculo;
  ordenesEntregadas: number;
  ordenesTotales: number;
  canastas: number;
  canastasTotal: number;
  lat: number;
  lng: number;
  paradas: ParadaRuta[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const VEHICULOS: Vehiculo[] = [
  {
    id: "v1",
    codigo: "VH-01",
    placa: "1234-ABC",
    chofer: "Juan Pérez",
    ruta: "El Alto Norte",
    estado: "en_ruta",
    ordenesEntregadas: 8,
    ordenesTotales: 12,
    canastas: 40,
    canastasTotal: 100,
    lat: -16.502,
    lng: -68.155,
    paradas: [
      {
        id: "p1",
        nombre: "Pollería El Rey",
        hora: "08:40",
        ordenes: 3,
        canastas: 10,
        estadoEnvio: "ENTREGADO",
        estadoPago: "PAGADO",
        lat: -16.488,
        lng: -68.162,
      },
      {
        id: "p2",
        nombre: "Feria 16 de Julio · Sector A",
        hora: "09:55",
        ordenes: 2,
        canastas: 8,
        estadoEnvio: "ENVIADO",
        estadoPago: "PENDIENTE",
        lat: -16.496,
        lng: -68.148,
      },
      {
        id: "p3",
        nombre: "Supermercado Norte",
        hora: "10:15",
        ordenes: 1,
        canastas: 5,
        estadoEnvio: "ENTREGADO",
        estadoPago: "PAGADO",
        lat: -16.51,
        lng: -68.14,
      },
      {
        id: "p4",
        nombre: "Restaurante Los Andes",
        hora: "10:25",
        ordenes: 4,
        canastas: 12,
        estadoEnvio: "ENVIADO",
        estadoPago: "PENDIENTE",
        lat: -16.52,
        lng: -68.135,
      },
    ],
  },
  {
    id: "v2",
    codigo: "VH-02",
    placa: "5678-DEF",
    chofer: "María González",
    ruta: "El Alto Sur",
    estado: "entregando",
    ordenesEntregadas: 5,
    ordenesTotales: 7,
    canastas: 30,
    canastasTotal: 60,
    lat: -16.53,
    lng: -68.125,
    paradas: [
      {
        id: "p5",
        nombre: "Mercado Rodríguez",
        hora: "09:00",
        ordenes: 2,
        canastas: 6,
        estadoEnvio: "ENTREGADO",
        estadoPago: "PAGADO",
        lat: -16.525,
        lng: -68.13,
      },
      {
        id: "p6",
        nombre: "Tienda El Sol",
        hora: "10:00",
        ordenes: 2,
        canastas: 8,
        estadoEnvio: "ENVIADO",
        estadoPago: "PENDIENTE",
        lat: -16.538,
        lng: -68.118,
      },
    ],
  },
  {
    id: "v3",
    codigo: "VH-03",
    placa: "9999-XYZ",
    chofer: "Carlos Ramírez",
    ruta: "La Paz Centro",
    estado: "retornando",
    ordenesEntregadas: 10,
    ordenesTotales: 10,
    canastas: 40,
    canastasTotal: 55,
    lat: -16.505,
    lng: -68.118,
    paradas: [
      {
        id: "p7",
        nombre: "Mercado Central · Puesto 4",
        hora: "09:30",
        ordenes: 4,
        canastas: 15,
        estadoEnvio: "ENTREGADO",
        estadoPago: "PAGADO",
        lat: -16.498,
        lng: -68.122,
      },
      {
        id: "p8",
        nombre: "Café Paradiso",
        hora: "09:50",
        ordenes: 2,
        canastas: 7,
        estadoEnvio: "ENTREGADO",
        estadoPago: "PAGADO",
        lat: -16.508,
        lng: -68.112,
      },
      {
        id: "p9",
        nombre: "Hotel Bolivia",
        hora: "10:10",
        ordenes: 4,
        canastas: 18,
        estadoEnvio: "ENVIADO",
        estadoPago: "PENDIENTE",
        lat: -16.518,
        lng: -68.105,
      },
    ],
  },
];

const ESTADO_LABELS: Record<EstadoVehiculo, string> = {
  en_ruta: "En ruta",
  entregando: "Entregando",
  retornando: "Retornando",
};

const ESTADO_BADGE_STYLE: Record<EstadoVehiculo, React.CSSProperties> = {
  en_ruta: { backgroundColor: "#16a34a", color: "#fff" },
  entregando: { backgroundColor: "#2563eb", color: "#fff" },
  retornando: { backgroundColor: "#d97706", color: "#fff" },
};

// ─── Badge Components ─────────────────────────────────────────────────────────

function BadgeEnvio({ estado }: { estado: "ENTREGADO" | "ENVIADO" }) {
  return (
    <span
      style={{
        backgroundColor: estado === "ENTREGADO" ? "#16a34a" : "#2563eb",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 3,
        letterSpacing: "0.04em",
      }}
    >
      {estado}
    </span>
  );
}

function BadgePago({ estado }: { estado: "PAGADO" | "PENDIENTE" }) {
  return (
    <span
      style={{
        backgroundColor: estado === "PAGADO" ? "#16a34a" : "#dc2626",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 3,
        letterSpacing: "0.04em",
      }}
    >
      {estado}
    </span>
  );
}

// ─── Leaflet Map ──────────────────────────────────────────────────────────────

function MapaLeaflet({
  vehiculos,
  seleccionado,
}: {
  vehiculos: Vehiculo[];
  seleccionado: Vehiculo;
}) {
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SeguimientoPage() {
  const [seleccionado, setSeleccionado] = useState<Vehiculo>(VEHICULOS[0]);

  return (
    <RouteProtection requiredTransaction="Seguimiento">
      <div
        style={{
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          fontSize: 13,
          color: "#111827",
          background: "#f9fafb",
          minHeight: "100vh",
          padding: "12px 14px",
          boxSizing: "border-box",
        }}
      >
        {/* ── OUTER: left column + right panel side by side ── */}
        <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
          {/* ── LEFT COLUMN: map + details stacked ── */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* MAP */}
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 6,
                overflow: "hidden",
                height: 370,
                flexShrink: 0,
              }}
            >
              <MapaLeaflet vehiculos={VEHICULOS} seleccionado={seleccionado} />
            </div>

            {/* VEHICLE DETAIL */}
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 6,
                background: "#fff",
                padding: "10px 14px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 8,
                  color: "#111827",
                }}
              >
                Detalle del vehículo seleccionado
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  flexWrap: "wrap",
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: 8,
                }}
              >
                {[
                  {
                    label: "Unidad",
                    value: (
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>
                        {seleccionado.codigo} · {seleccionado.placa}
                      </span>
                    ),
                  },
                  { label: "Chofer", value: seleccionado.chofer },
                  { label: "Ruta", value: seleccionado.ruta },
                  {
                    label: "Estado",
                    value: ESTADO_LABELS[seleccionado.estado],
                  },
                  {
                    label: "Órdenes",
                    value: `${seleccionado.ordenesEntregadas} entregadas / ${seleccionado.ordenesTotales - seleccionado.ordenesEntregadas} pendientes`,
                  },
                  {
                    label: "Canastos",
                    value: `${seleccionado.canastas} entregados · ${seleccionado.canastasTotal} en camión`,
                  },
                ].map((col) => (
                  <div
                    key={col.label}
                    style={{ marginRight: 28, marginBottom: 4 }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 2,
                      }}
                    >
                      {col.label}
                    </div>
                    <div style={{ fontSize: 13 }}>{col.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROUTE DETAIL */}
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 6,
                background: "#fff",
                padding: "10px 14px",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 8,
                  color: "#111827",
                }}
              >
                Detalle de la ruta
              </div>
              {seleccionado.paradas.map((parada, idx) => (
                <div
                  key={parada.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom:
                      idx < seleccionado.paradas.length - 1
                        ? "1px solid #f3f4f6"
                        : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#111827",
                        marginBottom: 2,
                      }}
                    >
                      {parada.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      {parada.hora} · {parada.ordenes} órdenes ·{" "}
                      {parada.canastas} canastas
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <BadgeEnvio estado={parada.estadoEnvio} />
                    <BadgePago estado={parada.estadoPago} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: vehicle list full height ── */}
          <div
            style={{
              width: 270,
              flexShrink: 0,
              border: "1px solid #d1d5db",
              borderRadius: 6,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid #e5e7eb",
                flexShrink: 0,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                Vehículos en ruta
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                Selecciona una unidad para centrar el mapa
              </div>
            </div>

            {/* Vehicle rows */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {VEHICULOS.map((v) => {
                const isSelected = seleccionado.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSeleccionado(v)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom: "1px solid #e5e7eb",
                      background: isSelected ? "#fff1f0" : "#fff",
                      borderLeft: isSelected
                        ? "3px solid #ef4444"
                        : "3px solid transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 6,
                      }}
                    >
                      {/* Left: code + name */}
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: isSelected ? "#dc2626" : "#1f2937",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v.codigo} · {v.placa}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            marginTop: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v.chofer} · {v.ruta}
                        </div>
                      </div>
                      {/* Right: orders + canastas */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          {v.ordenesEntregadas}/{v.ordenesTotales} ord.
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          Canastos: {v.canastasTotal}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <span
                            style={{
                              ...ESTADO_BADGE_STYLE[v.estado],
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: 3,
                              letterSpacing: "0.04em",
                            }}
                          >
                            {ESTADO_LABELS[v.estado]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </RouteProtection>
  );
}
