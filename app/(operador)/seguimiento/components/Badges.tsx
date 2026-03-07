interface BadgeEnvioProps {
  estado: "ENTREGADO" | "ENVIADO";
}

export function BadgeEnvio({ estado }: BadgeEnvioProps) {
  return (
    <span
      style={{
        backgroundColor: estado === "ENTREGADO" ? "#16a34a" : "#2563eb",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 3,
        letterSpacing: "0.04em",
      }}
    >
      {estado}
    </span>
  );
}

interface BadgePagoProps {
  estado: "PAGADO" | "PENDIENTE";
}

export function BadgePago({ estado }: BadgePagoProps) {
  return (
    <span
      style={{
        backgroundColor: estado === "PAGADO" ? "#16a34a" : "#dc2626",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 3,
        letterSpacing: "0.04em",
      }}
    >
      {estado}
    </span>
  );
}
