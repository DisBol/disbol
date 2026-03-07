import { Vehiculo } from "../types";
import { BadgeEnvio, BadgePago } from "./Badges";

interface DetalleRutaProps {
  vehiculo: Vehiculo;
}

export default function DetalleRuta({ vehiculo }: DetalleRutaProps) {
  return (
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
      {vehiculo.paradas.map((parada, idx) => (
        <div
          key={parada.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom:
              idx < vehiculo.paradas.length - 1 ? "1px solid #f3f4f6" : "none",
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
              {parada.hora} · {parada.ordenes} órdenes · {parada.canastas}{" "}
              canastas
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <BadgeEnvio estado={parada.estadoEnvio} />
            <BadgePago estado={parada.estadoPago} />
          </div>
        </div>
      ))}
    </div>
  );
}
