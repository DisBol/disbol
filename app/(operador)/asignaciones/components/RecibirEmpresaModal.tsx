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
import { useAddEmpresa } from "../hooks/useAddEmpresa";
import { useAddEmpresaStage } from "../hooks/useAddEmpresaStage";
import { useUpdateEmpresaStage } from "../hooks/useUpdateEmpresaStage";
import { EditIcon } from "@/components/icons/EditIcon2";
import { CloseRoundedIcon } from "@/components/icons/CloseRoundedIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";

export interface EntregaEmpresa {
  id: string;
  cajas: number;
  unidades: number;
  peso: number;
  bono: boolean;
  guardado?: boolean;
  empresaId?: number;
}

interface RecibirEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  entregasList: EntregaEmpresa[];
  setEntregasList: Dispatch<SetStateAction<EntregaEmpresa[]>>;
  assignmentId: number;
}

export default function RecibirEmpresaModal({
  isOpen,
  onClose,
  entregasList,
  setEntregasList,
  assignmentId,
}: RecibirEmpresaModalProps) {
  const [cajasInput, setCajasInput] = useState("");
  const [unidadesInput, setUnidadesInput] = useState("");
  const [pesoInput, setPesoInput] = useState("");
  const [bonoInput, setBonoInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cajasInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 20;

  const { addEmpresa, loading: loadingEmpresa } = useAddEmpresa();
  const { addEmpresaStage, loading: loadingStage } = useAddEmpresaStage();
  const { updateEmpresaStage, loading: loadingUpdate } = useUpdateEmpresaStage();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    cajas: string;
    unidades: string;
    peso: string;
    bono: boolean;
  }>({ cajas: "", unidades: "", peso: "", bono: false });

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

  const handleGuardarAll = async () => {
    const pendingEntregas = entregasList.filter((e) => !e.guardado);
    if (pendingEntregas.length === 0) {
      alert("No hay entregas nuevas por guardar.");
      return;
    }

    const empresaId = await addEmpresa(assignmentId);
    if (!empresaId) {
      alert("Error al registrar la empresa");
      return;
    }

    for (const entrega of pendingEntregas) {
      // Send same amount of records with requested structure and default values
      await addEmpresaStage({
        in_container: 1, // default
        out_container: 1, // default
        units: entrega.unidades, // from user input
        container: entrega.cajas, // from user input
        Empresa_id: empresaId, // obtained from addEmpresa
        gross_weight: 1.02, // default as requested
        net_weight: entrega.peso, // from user input (assuming it represents weight)
        Container_id: 1, // default
      });
    }

    alert("¡Entregas registradas exitosamente!");
    setEntregasList((prev) =>
      prev.map((e) =>
        pendingEntregas.includes(e) ? { ...e, guardado: true, empresaId } : e
      )
    );
    onClose();
  };

  const handleEditClick = (entrega: EntregaEmpresa) => {
    setEditingId(entrega.id);
    setEditValues({
      cajas: entrega.cajas.toString(),
      unidades: entrega.unidades.toString(),
      peso: entrega.peso.toString(),
      bono: entrega.bono,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({ cajas: "", unidades: "", peso: "", bono: false });
  };

  const handleSaveEdit = async (entrega: EntregaEmpresa) => {
    const newCajas = Number(editValues.cajas);
    const newUnidades = Number(editValues.unidades);
    const newPeso = Number(editValues.peso);

    if (entrega.guardado) {
      if (!entrega.empresaId) {
        alert("Falta el ID de empresa para actualizar.");
        return;
      }
      
      const response = await updateEmpresaStage({
        EmpresaStage_id: Number(entrega.id),
        in_container: 1,
        out_container: 1,
        units: newUnidades,
        container: newCajas,
        Empresa_id: entrega.empresaId,
        gross_weight: 1.02,
        net_weight: newPeso,
        Container_id: 1,
      });

      if (!response) {
        alert("Error al actualizar la entrega.");
        return;
      }
    }

    // Update list locally
    setEntregasList((prev) =>
      prev.map((e) =>
        e.id === entrega.id
          ? {
              ...e,
              cajas: newCajas,
              unidades: newUnidades,
              peso: newPeso,
              bono: editValues.bono,
            }
          : e
      )
    );

    setEditingId(null);
  };

  const handleDeleteClick = async (entrega: EntregaEmpresa) => {
    if (entrega.guardado) {
      if (!entrega.empresaId) {
        alert("Falta el ID de empresa para eliminar.");
        return;
      }
      
      const confirmDelete = window.confirm("¿Estás seguro de eliminar esta entrega guardada?");
      if (!confirmDelete) return;

      const response = await updateEmpresaStage({
        EmpresaStage_id: Number(entrega.id),
        in_container: 1,
        out_container: 1,
        units: entrega.unidades,
        container: entrega.cajas,
        Empresa_id: entrega.empresaId,
        gross_weight: 1.02,
        net_weight: entrega.peso,
        Container_id: 1,
        active: "false", // Soft delete
      });

      if (!response) {
        alert("Error al eliminar la entrega.");
        return;
      }
    }

    const newEntregas = entregasList.filter((item) => item.id !== entrega.id);
    setEntregasList(newEntregas);
    if (currentPage > Math.ceil(newEntregas.length / itemsPerPage) && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
                  <div className="w-16 shrink-0 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">
                    Aciones
                  </div>
                </div>
                {paginatedEntregas.map((entrega, index) => (
                  <div
                    key={entrega.id}
                    className="flex items-center px-2 py-1.5 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-200 gap-3"
                  >
                    {editingId === entrega.id ? (
                      <div className="grid grid-cols-4 gap-3 w-full items-center">
                        <InputField
                          type="number"
                          value={editValues.cajas}
                          onChange={(e) => setEditValues({ ...editValues, cajas: e.target.value })}
                          className="h-7 text-xs"
                        />
                        <InputField
                          type="number"
                          value={editValues.unidades}
                          onChange={(e) => setEditValues({ ...editValues, unidades: e.target.value })}
                          className="h-7 text-xs"
                        />
                        <InputField
                          type="number"
                          value={editValues.peso}
                          onChange={(e) => setEditValues({ ...editValues, peso: e.target.value })}
                          className="h-7 text-xs"
                        />
                        <div
                          className="h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded cursor-pointer transition-colors"
                          onClick={() => setEditValues({ ...editValues, bono: !editValues.bono })}
                        >
                          <input
                            type="checkbox"
                            checked={editValues.bono}
                            readOnly
                            className="w-3 h-3 text-red-600 rounded border-gray-300 cursor-pointer pointer-events-none"
                          />
                        </div>
                      </div>
                    ) : (
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
                    )}

                    <div className="flex items-center gap-1 w-16 shrink-0 justify-center">
                      {editingId === entrega.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(entrega)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
                            title="Guardar"
                          >
                            <CheckIcon size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                            title="Cancelar"
                          >
                            <CloseRoundedIcon size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(entrega)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
                            title="Editar"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entrega)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50`}
                            title="Eliminar"
                          >
                            <CloseRoundedIcon size={16} />
                          </button>
                        </>
                      )}
                    </div>
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

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            variant="success"
            color="success"
            onClick={handleGuardarAll}
            loading={loadingEmpresa || loadingStage}
            disabled={entregasList.filter((e) => !e.guardado).length === 0 || loadingEmpresa || loadingStage}
          >
            Guardar Entregas
          </Button>
        </div>
      </div>
    </Modal>
  );
}
