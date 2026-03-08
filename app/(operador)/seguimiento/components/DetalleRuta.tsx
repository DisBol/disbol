import { Datum } from "../interface/getrequestbycar.interface";
import { BadgeEnvio, BadgePago } from "./Badges";
import { useGetHistoryForRequest } from "../hook/useGetHistoryForRequest";

interface DetalleRutaProps {
  vehiculo?: Datum;
}

export default function DetalleRuta({ vehiculo }: DetalleRutaProps) {
  const { stops, loading, error } = useGetHistoryForRequest(
    vehiculo?.Request_created_at
      ? String(vehiculo.Request_created_at)
      : undefined,
    vehiculo?.Provider_id,
    vehiculo?.ClientGroup_id,
  );

  const rawReq = vehiculo;
  const hasStops = stops && stops.length > 0;
  const hasFallbackItem = !hasStops && rawReq;

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 6,
        background: "#fff",
        padding: "10px 14px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 13,
          marginBottom: 8,
          color: "#111827",
          flexShrink: 0,
        }}
      >
        Detalle de la ruta
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {!vehiculo && (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Seleccione una ruta
          </div>
        )}
        {vehiculo && loading && (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Cargando detalle...
          </div>
        )}
        {vehiculo && error && (
          <div style={{ fontSize: 13, color: "#ef4444" }}>
            Error cargando detalles
          </div>
        )}
        {vehiculo && !loading && !error && !hasStops && !hasFallbackItem && (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            No hay paradas o detalles para esta ruta.
          </div>
        )}

        {/* --- Render history items if exist --- */}
        {vehiculo &&
          !loading &&
          hasStops &&
          stops.map((stop, idx) => {
            const ordenes = stop.items.length;
            const canastas = stop.items.reduce(
              (acc, curr) =>
                acc + (Number(curr.ProductRequest_containers) || 0),
              0,
            );

            // Intentamos formatear la hora (asume "YYYY-MM-DD HH:mm:ss" o isostring)
            const timeStr = String(stop.Request_created_at).split(" ")[1] || "";
            const timeFmt = timeStr ? timeStr.slice(0, 5) : "";

            return (
              <div
                key={stop.Request_id || idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    idx < stops.length - 1 ? "1px solid #f3f4f6" : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#111827",
                      marginBottom: 4,
                    }}
                  >
                    {stop.Client_name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {timeFmt ? `${timeFmt} · ` : ""}
                    {ordenes} órdenes · {canastas} canastos
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <BadgeEnvio
                    estado={
                      String(stop.RequestState_name) === "ENTREGADO"
                        ? "ENTREGADO"
                        : "ENVIADO"
                    }
                  />
                  <span
                    style={{
                      background:
                        stop.PaymentType_name === "No Pagado"
                          ? "#fee2e2"
                          : "#dcfce7",
                      color:
                        stop.PaymentType_name === "No Pagado"
                          ? "#991b1b"
                          : "#166534",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  >
                    Bs. {stop.RequestStage_payment || 0} -{" "}
                    {stop.PaymentType_name ||
                      (stop.pagado ? "Efectivo" : "No Pagado")}
                  </span>
                </div>
              </div>
            );
          })}

        {/* --- Fallback view if no history items but request details exist --- */}
        {vehiculo && !loading && !error && hasFallbackItem && rawReq && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "none",
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
                Información de Ruta
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {rawReq.RequestStage_in_container || 0} recibidos ·{" "}
                {rawReq.RequestStage_out_container || 0} despachados
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <BadgeEnvio
                estado={
                  String(rawReq.RequestState_name) === "ENTREGADO"
                    ? "ENTREGADO"
                    : "ENVIADO"
                }
              />
              <span
                style={{
                  background:
                    rawReq.PaymentType_name === "No Pagado"
                      ? "#fee2e2"
                      : "#dcfce7",
                  color:
                    rawReq.PaymentType_name === "No Pagado"
                      ? "#991b1b"
                      : "#166534",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                Bs. {rawReq.RequestStage_payment || 0} -{" "}
                {rawReq.PaymentType_name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
