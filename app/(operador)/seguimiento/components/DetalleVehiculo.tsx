import { useCarStore } from "../store/useCarStore";
import { useGetRequestByCar } from "../hook/useGetRequestByCar";

export default function DetalleVehiculo() {
  const { selectedCar } = useCarStore();
  const { requests } = useGetRequestByCar(selectedCar?.id || 0);

  if (!selectedCar) {
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
        Selecciona un vehículo para ver sus detalles.
      </div>
    );
  }

  // Cálculos con los requests del vehículo
  const totalOrdenes = requests.length;
  const canastosEntregados = requests.reduce(
    (acc, req) => acc + (req.RequestStage_out_container || 0),
    0,
  );
  const canastosEnCamion = requests.reduce(
    (acc, req) =>
      acc +
      ((req.RequestStage_in_container || 0) -
        (req.RequestStage_out_container || 0)),
    0,
  );

  const detalles = [
    {
      label: "Unidad",
      value: (
        <span style={{ color: "#dc2626", fontWeight: 600 }}>
          {selectedCar.name} · {selectedCar.license || "Sin placa"}
        </span>
      ),
    },
    {
      label: "Chofer",
      value: requests[0]?.Employee_name || "Sin chofer",
    },
    {
      label: "Ruta",
      value: requests[0]?.ClientGroup_name || "Sin ruta",
    },
    {
      label: "Estado",
      value: (
        <span
          style={{
            background: selectedCar.active === "true" ? "#dcfce7" : "#fee2e2",
            color: selectedCar.active === "true" ? "#166534" : "#991b1b",
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {selectedCar.active === "true" ? "Retornando" : "INACTIVO"}
        </span>
      ),
    },
    {
      label: "Órdenes",
      value: `${canastosEntregados > 0 ? Math.min(totalOrdenes, canastosEntregados) : 0} entregadas / ${totalOrdenes - (canastosEntregados > 0 ? Math.min(totalOrdenes, canastosEntregados) : 0)} pendientes`,
    },
    {
      label: "Canastos",
      value: `${canastosEntregados} entregados · ${canastosEnCamion} en camión`,
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
