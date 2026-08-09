"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";

export interface EntregaEmpresa {
  id: string;
  cajas: number;
  unidades: number;
  peso: number;
  bono: boolean;
}

interface RecibirEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  entregasList: EntregaEmpresa[];
  setEntregasList: Dispatch<SetStateAction<EntregaEmpresa[]>>;
}

export default function RecibirEmpresaModal({
  isOpen,
  onClose,
  entregasList,
  setEntregasList,
}: RecibirEmpresaModalProps) {
  const [cajasInput, setCajasInput] = useState("");
  const [unidadesInput, setUnidadesInput] = useState("");
  const [pesoInput, setPesoInput] = useState("");
  const [bonoInput, setBonoInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(entregasList.length / itemsPerPage);

  const paginatedEntregas = useMemo(
    () =>
      entregasList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [currentPage, entregasList],
  );

  const handleClose = () => {
    setCajasInput("");
    setUnidadesInput("");
    setPesoInput("");
    setBonoInput(false);
    onClose();
  };

  const handleAddEntrega = () => {
    if (!cajasInput || !unidadesInput || !pesoInput) return;

    const newEntrega: EntregaEmpresa = {
      id: Math.random().toString(36).substring(7),
      cajas: Number(cajasInput),
      unidades: Number(unidadesInput),
      peso: Number(pesoInput),
      bono: bonoInput,
    };

    const newList = [...entregasList, newEntrega];
    setEntregasList(newList);
    setCajasInput("");
    setUnidadesInput("");
    setPesoInput("");
    setBonoInput(false);
    setCurrentPage(Math.ceil(newList.length / itemsPerPage) || 1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Entrega"
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-30">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Cajas
            </span>
            <InputField
              placeholder="0"
              type="number"
              value={cajasInput}
              onChange={(e) => setCajasInput(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-30">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Unidades
            </span>
            <InputField
              placeholder="0"
              type="number"
              value={unidadesInput}
              onChange={(e) => setUnidadesInput(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-30">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Peso
            </span>
            <InputField
              placeholder="0"
              type="number"
              value={pesoInput}
              onChange={(e) => setPesoInput(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-2">
            <Checkbox
              label="Bono"
              checked={bonoInput}
              onChange={(checked) => setBonoInput(checked)}
            />
          </div>
          <div className="mb-0">
            <Button onClick={handleAddEntrega} variant="primary">
              +
            </Button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-800">
              Entregas Registradas
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
              Total: {entregasList.length}
            </span>
          </div>

          <div
            className={`min-h-87.5 ${entregasList.length === 0 ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 md:grid-rows-6 md:grid-flow-col gap-4 content-start"}`}
          >
            {entregasList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 w-full col-span-full">
                <span className="text-gray-400 mb-2">📦</span>
                <p className="text-sm text-gray-500 font-medium">
                  No hay entregas registradas.
                </p>
              </div>
            ) : (
              paginatedEntregas.map((entrega, index) => (
                <div
                  key={entrega.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0 border border-gray-200">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Cajas
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {entrega.cajas}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-gray-100"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Unidades
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {entrega.unidades}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-gray-100"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Peso (kg)
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {entrega.peso}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-gray-100"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Bono
                        </span>
                        <span
                          className={`font-semibold ${entrega.bono ? "text-green-600" : "text-gray-400"}`}
                        >
                          {entrega.bono ? "Aplica" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const newEntregas = entregasList.filter(
                        (item) => item.id !== entrega.id,
                      );
                      setEntregasList(newEntregas);
                      if (
                        currentPage >
                          Math.ceil(newEntregas.length / itemsPerPage) &&
                        currentPage > 1
                      ) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, entregasList.length)} de{" "}
                {entregasList.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  Anterior
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                        currentPage === index + 1
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
