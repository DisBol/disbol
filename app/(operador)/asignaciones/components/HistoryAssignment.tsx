"use client";

import React, { useState } from "react";
import { SelectInput } from "@/components/ui/SelectInput";
import { DateField } from "@/components/ui/DateField";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

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
  estado: "COMPLETO" | "PENDIENTE" | "CANCELADO";
  productos: ProductQuantity[];
}

// Mock data
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    fecha: "30/11/2025",
    proveedor: "SOFIA",
    estado: "COMPLETO",
    productos: [
      { codigo: "104", cajas: 10, unidades: 5, kgBruto: 100.0, kgNeto: 95.0 },
      { codigo: "105", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "106", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "107", cajas: 5, unidades: 2, kgBruto: 50.0, kgNeto: 47.5 },
      { codigo: "108", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "109", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "110", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
    ],
  },
  {
    id: "2",
    fecha: "4/12/2025",
    proveedor: "PIO",
    estado: "PENDIENTE",
    productos: [
      { codigo: "104", cajas: 2, unidades: 3, kgBruto: 25.0, kgNeto: 23.0 },
      { codigo: "105", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "106", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "107", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "108", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "109", cajas: 5, unidades: 10, kgBruto: 75.0, kgNeto: 70.0 },
      { codigo: "110", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
    ],
  },
];

const PROVEEDOR_OPTIONS = [
  { value: "todos", label: "Todos los Proveedores" },
  { value: "sofia", label: "SOFIA" },
  { value: "pio", label: "PIO" },
];

const ESTADO_OPTIONS = [
  { value: "todos", label: "Todos los Estados" },
  { value: "completo", label: "COMPLETO" },
  { value: "pendiente", label: "PENDIENTE" },
  { value: "cancelado", label: "CANCELADO" },
];

export default function HistoryAssignment() {
  const [selectedProveedor, setSelectedProveedor] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "COMPLETO":
        return { color: "success" as const, variant: "solid" as const };
      case "PENDIENTE":
        return { color: "warning" as const, variant: "solid" as const };
      case "CANCELADO":
        return { color: "danger" as const, variant: "solid" as const };
      default:
        return { color: "default" as const, variant: "solid" as const };
    }
  };

  return (
    <div className="bg-white p-4 md:p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Historial de Asignaciones
          </h1>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {/* Proveedor Filter */}
            <div className="min-w-50">
              <SelectInput
                options={PROVEEDOR_OPTIONS}
                value={selectedProveedor}
                onChange={(e) => setSelectedProveedor(e.target.value)}
              />
            </div>

            {/* Estado Filter */}
            <div className="min-w-45">
              <SelectInput
                options={ESTADO_OPTIONS}
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
              />
            </div>

            {/* Fecha Inicio */}
            <div className="min-w-35">
              <DateField
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>

            {/* Fecha Fin */}
            <div className="min-w-35">
              <DateField
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>
        </div>

        {/* Lista de Asignaciones */}
        <div className="space-y-6">
          {MOCK_ASSIGNMENTS.map((assignment) => (
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
                    <Chip variant="solid" color="default" size="sm" radius="md">
                      {assignment.proveedor}
                    </Chip>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block">
                      ESTADO
                    </span>
                    <Chip
                      {...getStatusColor(assignment.estado)}
                      size="sm"
                      radius="md"
                    >
                      {assignment.estado}
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
                    <div
                      key={producto.codigo}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      {/* Header del Producto */}
                      <h4 className="font-bold text-gray-900 text-xs mb-2 text-center">
                        Código {producto.codigo}
                      </h4>

                      {/* Cantidades */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                            CAJAS
                          </label>
                          <div className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 text-center h-8 flex items-center justify-center">
                            {producto.cajas}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                            UNID.
                          </label>
                          <div className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 text-center h-8 flex items-center justify-center">
                            {producto.unidades}
                          </div>
                        </div>
                      </div>

                      {/* Información de Peso */}
                      <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                        <div className="text-xs text-blue-600 font-medium">
                          {producto.kgBruto.toFixed(2)} kg Bruto
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          {producto.kgNeto.toFixed(2)} kg Neto
                        </div>
                      </div>
                    </div>
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
