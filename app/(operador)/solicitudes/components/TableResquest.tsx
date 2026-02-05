"use client";

import { useState, useEffect } from "react";
import CardCode from "@/components/ui/CardCode";
import { Chip } from "@/components/ui/Chip";
import { Select } from "@/components/ui/SelecMultipe";
import { InputField } from "@/components/ui/InputField";
import { DateField } from "@/components/ui/DateField";
import { useGetrequesthistory } from "../hooks/solicitudes/useGetrequesthistory";

export default function TableResquest() {
  const { data, loading, error, filters, updateFilter } =
    useGetrequesthistory();

  const formatDateDisplay = (dateStr: Date | string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDateChange = (
    type: "start" | "end",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dateStr = e.target.value;
    if (!dateStr) return;

    const formatted =
      type === "start" ? `${dateStr} 00:00:00` : `${dateStr} 23:59:59`;

    if (type === "start") {
      updateFilter("start_date", formatted);
    } else {
      updateFilter("end_date", formatted);
    }
  };

  return (
    <div className="w-full mt-8">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Solicitudes</h2>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 font-primary">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <DateField
                    label="FECHA INICIO"
                    inputSize="sm"
                    value={
                      filters.start_date ? filters.start_date.split(" ")[0] : ""
                    }
                    onChange={(e) => handleDateChange("start", e)}
                  />
                </div>
                <div>
                  <DateField
                    label="FECHA FIN"
                    inputSize="sm"
                    value={
                      filters.end_date ? filters.end_date.split(" ")[0] : ""
                    }
                    onChange={(e) => handleDateChange("end", e)}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-2">
              <Select
                label="PROVEEDOR"
                size="sm"
                options={[
                  { value: "0", label: "Todos los Proveedores" },
                  { value: "1", label: "Sofía" },
                  { value: "2", label: "Pío" },
                ]}
                selectedValues={[filters.Provider_id.toString()]}
                onSelect={(opt) =>
                  updateFilter("Provider_id", Number(opt.value))
                }
                placeholder="Seleccionar..."
              />
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-2">
              <Select
                label="GRUPO"
                size="sm"
                options={[
                  { value: "0", label: "Todos los Grupos" },
                  { value: "20", label: "El Alto Norte" },
                  { value: "21", label: "El Alto Sur" },
                ]}
                selectedValues={[filters.ClientGroup_id.toString()]}
                onSelect={(opt) =>
                  updateFilter("ClientGroup_id", Number(opt.value))
                }
                placeholder="Seleccionar..."
              />
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <InputField
                label="CLIENTE"
                placeholder="Buscar cliente..."
                inputSize="sm"
                disabled
              />
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-2">
              <Select
                label="ESTADO"
                size="sm"
                options={[
                  { value: "0", label: "Todos los Estados" },
                  { value: "1", label: "Emitido" },
                  { value: "2", label: "Enviado" },
                ]}
                selectedValues={[filters.RequestState_id.toString()]}
                onSelect={(opt) =>
                  updateFilter("RequestState_id", Number(opt.value))
                }
                placeholder="Seleccionar..."
              />
            </div>
          </div>
        </div>

        {/* List of Cards */}
        {loading && <div className="text-center py-8">Cargando...</div>}
        {error && (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        )}

        <div className="space-y-4 font-primary">
          {!loading &&
            !error &&
            data.map((request) => (
              <div
                key={request.Request_id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-48 shrink-0 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">
                        FECHA
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatDateDisplay(request.Request_created_at)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">
                        GRUPO / RUTA
                      </span>
                      <div className="flex items-start gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 leading-tight">
                          {request.ClientGroup_name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">
                        CLIENTE
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {request.Client_name}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                          ESTADO
                        </span>
                        <Chip
                          variant="flat"
                          color={
                            request.RequestState_name === "EMITIDO"
                              ? "warning"
                              : request.RequestState_name === "ENVIADO"
                                ? "success"
                                : "default"
                          }
                          size="sm"
                          className="font-bold"
                        >
                          {request.RequestState_name}
                        </Chip>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                          PAGADO
                        </span>
                        <Chip
                          variant="flat"
                          color={request.pagado ? "success" : "danger"}
                          size="sm"
                          className="font-bold"
                        >
                          {request.pagado ? "SI" : "NO"}
                        </Chip>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        PRODUCTOS SOLICITADOS
                      </span>
                      <Chip
                        variant="solid"
                        color={
                          request.Provider_name === "SOFIA"
                            ? "danger"
                            : "default"
                        }
                        size="sm"
                        className={
                          request.Provider_name === "SOFIA"
                            ? "bg-red-300 border-none text-white font-bold"
                            : "bg-blue-300 border-none text-white font-bold"
                        }
                      >
                        {request.Provider_name}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                      {request.items.map((item, idx) => (
                        <CardCode
                          key={`${request.Request_id}-${item.Product_id}-${idx}`}
                          label={item.Product_name}
                          cajas={item.ProductRequest_containers}
                          unidades={item.ProductRequest_units}
                          menudencia={item.ProductRequest_menudencia === "true"}
                          readOnly={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {!loading && data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron solicitudes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
