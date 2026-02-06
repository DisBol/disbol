"use client";

import React, { useState, useMemo, useEffect } from "react";
import CardCode from "@/components/ui/CardCode";
import { Select } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { SaveIcon } from "@/components/icons/Save";
import { useCategoryProvider } from "../../configuraciones/hooks/proveedores/useCategoryprovider";
import { useProductsByCategory } from "../../configuraciones/hooks/productos/useProductsByCategory";
import { useClientGroups } from "../../configuraciones/hooks/clientes/useClientsGroups";
import { useClients } from "../../configuraciones/hooks/clientes/useClients";
import ClientForm from "../../configuraciones/components/clientes/ClientForm";

// Interfaces
interface ProductState {
  cajas: string;
  unidades: string;
  menudencia: boolean;
}

interface ProductsData {
  [key: string]: ProductState;
}

export default function NewRequest() {
  // Hooks for data
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const { categories: categoriesWithProducts, loading: isLoadingProducts } =
    useProductsByCategory();
  const { clientGroups, isLoading: isLoadingGroups } = useClientGroups();
  const { clients, fetchByGroup, loading: isLoadingClients } = useClients();

  // State
  const [proveedor, setProveedor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [ruta, setRuta] = useState("");
  const [cliente, setCliente] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [productosData, setProductosData] = useState<ProductsData>({});

  // Reset group when provider changes
  const handleProviderChange = (value: string) => {
    setProveedor(value);
    setGrupo("");
  };

  // Convert providers to options
  const providerOptions = useMemo(() => {
    return providers.map((p) => ({
      value: p.id.toString(),
      label: p.nombre,
    }));
  }, [providers]);

  // Get groups for selected provider
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

  // Route options from Client Groups
  const routeOptions = useMemo(() => {
    return clientGroups.map((g) => ({
      value: g.value,
      label: g.label,
    }));
  }, [clientGroups]);

  // Fetch clients when route changes
  useEffect(() => {
    if (ruta) {
      fetchByGroup(parseInt(ruta));
      setCliente(""); // Reset client when route changes
    } else {
      fetchByGroup(undefined);
    }
  }, [ruta]);

  // Client options
  const clientOptions = useMemo(() => {
    return clients.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    }));
  }, [clients]);

  // Get products for selected group (category)
  const availableProducts = useMemo(() => {
    if (!grupo) return [];

    const selectedCategory = categoriesWithProducts.find(
      (c) => c.id.toString() === grupo,
    );

    return selectedCategory ? selectedCategory.products : [];
  }, [grupo, categoriesWithProducts]);

  const handleProductoChange = (
    codigo: string,
    field: keyof ProductState,
    value: string | boolean,
  ) => {
    setProductosData((prev) => {
      const current = prev[codigo] || {
        cajas: "0",
        unidades: "0",
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
                onSelect={(option) => handleProviderChange(option.value)}
                placeholder={
                  isLoadingProviders ? "Cargando..." : "Seleccionar proveedor"
                }
              />
            </div>

            <div>
              <Select
                label="GRUPO"
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
            <div>
              <Select
                label="RUTA"
                options={routeOptions}
                selectedValues={ruta ? [ruta] : []}
                onSelect={(option) => setRuta(option.value)}
                placeholder={
                  isLoadingGroups ? "Cargando rutas..." : "Seleccionar ruta"
                }
              />
            </div>

            {/* Cliente Destino */}
            <div className="space-y-1">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Select
                    label="CLIENTE DESTINO"
                    options={clientOptions}
                    selectedValues={cliente ? [cliente] : []}
                    onSelect={(option) => setCliente(option.value)}
                    placeholder={
                      !ruta
                        ? "Seleccione primero una ruta"
                        : isLoadingClients
                          ? "Cargando clientes..."
                          : "Seleccionar cliente"
                    }
                    disabled={!ruta}
                  />
                </div>
                <button
                  className="w-10 h-10 shrink-0 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 flex items-center justify-center transition-colors mb-0.5"
                  onClick={() => setIsClientModalOpen(true)}
                  title="Nuevo Cliente"
                >
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

            {availableProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                {!grupo
                  ? "Seleccione un proveedor y grupo para ver los productos"
                  : "No hay productos disponibles para este grupo"}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {availableProducts.map((producto) => {
                  const prodId = producto.id.toString();
                  const state = productosData[prodId] || {
                    cajas: "0",
                    unidades: "0",
                    menudencia: true,
                  };

                  return (
                    <CardCode
                      key={producto.id}
                      label={producto.name} // Using product name as label, code might be part of name or separate
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
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Botón Registrar - Footer */}
        <div className="mt-8">
          <Button className="w-full " leftIcon={<SaveIcon />} size="lg">
            Registrar Pedido
          </Button>
        </div>
      </div>

      {/* Modal Nuevo Cliente */}
      <ClientForm
        isOpen={isClientModalOpen}
        onSave={() => {
          setIsClientModalOpen(false);
          // Refresh clients for current route
          if (ruta) {
            fetchByGroup(parseInt(ruta));
          }
        }}
        onCancel={() => setIsClientModalOpen(false)}
      />
    </div>
  );
}
