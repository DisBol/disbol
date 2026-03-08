import { Datum } from "../interface/getrequestbycar.interface";

interface DetalleVehiculoProps {
  vehiculo?: Datum;
}

export default function DetalleVehiculo({ vehiculo }: DetalleVehiculoProps) {
  if (!vehiculo) {
    return (
      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: 6,
          background: "#fff",
          padding: "10px 14px",
          flexShrink: 0,
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        Selecciona un vehículo en ruta con información de solicitud.
      </div>
    );
  }

  const ordenesEntregadas = vehiculo.RequestStage_in_container || 0;
  const ordenesTotales =
    (vehiculo.RequestStage_out_container || 0) + ordenesEntregadas;

  const detalles = [
    {
      label: "Unidad",
      value: (
        <span style={{ color: "#dc2626", fontWeight: 600 }}>
          REQ-{vehiculo.Request_id} · {vehiculo.Provider_name || "Sin placa"}
        </span>
      ),
    },
    { label: "Chofer", value: vehiculo.Client_name || "Sin chofer" },
    { label: "Ruta", value: `Grupo ${vehiculo.ClientGroup_id || "N/A"}` },
    {
      label: "Estado",
      value: (
        <span
          style={{
            background:
              vehiculo.RequestState_name === "ENTREGADO"
                ? "#dcfce7"
                : "#fee2e2",
            color:
              vehiculo.RequestState_name === "ENTREGADO"
                ? "#166534"
                : "#991b1b",
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {vehiculo.RequestState_name}
        </span>
      ),
    },
    {
      label: "Órdenes",
      value: `${ordenesEntregadas} entregadas / ${ordenesTotales - ordenesEntregadas} pendientes`,
    },
    {
      label: "Canastos",
      value: `${vehiculo.RequestStage_in_container || 0} recibidos · ${vehiculo.RequestStage_out_container || 0} despachados`,
    },
  ];

  return (
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
        {detalles.map((detalle) => (
          <div key={detalle.label} style={{ marginRight: 28, marginBottom: 4 }}>
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
              {detalle.label}
            </div>
            <div style={{ fontSize: 13 }}>{detalle.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
