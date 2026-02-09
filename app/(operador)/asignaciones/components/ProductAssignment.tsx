"use client";

import React, { useMemo, useState } from "react";
import CardCode from "@/components/ui/CardCode";
import { Select } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
import { useCategoryProvider } from "../../configuraciones/hooks/proveedores/useCategoryprovider";
import { useProductsByCategory } from "../../configuraciones/hooks/productos/useProductsByCategory";

interface ProductState {
  cajas: string;
  unidades: string;
  menudencia: boolean;
  precio?: string;
}

interface ProductsData {
  [key: string]: ProductState;
}

export default function ProductAssignment() {
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const [proveedor, setProveedor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioDiferido, setPrecioDiferido] = useState(false);
  const { categories: categoriesWithProducts } = useProductsByCategory();

  // Maneja el cambio de proveedor y resetea el grupo
  const handleProviderChange = (value: string) => {
    setProveedor(value);
    setGrupo(""); // Resetear grupo al cambiar proveedor
  };

  // Prepara opciones para el Select de Proveedores
  const providerOptions = useMemo(() => {
    return providers.map((p) => ({
      value: p.id.toString(),
      label: p.nombre,
    }));
  }, [providers]);

  // Prepara opciones para el Select de Grupos (Depende del Proveedor seleccionado)
  const groupOptions = useMemo(() => {
    if (!proveedor) return [];

    const selectedProvider = providers.find(
      (p) => p.id.toString() === proveedor,
    );

    if (!selectedProvider) return [];

    return selectedProvider.grupos.map((g) => ({
      value: g.id.toString(),
      label: g.name,
    }));
  }, [proveedor, providers]);

  // Obtiene los productos disponibles según el Grupo seleccionado
  const availableProducts = useMemo(() => {
    if (!grupo) return [];

    const selectedCategory = categoriesWithProducts.find(
      (c) => c.id.toString() === grupo,
    );

    return selectedCategory ? selectedCategory.products : [];
  }, [grupo, categoriesWithProducts]);

  const [productosData, setProductosData] = useState<ProductsData>({});

  const handleProductoChange = (
    codigo: string,
    field: keyof ProductState,
    value: string | boolean,
  ) => {
    setProductosData((prev) => {
      // Obtener estado actual o inicializar
      const current = prev[codigo] || {
        cajas: "",
        unidades: "",
        menudencia: true,
      };

      return {
        ...prev,
        [codigo]: {
          ...current,
          [field]: value,
        },
      };
    });
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
                label="PROVEEDOR"
                options={providerOptions}
                selectedValues={proveedor ? [proveedor] : []}
                onSelect={(option) => handleProviderChange(option.value)}
                placeholder={
                  isLoadingProviders ? "Cargando..." : "Seleccionar proveedor"
                }
              />
            </div>

            {/* Grupo de Productos */}
            <div>
              <Select
                label="GRUPO DE PRODUCTOS"
                options={groupOptions}
                selectedValues={grupo ? [grupo] : []}
                onSelect={(option) => setGrupo(option.value)}
                placeholder={
                  !proveedor
                    ? "Seleccione primero un proveedor"
                    : "Seleccionar grupo"
                }
                disabled={!proveedor}
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
            {availableProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                {!grupo
                  ? "Seleccione un proveedor y grupo para ver los productos"
                  : "No hay productos disponibles para este grupo"}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {availableProducts.map((producto) => {
                  const prodId = producto.id.toString();
                  // Obtener estado actual o valores por defecto
                  const state = productosData[prodId] || {
                    cajas: "",
                    unidades: "",
                    menudencia: true,
                  };
                  return (
                    <CardCode
                      key={producto.id}
                      label={producto.name}
                      cajas={state.cajas}
                      unidades={state.unidades}
                      onCajasChange={(val) =>
                        handleProductoChange(prodId, "cajas", val)
                      }
                      onUnidadesChange={(val) =>
                        handleProductoChange(prodId, "unidades", val)
                      }
                      menudencia={state.menudencia}
                      onMenudenciaChange={(val) =>
                        handleProductoChange(prodId, "menudencia", val)
                      }
                      showPrecio={precioDiferido}
                      precio={state.precio || ""}
                      onPrecioChange={(val) =>
                        handleProductoChange(prodId, "precio", val)
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Button className="w-full " leftIcon={<SaveIcon />} size="md">
            Asignar Productos
          </Button>
        </div>
      </div>
    </div>
  );
}
