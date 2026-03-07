import { Vehiculo, ESTADO_LABELS } from "../types";

interface DetalleVehiculoProps {
  vehiculo: Vehiculo;
}

export default function DetalleVehiculo({ vehiculo }: DetalleVehiculoProps) {
  const detalles = [
    {
      label: "Unidad",
      value: (
        <span style={{ color: "#dc2626", fontWeight: 600 }}>
          {vehiculo.codigo} · {vehiculo.placa}
        </span>
      ),
    },
    { label: "Chofer", value: vehiculo.chofer },
    { label: "Ruta", value: vehiculo.ruta },
    {
      label: "Estado",
      value: ESTADO_LABELS[vehiculo.estado],
    },
    {
      label: "Órdenes",
      value: `${vehiculo.ordenesEntregadas} entregadas / ${vehiculo.ordenesTotales - vehiculo.ordenesEntregadas} pendientes`,
    },
    {
      label: "Canastos",
      value: `${vehiculo.canastas} entregados · ${vehiculo.canastasTotal} en camión`,
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
