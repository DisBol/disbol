"use client";

import React, { useState } from "react";
import CardCode from "@/components/ui/CardCode";
import { Select } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
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
  precio?: string;
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

const GRUPO_OPTIONS = [
  { value: "Seleccionar Grupo...", label: "Seleccionar Grupo..." },
  { value: "Grupo A", label: "Grupo A" },
  { value: "Grupo B", label: "Grupo B" },
  { value: "Grupo C", label: "Grupo C" },
];

export default function ProductAssignment() {
  const { options: providerOptions, isLoading: isLoadingProviders } =
    useGetProvider();
  const [proveedor, setProveedor] = useState(""); // Initialize empty, can set to first option after load if needed
  const [grupo, setGrupo] = useState("Seleccionar Grupo...");
  const [precio, setPrecio] = useState("");
  const [precioDiferido, setPrecioDiferido] = useState(false);

  const [productosData, setProductosData] = useState<ProductsData>(
    PRODUCTOS_LIST.reduce((acc, prod) => {
      acc[prod.codigo] = {
        cajas: "0",
        unidades: "0",
        menudencia: true,
        precio: "0.00",
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
      <div className="max-w-400 mx-auto">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <span className="text-red-500 text-2xl">+</span>
          Asignación de Productos
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

            {/* Grupo de Productos */}
            <div>
              <Select
                label="GRUPO DE PRODUCTOS"
                options={GRUPO_OPTIONS}
                selectedValues={[grupo]}
                onSelect={(option) => setGrupo(option.value)}
                placeholder="Seleccionar grupo"
              />
            </div>

            {/* Precio */}
            <div>
              <InputField
                label="PRECIO (Bs./Kg.)"
                type="text"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ingrese el precio"
                disabled={precioDiferido}
              />

              {/* Checkbox Precio Diferido */}
              <div className="mt-2">
                <Checkbox
                  label="Precio diferido"
                  checked={precioDiferido}
                  onChange={setPrecioDiferido}
                />
              </div>
            </div>
          </div>

          {/* LADO DERECHO - Productos Requeridos */}
          <div className="flex-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">
              CANTIDADES A ASIGNAR
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
                  showPrecio={precioDiferido}
                  precio={productosData[producto.codigo].precio || "0.00"}
                  onPrecioChange={(val) =>
                    handleProductoChange(producto.codigo, "precio", val)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botón Registrar - Footer */}
        <div className="mt-8">
          <Button className="w-full " leftIcon={<SaveIcon />} size="lg">
            Asignar Productos
          </Button>
        </div>
      </div>
    </div>
  );
}
