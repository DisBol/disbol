"use client";

import React, { useState } from "react";
import CardCode from "@/components/ui/CardCode";
import { Select } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { SaveIcon } from "@/components/icons/Save";
import { useGetProvider } from "../../configuraciones/hooks/proveedores/useGetProvider";

// Interfaces
interface Product {
  codigo: string;
  label: string;
}

interface ProductState {
  cajas: string;
  unidades: string;
  menudencia: boolean;
}

interface ProductsData {
  [key: string]: ProductState;
}

const PRODUCTOS_LIST: Product[] = [
  { codigo: "104", label: "Código 104" },
  { codigo: "105", label: "Código 105" },
  { codigo: "106", label: "Código 106" },
  { codigo: "107", label: "Código 107" },
  { codigo: "108", label: "Código 108" },
  { codigo: "109", label: "Código 109" },
  { codigo: "110", label: "Código 110" },
];

const PROVEEDOR_OPTIONS_FALLBACK = [
  { value: "Avícola Sofía", label: "Avícola Sofía" },
  { value: "Proveedor 2", label: "Proveedor 2" },
  { value: "Proveedor 3", label: "Proveedor 3" },
];

const GRUPO_OPTIONS = [
  { value: "Seleccionar Grupo...", label: "Seleccionar Grupo..." },
  { value: "Grupo A", label: "Grupo A" },
  { value: "Grupo B", label: "Grupo B" },
  { value: "Grupo C", label: "Grupo C" },
];

export default function NewRequest() {
  const { options: providerOptions, isLoading: isLoadingProviders } =
    useGetProvider();
  const [proveedor, setProveedor] = useState(""); // Initialize empty, can set to first option after load if needed
  const [grupo, setGrupo] = useState("Seleccionar Grupo...");
  const [cliente, setCliente] = useState("");

  const [productosData, setProductosData] = useState<ProductsData>(
    PRODUCTOS_LIST.reduce((acc, prod) => {
      acc[prod.codigo] = {
        cajas: "0",
        unidades: "0",
        menudencia: true,
      };
      return acc;
    }, {} as ProductsData),
  );

  const handleProductoChange = (
    codigo: string,
    field: keyof ProductState,
    value: string | boolean,
  ) => {
    setProductosData((prev) => ({
      ...prev,
      [codigo]: {
        ...prev[codigo],
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-sm border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <span className="text-red-500 text-2xl">+</span>
          Nueva de Solicitud
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR IZQUIERDO - Formulario */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            {/* Proveedor Origen */}
            <div>
              <Select
                label="PROVEEDOR ORIGEN"
                options={providerOptions}
                selectedValues={proveedor ? [proveedor] : []}
                onSelect={(option) => setProveedor(option.value)}
                placeholder={
                  isLoadingProviders ? "Cargando..." : "Seleccionar proveedor"
                }
              />
            </div>

            {/* Grupo / Ruta */}
            <div>
              <Select
                label="GRUPO / RUTA"
                options={GRUPO_OPTIONS}
                selectedValues={[grupo]}
                onSelect={(option) => setGrupo(option.value)}
                placeholder="Seleccionar grupo"
              />
            </div>

            {/* Cliente Destino */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                CLIENTE DESTINO
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm placeholder:text-gray-400"
                />
                <button className="w-10 h-10 shrink-0 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 flex items-center justify-center transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* LADO DERECHO - Productos Requeridos */}
          <div className="flex-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">
              PRODUCTOS REQUERIDOS
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {PRODUCTOS_LIST.map((producto) => (
                <CardCode
                  key={producto.codigo}
                  label={producto.label}
                  cajas={productosData[producto.codigo].cajas}
                  unidades={productosData[producto.codigo].unidades}
                  onCajasChange={(val) =>
                    handleProductoChange(producto.codigo, "cajas", val)
                  }
                  onUnidadesChange={(val) =>
                    handleProductoChange(producto.codigo, "unidades", val)
                  }
                  menudencia={productosData[producto.codigo].menudencia}
                  onMenudenciaChange={(val) =>
                    handleProductoChange(producto.codigo, "menudencia", val)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botón Registrar - Footer */}
        <div className="mt-8">
          <Button className="w-full " leftIcon={<SaveIcon />} size="lg">
            Registrar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
