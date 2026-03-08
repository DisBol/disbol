"use client";

import React from "react";
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
  const { selectedCar, setSelectedCar } = useCarStore();
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

  // Auto-select first car when available
  React.useEffect(() => {
    if (!selectedCar && cars && cars.length > 0) {
      setSelectedCar(cars[0]);
    }
  }, [cars, selectedCar, setSelectedCar]);

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
                position: "relative",
              }}
            >
              <MapaSeguimiento
                vehiculosEnVivo={mapDataCompleta}
                zonasPoligonales={geofences}
              />
              {loadingTracker && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
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
