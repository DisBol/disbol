import { Datum as CarDatum } from "../../configuraciones/interfaces/vehiculos/getcar";
import { useCarStore } from "../store/useCarStore";

interface VehiculosEnRutaProps {
  cars: CarDatum[];
  loading: boolean;
  error: string | null;
}

export default function VehiculosEnRuta({
  cars,
  loading,
  error,
}: VehiculosEnRutaProps) {
  const { selectedCar, setSelectedCar } = useCarStore();
  return (
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
          Vehículos disponibles
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
          Selecciona un vehículo para ver sus rutas
        </div>
      </div>

      {/* Vehicle rows */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <div style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>
            Cargando vehículos...
          </div>
        )}
        {error && (
          <div style={{ padding: "10px 14px", color: "#ef4444", fontSize: 13 }}>
            Error: {error}
          </div>
        )}
        {!loading && !error && cars.length === 0 && (
          <div style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>
            No hay vehículos registrados.
          </div>
        )}
        {!loading &&
          cars.map((car) => {
            const isSelected = selectedCar?.id === car.id;

            return (
              <div
                key={car.id}
                onClick={() => setSelectedCar(isSelected ? undefined : car)}
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
                  {/* Left: name + license */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: isSelected ? "#dc2626" : "#1f2937",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {car.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        marginTop: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Placa: {car.license} • ID: {car.idCar}
                    </div>
                  </div>
                  {/* Right: status */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ marginTop: 4 }}>
                      <span
                        style={{
                          background:
                            car.active === "true" ? "#dcfce7" : "#fee2e2",
                          color: car.active === "true" ? "#166534" : "#991b1b",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 3,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {car.active === "true" ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
