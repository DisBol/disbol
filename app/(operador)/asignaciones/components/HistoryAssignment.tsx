"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DateField } from "@/components/ui/DateField";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import CardCode from "@/components/ui/CardCode";
import ReceptionScreen from "./ReceptionScreen";
import { Select } from "@/components/ui/SelecMultipe";
import { useGetAssignmentHistory } from "../hooks/useGetassignmenthistory";
import { Datum } from "../interfaces/getassignmenthistory.interface";
import { useCategoryProvider } from "../../configuraciones/hooks/proveedores/useCategoryprovider";

// Interfaces
interface ProductQuantity {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
}

interface Assignment {
  id: string;
  fecha: string;
  proveedor: string;
  productos: ProductQuantity[];
}

export default function HistoryAssignment({
  onReceptionStateChange,
}: {
  onReceptionStateChange?: (show: boolean) => void;
}) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [showReception, setShowReception] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const [proveedor, setProveedor] = useState("");

  const providerOptions = useMemo(() => {
    return providers.map((p) => ({
      value: p.id.toString(),
      label: p.nombre,
    }));
  }, [providers]);

  // Hook para obtener el historial de asignaciones
  const {
    data: assignmentData,
    loading,
    error,
    fetchAssignmentHistory,
  } = useGetAssignmentHistory();

  // Obtener las asignaciones transformadas y aplicar filtros del lado del cliente
  const assignments = useMemo(() => {
    // Función para transformar los datos de la API
    const transformApiDataToAssignments = (
      apiData: Datum[] | null,
    ): Assignment[] => {
      if (!apiData || apiData.length === 0) return [];

      // Agrupar por Assignment_id
      const groupedData = apiData.reduce(
        (acc, item) => {
          const assignmentId = item.Assignment_id.toString();

          if (!acc[assignmentId]) {
            acc[assignmentId] = {
              id: assignmentId,
              fecha: new Date(item.Assignment_created_at).toLocaleDateString(
                "es-ES",
              ),
              proveedor: item.Provider_name,
              productos: [],
            };
          }

          // Agregar producto
          acc[assignmentId].productos.push({
            codigo: item.Product_name,
            cajas: item.ProductAssignment_container,
            unidades: item.ProductAssignment_units,
            kgBruto: parseFloat(item.ProductAssignment_gross_weight || "0"),
            kgNeto: parseFloat(item.ProductAssignment_net_weight || "0"),
          });

          return acc;
        },
        {} as Record<string, Assignment>,
      );

      return Object.values(groupedData);
    };

    return transformApiDataToAssignments(assignmentData);
  }, [assignmentData]);

  // Función para convertir fecha a yyyy-mm-dd hh:mm:ss
  const formatDateForAPI = (dateStr: string, isEndDate = false) => {
    if (!dateStr) return null;

    let year: string, month: string, day: string;

    // Detectar formato de fecha
    if (dateStr.includes("/")) {
      // Formato dd/mm/yyyy
      const parts = dateStr.split("/");
      if (parts.length !== 3) return null;
      [day, month, year] = parts;
    } else if (dateStr.includes("-")) {
      // Formato yyyy-mm-dd
      const parts = dateStr.split("-");
      if (parts.length !== 3) return null;
      [year, month, day] = parts;
    } else {
      return null;
    }

    // Validar que sean números
    if (
      !day ||
      !month ||
      !year ||
      isNaN(parseInt(day)) ||
      isNaN(parseInt(month)) ||
      isNaN(parseInt(year))
    ) {
      return null;
    }

    // Validar rangos
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (
      dayNum < 1 ||
      dayNum > 31 ||
      monthNum < 1 ||
      monthNum > 12 ||
      yearNum < 2000
    ) {
      return null;
    }

    const time = isEndDate ? "23:59:59" : "00:00:00";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${time}`;
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    let startDate: string;
    let endDate: string;

    if (fechaInicio || fechaFin) {
      // Si hay fechas seleccionadas, validar que ambas estén presentes
      if (!fechaInicio || !fechaFin) {
        alert("Por favor, seleccione tanto fecha de inicio como fecha de fin.");
        return;
      }

      // Usar fechas seleccionadas
      const formattedStartDate = formatDateForAPI(fechaInicio, false);
      const formattedEndDate = formatDateForAPI(fechaFin, true);

      if (!formattedStartDate || !formattedEndDate) {
        alert(
          "Formato de fecha inválido. Use el formato dd/mm/yyyy o seleccione una fecha del calendario.",
        );
        return;
      }

      startDate = formattedStartDate;
      endDate = formattedEndDate;
    } else {
      // Usar fechas por defecto (últimos 30 días)
      startDate = thirtyDaysAgo.toISOString().split("T")[0] + " 00:00:00";
      endDate = today.toISOString().split("T")[0] + " 23:59:59";
    }

    const providerId = proveedor ? parseInt(proveedor) : 0; // 0 para listar todos

    fetchAssignmentHistory({
      start_date: startDate,
      end_date: endDate,
      Provider_id: providerId,
    });
  };

  // Cargar datos iniciales
  useEffect(() => {
    applyFilters();
  }, [fetchAssignmentHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRecibirClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowReception(true);
    onReceptionStateChange?.(true);
  };

  const handleBackFromReception = () => {
    setShowReception(false);
    setSelectedAssignment(null);
    onReceptionStateChange?.(false);
  };

  // Si estamos mostrando la pantalla de recepción, renderizarla
  if (showReception && selectedAssignment) {
    return (
      <ReceptionScreen
        assignment={selectedAssignment}
        onBack={handleBackFromReception}
      />
    );
  }

  return (
    <div className="bg-white p-4 md:p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h1 className="text-lg font-bold text-gray-900">
            Historial de Asignaciones
          </h1>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {/* Proveedor Filter */}
            <div className="min-w-50">
              <Select
                size="sm"
                options={providerOptions}
                selectedValues={proveedor ? [proveedor] : []}
                onSelect={(option) => setProveedor(option.value)}
                placeholder={
                  isLoadingProviders ? "Cargando..." : "Seleccionar proveedor"
                }
              />
            </div>

            {/* Fecha Inicio */}
            <div className="min-w-35">
              <DateField
                size="sm"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>

            {/* Fecha Fin */}
            <div className="min-w-35">
              <DateField
                size="sm"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>

            {/* Botón Filtrar */}
            <div>
              <Button
                variant="primary"
                color="primary"
                size="sm"
                onClick={applyFilters}
                disabled={loading}
              >
                Filtrar
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Asignaciones */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Cargando historial de asignaciones...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {!loading && !error && assignments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No se encontraron asignaciones para el período seleccionado.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                {/* Header de la Asignación */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="space-y-2 lg:space-y-0 lg:space-x-6 lg:flex lg:items-center">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block">
                        FECHA
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {assignment.fecha}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block">
                        PROVEEDOR
                      </span>
                      <Chip variant="flat" color="info" size="sm" radius="md">
                        {assignment.proveedor}
                      </Chip>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-2 mt-3 lg:mt-0">
                    <Button
                      variant="primary"
                      color="danger"
                      size="sm"
                      className="min-w-22.5"
                    >
                      Repartir
                    </Button>
                    <Button
                      variant="warning"
                      color="warning"
                      size="sm"
                      className="min-w-22.5"
                    >
                      Planificar
                    </Button>
                    <Button
                      variant="success"
                      color="success"
                      size="sm"
                      className="min-w-22.5"
                      onClick={() => handleRecibirClick(assignment)}
                    >
                      Recibir
                    </Button>
                  </div>
                </div>

                {/* Detalle de Productos */}
                <div className="p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">
                    DETALLE DE PRODUCTOS
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {assignment.productos.map((producto) => (
                      <CardCode
                        key={producto.codigo}
                        label={`Código ${producto.codigo}`}
                        cajas={producto.cajas}
                        unidades={producto.unidades}
                        readOnly={true}
                        weightInfo={{
                          adicional: [
                            {
                              label: "",
                              value: `${producto.kgBruto.toFixed(2)} kg Bruto`,
                              color: "default",
                            },
                            {
                              label: "",
                              value: `${producto.kgNeto.toFixed(2)} kg Neto`,
                              color: "default",
                            },
                          ],
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
