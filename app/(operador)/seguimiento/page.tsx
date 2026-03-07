"use client";

import React, { useState } from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import "leaflet/dist/leaflet.css";
import { Vehiculo } from "./types";

import { VEHICULOS } from "./data/vehiculos";
import MapaSeguimiento from "./components/MapaSeguimiento";
import DetalleVehiculo from "./components/DetalleVehiculo";
import DetalleRuta from "./components/DetalleRuta";
import VehiculosEnRuta from "./components/VehiculosEnRuta";

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
              <MapaSeguimiento
                vehiculos={VEHICULOS}
                seleccionado={seleccionado}
              />
            </div>

            {/* VEHICLE DETAIL */}
            <DetalleVehiculo vehiculo={seleccionado} />

            {/* ROUTE DETAIL */}
            <DetalleRuta vehiculo={seleccionado} />
          </div>

          {/* ── RIGHT COLUMN: vehicle list full height ── */}
          <VehiculosEnRuta
            vehiculos={VEHICULOS}
            seleccionado={seleccionado}
            onSeleccionar={setSeleccionado}
          />
        </div>
      </div>
    </RouteProtection>
  );
}
