"use client";

import React, { useState } from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import "leaflet/dist/leaflet.css";

import MapaSeguimiento from "./components/MapaSeguimiento";
import DetalleVehiculo from "./components/DetalleVehiculo";
import DetalleRuta from "./components/DetalleRuta";
import VehiculosEnRuta from "./components/VehiculosEnRuta";
import { useGetRequestByCar } from "./hook/useGetRequestByCar";
import { useGetGeofences } from "./hook/useGetGeofences";
import { useCar } from "../configuraciones/hooks/vehiculos/useCar";
import { useCarStore } from "./store/useCarStore";
import { useGetVehicleComplete } from "./hook/useGetVehicleComplete";
import { useGetTrackingData } from "./hook/useGetTrackingData";

export default function SeguimientoPage() {
  const { selectedCar } = useCarStore();
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const { cars, isLoading: loadingCars, error: errorCars } = useCar();
  const {
    requests,
    loading: loadingRequests,
    error: errorRequests,
  } = useGetRequestByCar(selectedCar?.id || 0);

  // 1. Carga Inicial: Obtenemos Geocercas (1 vez)
  const { geofences } = useGetGeofences();

  // 2. Carga Inicial: Datos descriptivos y el Icono del Vehículo (1 vez)
  const { vehicles } = useGetVehicleComplete();

  // 3. Tiempo Real: Datos GPS refrescando mágicamente cada 30 Segs
  const { trackingData, loading: loadingTracker } = useGetTrackingData(30000);

  // 4. "Diccionario" Visual (Hacemos un match para asociar la Posición vs la Información del Vehículo)
  const mapDataCompleta = React.useMemo(() => {
    return trackingData.map((gpsPoint) => {
      // Cruzamos los datos usando el ID/UnitId
      const metaData = vehicles.find(
        (v) => v.nombre === gpsPoint.UnitId || v.patente === gpsPoint.UnitPlate,
      );

      return {
        lat: parseFloat(gpsPoint.Latitude),
        lng: parseFloat(gpsPoint.Longitude),
        id: gpsPoint.UnitId,
        velocidad: gpsPoint.GpsSpeed,
        encendido: gpsPoint.Ignition === "1",
        bateriaGps: gpsPoint.BateriaGps,
        bateriaVehiculo: gpsPoint.BateriaVeh,
        icono: metaData?.icono_vehiculo || "default-icon.png",
        tipoVehiculo: metaData?.tipo_vehiculo || "Desconocido",
        nombreCompleto: metaData?.nombre || gpsPoint.UnitPlate,
      };
    });
  }, [trackingData, vehicles]);

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isMapFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMapFullscreen]);

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
                height: isMapFullscreen ? "100vh" : 370,
                flexShrink: 0,
                position: isMapFullscreen ? "fixed" : "relative",
                top: isMapFullscreen ? 0 : undefined,
                left: isMapFullscreen ? 0 : undefined,
                width: isMapFullscreen ? "100vw" : undefined,
                zIndex: isMapFullscreen ? 9999 : undefined,
              }}
            >
              <MapaSeguimiento
                vehiculosEnVivo={mapDataCompleta}
                zonasPoligonales={geofences}
                rutasSeleccionadas={requests || []}
                isFullscreen={isMapFullscreen}
              />
              {loadingTracker && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 50,
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    zIndex: 1000,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  Actualizando GPS...
                </div>
              )}
              {/* Fullscreen toggle button */}
              <button
                onClick={() => setIsMapFullscreen((prev) => !prev)}
                title={isMapFullscreen ? "Minimizar mapa" : "Pantalla completa"}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1001,
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {isMapFullscreen ? (
                  /* Minimize icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  /* Fullscreen icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  </svg>
                )}
              </button>
            </div>

            {/* VEHICLE DETAIL */}
            <DetalleVehiculo />

            {/* ROUTE DETAIL */}
            <DetalleRuta
              carSeleccionado={selectedCar}
              requests={requests || []}
              loadingRequests={loadingRequests}
              errorRequests={errorRequests}
            />
          </div>

          {/* ── RIGHT COLUMN: vehicle list full height ── */}
          <VehiculosEnRuta
            cars={cars || []}
            loading={loadingCars}
            error={errorCars}
          />
        </div>
      </div>
    </RouteProtection>
  );
}
