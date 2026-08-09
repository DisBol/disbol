"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
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
  const cajasInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(entregasList.length / itemsPerPage) || 1;

  // Ensure current page is valid when itemsPerPage changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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

    const newList = [newEntrega, ...entregasList];
    setEntregasList(newList);
    setCajasInput("");
    setUnidadesInput("");
    setPesoInput("");
    setBonoInput(false);
    setCurrentPage(1);

    // Set focus back to Cajas input for fast entry
    setTimeout(() => {
      cajasInputRef.current?.focus();
    }, 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Registrar entrega de empresa (Total: ${entregasList.length})`}
      size="xl"
    >
      <div className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="grid grid-cols-4 gap-3 w-full">
            <div className="col-span-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Cajas
              </span>
              <InputField
                ref={cajasInputRef}
                placeholder="0"
                type="number"
                value={cajasInput}
                onChange={(e) => setCajasInput(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="col-span-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Unidades
              </span>
              <InputField
                placeholder="0"
                type="number"
                value={unidadesInput}
                onChange={(e) => setUnidadesInput(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="col-span-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Peso
              </span>
              <InputField
                placeholder="0"
                type="number"
                value={pesoInput}
                onChange={(e) => setPesoInput(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Bono
              </span>
              <div className="flex items-center gap-2 h-8">
                <div
                  className="flex-1 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => setBonoInput(!bonoInput)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setBonoInput(!bonoInput);
                    }
                  }}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={bonoInput}
                >
                  <input
                    type="checkbox"
                    checked={bonoInput}
                    readOnly
                    className="w-4 h-4 text-red-600 rounded border-gray-300 cursor-pointer pointer-events-none"
                    tabIndex={-1}
                  />
                </div>
                <button
                  onClick={handleAddEntrega}
                  className="flex-1 h-full bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors font-bold text-lg leading-none shadow-sm"
                  title="Agregar Entrega"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            {entregasList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 w-full col-span-full">
                <span className="text-gray-400 mb-2">📦</span>
                <p className="text-xs text-gray-500 font-medium">
                  No hay entregas registradas.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 px-2 pb-1 border-b border-gray-100">
                  <div className="grid grid-cols-4 gap-3 w-full text-[9px] font-bold text-gray-400 uppercase tracking-wider text-left">
                    <span>Cajas</span>
                    <span>Unidades</span>
                    <span>Peso (kg)</span>
                    <span>Bono</span>
                  </div>
                  <div className="w-7 shrink-0"></div>
                </div>
                {paginatedEntregas.map((entrega, index) => (
                  <div
                    key={entrega.id}
                    className="flex items-center px-2 py-1.5 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-200 gap-3"
                  >
                    <div className="grid grid-cols-4 gap-3 w-full text-gray-900 font-semibold text-xs items-center">
                      <span>{entrega.cajas}</span>
                      <span>{entrega.unidades}</span>
                      <span>{entrega.peso}</span>
                      <span
                        className={`font-semibold ${entrega.bono ? "text-green-600" : "text-gray-400"}`}
                      >
                        {entrega.bono ? "Aplica" : "No"}
                      </span>
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
                      className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </>
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
