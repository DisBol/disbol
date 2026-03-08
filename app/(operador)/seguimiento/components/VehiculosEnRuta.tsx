import { Datum } from "../interface/getrequestbycar.interface";

interface VehiculosEnRutaProps {
  vehiculos: Datum[];
  loading: boolean;
  error: string | null;
  seleccionado: Datum | undefined;
  onSeleccionar: (vehiculo: Datum | undefined) => void;
}

export default function VehiculosEnRuta({
  vehiculos,
  loading,
  error,
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
        {!loading && !error && vehiculos.length === 0 && (
          <div style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>
            No hay vehículos en ruta.
          </div>
        )}
        {!loading &&
          vehiculos.map((v) => {
            const isSelected = seleccionado?.Request_id === v.Request_id;

            const ordenesEntregadas = v.RequestStage_in_container || 0;
            const ordenesTotales =
              (v.RequestStage_out_container || 0) + ordenesEntregadas;
            const canastasTotal = ordenesTotales;

            return (
              <div
                key={v.Request_id}
                onClick={() => onSeleccionar(isSelected ? undefined : v)}
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
                      REQ-{v.Request_id} · {v.Provider_name || "Sin placa"}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        marginTop: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v.Client_name || "Sin chofer"} · Grupo{" "}
                      {v.ClientGroup_id || "N/A"}
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
                      {ordenesEntregadas}/{ordenesTotales} ord.
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      Canastos: {canastasTotal}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <span
                        style={{
                          background:
                            v.RequestState_name === "ENTREGADO"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            v.RequestState_name === "ENTREGADO"
                              ? "#166534"
                              : "#991b1b",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 3,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {v.RequestState_name}
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
