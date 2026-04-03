"use client";
import { Modal } from "@/components/ui/Modal";

export interface ExtractoMovimiento {
  fecha: string;
  tipoMovimiento: string;
  canastos: number;
  almacen: string;
  saldoCliente: number;
  saldoAlmacen: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  clientName: string;
  containerId: number;
  movimientos?: ExtractoMovimiento[];
  loading?: boolean;
}

export function ExtractoModal({
  isOpen,
  onClose,
  clientName,
  movimientos = [],
  loading = false,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title=""
      showCloseButton={false}
    >
      {/* Header custom */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Extracto de {clientName}
          </h2>
          <p className="text-sm text-sky-500 mt-0.5">
            Histórico de movimientos de canastos
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none font-light"
        >
          ×
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Fecha",
                "Tipo Movimiento",
                "Canastos (+/-)",
                "Almacén",
                "Saldo Cliente",
                "Saldo Almacén",
              ].map((h) => (
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
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  Cargando...
                </td>
              </tr>
            )}
            {!loading &&
              movimientos.map((m, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sky-500 whitespace-nowrap">
                    {m.fecha}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {m.tipoMovimiento}
                  </td>
                  <td
                    className={`px-4 py-3 font-bold whitespace-nowrap ${
                      m.canastos < 0 ? "text-red-500" : "text-emerald-500"
                    }`}
                  >
                    {m.canastos > 0 ? `+${m.canastos}` : m.canastos}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {m.almacen}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {m.saldoCliente} can.
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {m.saldoAlmacen} can.
                  </td>
                </tr>
              ))}
            {!loading && movimientos.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
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
