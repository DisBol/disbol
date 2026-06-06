"use client";

import { Modal } from "@/components/ui/Modal";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { CierrePeriodo } from "../interfaces";

interface DetallesCierreModalProps {
  cierre: CierrePeriodo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetallesCierreModal({
  cierre,
  isOpen,
  onClose,
}: DetallesCierreModalProps) {
  if (!cierre) return null;

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles del Cierre - ${cierre.periodo}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-4">
              Información General
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Período: </span>
                <span className="text-gray-900">{cierre.periodo}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Fecha de Cierre:{" "}
                </span>
                <span className="text-gray-900">
                  {formatDate(cierre.fechaCierre)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Cerrado por:{" "}
                </span>
                <span className="text-gray-900">{cierre.cerradoPor}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Total de Asientos:{" "}
                </span>
                <span className="text-gray-900">{cierre.asientos}</span>
              </div>
            </div>
          </div>

          {/* Balance del Período */}
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-4">
              Balance del Período
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">
                  Total Ingresos:{" "}
                </span>
                <span className="text-gray-900">
                  {formatCurrency(cierre.totalIngresos)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Total Gastos:{" "}
                </span>
                <span className="text-gray-900">
                  {formatCurrency(cierre.totalGastos)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-700">Resultado: </span>
                <span className="font-bold text-success">
                  {formatCurrency(cierre.resultado)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asientos Procesados */}
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-4">
            Asientos Procesados
          </h3>
          <div className="max-h-72 overflow-y-auto rounded-md border border-gray-200">
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Glosa</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cierre.asientosDetalle.map((asiento) => (
                    <TableRow key={asiento.id}>
                      <TableCell className="font-medium">
                        {asiento.id}
                      </TableCell>
                      <TableCell>{asiento.fecha}</TableCell>
                      <TableCell>{asiento.tipo}</TableCell>
                      <TableCell>{asiento.glosa}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(asiento.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>
        </div>
      </div>
    </Modal>
  );
}
