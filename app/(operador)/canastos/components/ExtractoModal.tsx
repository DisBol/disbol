"use client";
import { Modal } from "@/components/ui/Modal";
import { useGetContainerMovementsClientExtract } from "../hooks/useGetContainerMovementsClientExtract";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  clientName: string;
  containerId: number;
}

export function ExtractoModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  containerId,
}: Props) {
  const { data, loading } = useGetContainerMovementsClientExtract(
    clientId,
    containerId,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={`Extracto de ${clientName}`} showCloseButton>
      <p className="text-sm text-sky-500 -mt-2 mb-4">Histórico de movimientos de canastos</p>

      <div className="overflow-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Fecha", "Tipo Movimiento", "Contenedor", "Canastos (+/-)"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-sky-500 uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && data.map((m, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sky-500 whitespace-nowrap">
                  {new Date(m.ContainerMovements_created_at).toLocaleDateString("es-BO")}
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {m.Tipo_Operacion}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {m.Contenedor_name}
                </td>
                <td
                  className={`px-4 py-3 font-bold whitespace-nowrap ${
                    m.ContainerMovements_quantity < 0 ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  {m.ContainerMovements_quantity > 0
                    ? `+${m.ContainerMovements_quantity}`
                    : m.ContainerMovements_quantity}
                </td>
              </tr>
            ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                  Sin movimientos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
