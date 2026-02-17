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
import {
  useAddAssignment,
  useAddAssignmentStage,
  useAddTicket,
  useAddProductAssignment,
} from "../hooks";

interface ProductState {
  cajas: string;
  unidades: string;
  menudencia: boolean;
  precio?: string;
}

interface ProductsData {
  [key: string]: ProductState;
}

export default function ProductAssignment({
  onAssignmentCreated,
}: {
  onAssignmentCreated?: () => void;
}) {
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const [proveedor, setProveedor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioDiferido, setPrecioDiferido] = useState(false);
  const { categories: categoriesWithProducts } = useProductsByCategory();

  // Hooks para las operaciones de asignación
  const { addAssignment, loading: loadingAssignment } = useAddAssignment();
  const { addAssignmentStage, loading: loadingStage } = useAddAssignmentStage();
  const { addTicket, loading: loadingTicket } = useAddTicket();
  const { addProductAssignment, loading: loadingProduct } =
    useAddProductAssignment();

  // Estados adicionales para campos requeridos
  const [codigoTicket, setCodigoTicket] = useState("");

  const isLoading =
    loadingAssignment || loadingStage || loadingTicket || loadingProduct;

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
    productId: string,
    field: keyof ProductState,
    value: string | boolean,
  ) => {
    setProductosData((prev) => {
      // Obtener estado actual o inicializar
      const current = prev[productId] || {
        cajas: "",
        unidades: "",
        menudencia: true,
      };

      return {
        ...prev,
        [productId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  // Función para procesar la asignación de productos
  const handleAsignarProductos = async () => {
    if (!proveedor) {
      alert("Debe seleccionar un proveedor");
      return;
    }

    if (!grupo) {
      alert("Debe seleccionar un grupo de productos");
      return;
    }

    // Filtrar productos que tienen cantidades ingresadas
    const productosConCantidades = Object.entries(productosData).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, data]) => data.cajas !== "" || data.unidades !== "",
    );

    if (productosConCantidades.length === 0) {
      alert("Debe ingresar cantidades para al menos un producto");
      return;
    }

    if (!codigoTicket.trim()) {
      alert("Debe ingresar un código de ticket");
      return;
    }

    try {
      // Paso 1: Crear Assignment
      const assignmentId = await addAssignment({
        Provider_id: proveedor,
      });

      if (!assignmentId) {
        throw new Error("Error al crear la asignación");
      }

      // Calcular totales
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const totalUnidades = productosConCantidades.reduce((sum, [_, data]) => {
        return sum + (parseInt(data.unidades) || 0);
      }, 0);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const totalCajas = productosConCantidades.reduce((sum, [_, data]) => {
        return sum + (parseInt(data.cajas) || 0);
      }, 0);

      const precioTotal = precioDiferido ? "0" : precio || "0";

      // Paso 2: Crear AssignmentStage
      const assignmentStageId = await addAssignmentStage({
        position: "1",
        in_container: totalCajas,
        out_container: 0,
        units: totalUnidades,
        container: totalCajas,
        payment: precioTotal,
        Assignment_id: assignmentId.toString(),
      });

      if (!assignmentStageId) {
        throw new Error("Error al crear la etapa de asignación");
      }

      // Paso 3: Crear Ticket
      const ticketId = await addTicket({
        code: codigoTicket,
        deferred_payment: precioDiferido ? "true" : "false",
        total_payment: precioTotal,
        product_payment: precioTotal,
        AssignmentStage_id: assignmentStageId.toString(),
      });

      if (!ticketId) {
        throw new Error("Error al crear el ticket");
      }

      // Paso 4: Crear ProductAssignment para cada producto
      const promises = productosConCantidades.map(async ([productId, data]) => {
        const productPrice = precioDiferido ? data.precio || "0" : precio;
        const cajas = parseInt(data.cajas) || 0;
        const unidades = parseInt(data.unidades) || 0;

        return addProductAssignment({
          container: cajas,
          units: unidades,
          menudencia: data.menudencia ? "true" : "false",
          net_weight: "0", // Valor por defecto - se puede modificar después
          gross_weight: "0", // Valor por defecto - se puede modificar después
          payment: productPrice || "0",
          Tickets_id: ticketId.toString(),
          Product_id: productId,
        });
      });

      await Promise.all(promises);

      // Limpiar formulario después del éxito
      setProductosData({});
      setCodigoTicket("");
      setPrecio("");
      setPrecioDiferido(false);

      alert(
        `¡Asignación creada exitosamente! Productos asignados: ${productosConCantidades.length}`,
      );

      // Notificar al componente padre que se refresque el historial
      onAssignmentCreated?.();
    } catch (error) {
      console.error("Error en la asignación:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-sm border-b border-gray-100">
      <div className="max-w-400 mx-auto">
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <span className="text-red-500 text-xl">+</span>
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

            {/* Código de Ticket */}
            <div>
              <InputField
                label="CÓDIGO DE TICKET"
                type="text"
                value={codigoTicket}
                onChange={(e) => setCodigoTicket(e.target.value)}
                placeholder="Ingrese código del ticket"
              />
            </div>
          </div>

          {/* LADO DERECHO - Productos Requeridos */}
          <div className="flex-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">
              CANTIDADES A ASIGNAR
            </h2>
            {availableProducts.length === 0 ? (
              <div className="text-center text-sm py-10 text-gray-500 bg-gray-50 rounded-lg">
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
          <Button
            className="w-full"
            leftIcon={<SaveIcon />}
            size="md"
            onClick={handleAsignarProductos}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Asignar Productos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
