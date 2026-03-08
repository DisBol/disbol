import { Datum } from "../interface/getrequestbycar.interface";
import { Datum as CarDatum } from "../../configuraciones/interfaces/vehiculos/getcar";
import { BadgeEnvio } from "./Badges";

interface DetalleRutaProps {
  carSeleccionado?: CarDatum;
  requests: Datum[];
  loadingRequests: boolean;
  errorRequests: string | null;
}

export default function DetalleRuta({
  carSeleccionado,
  requests,
  loadingRequests,
  errorRequests,
}: DetalleRutaProps) {
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
        Detalle de rutas{" "}
        {carSeleccionado
          ? `- ${carSeleccionado.name} (${carSeleccionado.license})`
          : ""}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {!carSeleccionado && (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Seleccione un vehículo para ver sus rutas
          </div>
        )}
        {carSeleccionado && loadingRequests && (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Cargando rutas...
          </div>
        )}
        {carSeleccionado && errorRequests && (
          <div style={{ fontSize: 13, color: "#ef4444" }}>
            Error cargando rutas: {errorRequests}
          </div>
        )}
        {carSeleccionado &&
          !loadingRequests &&
          !errorRequests &&
          requests.length === 0 && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              No hay rutas asignadas a este vehículo.
            </div>
          )}

        {/* --- Render requests if exist --- */}
        {carSeleccionado &&
          !loadingRequests &&
          !errorRequests &&
          requests.length > 0 &&
          requests.map((request, idx) => {
            const ordenes =
              (request.RequestStage_in_container || 0) +
              (request.RequestStage_out_container || 0);
            const canastas = ordenes;

            // Intentamos formatear la hora (asume "YYYY-MM-DD HH:mm:ss" o isostring)
            const timeStr =
              String(request.Request_created_at).split(" ")[1] || "";
            const timeFmt = timeStr ? timeStr.slice(0, 5) : "";

            return (
              <div
                key={request.Request_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    idx < requests.length - 1 ? "1px solid #f3f4f6" : "none",
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
                    REQ-{request.Request_id} · {request.Client_name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {timeFmt ? `${timeFmt} · ` : ""}
                    Grupo {request.ClientGroup_id} · {canastas} canastos
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <BadgeEnvio
                    estado={
                      String(request.RequestState_name) === "ENTREGADO"
                        ? "ENTREGADO"
                        : "ENVIADO"
                    }
                  />
                  <span
                    style={{
                      background:
                        request.PaymentType_name === "No Pagado"
                          ? "#fee2e2"
                          : "#dcfce7",
                      color:
                        request.PaymentType_name === "No Pagado"
                          ? "#991b1b"
                          : "#166534",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  >
                    Bs. {request.RequestStage_payment || 0} -{" "}
                    {request.PaymentType_name || "No Pagado"}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
