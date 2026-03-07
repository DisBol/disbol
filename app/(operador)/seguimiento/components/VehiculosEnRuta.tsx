import { Vehiculo, ESTADO_LABELS, ESTADO_BADGE_STYLE } from "../types";

interface VehiculosEnRutaProps {
  vehiculos: Vehiculo[];
  seleccionado: Vehiculo;
  onSeleccionar: (vehiculo: Vehiculo) => void;
}

export default function VehiculosEnRuta({
  vehiculos,
  seleccionado,
  onSeleccionar,
}: VehiculosEnRutaProps) {
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
          Vehículos en ruta
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
          Selecciona una unidad para centrar el mapa
        </div>
      </div>

      {/* Vehicle rows */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {vehiculos.map((v) => {
          const isSelected = seleccionado.id === v.id;
          return (
            <div
              key={v.id}
              onClick={() => onSeleccionar(v)}
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
  );
}
