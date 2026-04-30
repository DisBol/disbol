"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardCode from "@/components/ui/CardCode";
import { Select } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { SaveIcon } from "@/components/icons/Save";
import ClientForm from "../../configuraciones/components/clientes/ClientForm";
import { useCategoryProvider } from "../../configuraciones/hooks/proveedores/useCategoryprovider";
import { useProductsByCategory } from "../../configuraciones/hooks/productos/useProductsByCategory";
import { useClientGroups } from "../../configuraciones/hooks/clientes/useClientsGroups";
import { useClients } from "../../configuraciones/hooks/clientes/useClients";
import { useAddRequest } from "../hooks/useAddRequest";
import { useAddRequestPaymentType } from "../hooks/useAddrequestpaymenttype";
import { useAddRequestRequestState } from "../hooks/useAddrequestrequeststate";
import { useAddRequestStage } from "../hooks/useAddrequeststage";
import { useAddProductRequest } from "../hooks/useAddproductrequest";

// --- Interfaces de Tipos ---

// Estado individual de un producto en la tarjeta
interface ProductState {
  cajas: string;
  unidades: string;
  menudencia: boolean;
  multiplier?: string;
}

// Objeto que almacena el estado de todos los productos seleccionados (Clave: ID del producto)
interface ProductsData {
  [key: string]: ProductState;
}

export default function NewRequest() {
  const router = useRouter();

  // ----------------------------------------------------------------------
  // 1. HOOKS DE OBTENCIÓN DE DATOS (DATA FETCHING)
  // ----------------------------------------------------------------------
  const { providers, loading: isLoadingProviders } = useCategoryProvider();

  const { categories: categoriesWithProducts, loading: isLoadingProducts } =
    useProductsByCategory();

  const { clientGroups, isLoading: isLoadingGroups } = useClientGroups();

  // 'fetchByGroup' se usará para recargar clientes cuando cambie la ruta
  const { clients, fetchByGroup, loading: isLoadingClients } = useClients();

  // ----------------------------------------------------------------------
  // 2. ESTADOS LOCALES (STATE)
  // ----------------------------------------------------------------------
  const [proveedor, setProveedor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [ruta, setRuta] = useState("");
  const [cliente, setCliente] = useState("");

  // Estado para controlar la visibilidad del modal de "Nuevo Cliente"
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Estado principal que guarda las cantidades ingresadas por producto
  const [productosData, setProductosData] = useState<ProductsData>({});

  // ----------------------------------------------------------------------
  // 3. HOOKS DE LÓGICA DE REGISTRO (API ACTIONS)
  // ----------------------------------------------------------------------
  const { addRequest, loading: loadingRequest } = useAddRequest();
  const { addPaymentType, loading: loadingPayment } =
    useAddRequestPaymentType();
  const { addRequestState, loading: loadingState } =
    useAddRequestRequestState();
  const { addStage, loading: loadingStage } = useAddRequestStage();
  const { addProduct, loading: loadingProduct } = useAddProductRequest();

  // Bandera general para saber si se está procesando el registro
  const isRegistering =
    loadingRequest ||
    loadingPayment ||
    loadingState ||
    loadingStage ||
    loadingProduct;

  // ----------------------------------------------------------------------
  // 4. LÓGICA DE NEGOCIO Y MANEJADORES
  // ----------------------------------------------------------------------

  /**
   * Maneja el proceso completo de guardar la solicitud.
   * Realiza múltiples llamadas a la API en secuencia (Waterfall).
   */
  const handleRegister = async () => {
    // A. Validaciones iniciales
    if (!proveedor || !cliente || !ruta) {
      alert(
        "Por favor complete todos los campos requeridos (Proveedor, Ruta, Cliente).",
      );
      return;
    }

    // B. Preparar la lista de todos los productos disponibles en el grupo
    // y validar que al menos uno tenga cantidad > 0
    const hasAnyProduct = availableProducts.some((p) => {
      const prod = productosData[p.id.toString()];
      return prod && (parseInt(prod.cajas) > 0 || parseInt(prod.unidades) > 0);
    });

    if (!hasAnyProduct) {
      alert("Seleccione al menos un producto.");
      return;
    }

    const selectedProductsIds = availableProducts.map((p) => p.id.toString());

    try {
      // PASO 1: Crear la cabecera de la Solicitud (Request)
      const selectedCategory = categoriesWithProducts.find(
        (c) => c.id.toString() === grupo,
      );
      if (!selectedCategory) throw new Error("No se encontró la categoría seleccionada");

      const reqResponse = await addRequest(
        selectedCategory.CategoryProvider_id,
        parseInt(cliente),
      );

      // Obtenemos el ID generado
      const request_id = reqResponse.data[0]?.request_id;
      if (!request_id) throw new Error("No se obtuvo request_id del servidor");

      // PASO 2: Asignar Tipo de Pago
      await addPaymentType(request_id);

      // PASO 3: Asignar Estado de la Solicitud
      await addRequestState(request_id);

      const parseContainerValue = (value: string) => {
      const num = parseFloat(value || "0");
      return Number.isFinite(num) ? Math.max(0, Math.ceil(num)) : 0;
    };

      // PASO 4: Crear la Etapa (Stage)
      // Primero calculamos los totales de todos los productos seleccionados
      let totalUnits = 0;
      let totalCajas = 0;

      selectedProductsIds.forEach((id) => {
        const prod = productosData[id];
        if (prod) {
          totalUnits += parseInt(prod.unidades || "0");
          totalCajas += parseContainerValue(prod.cajas || "0");
        }
      });

      // Enviamos los totales a la API
      const stageResponse = await addStage(
        1, // position (fijo según lógica actual)
        0, // in_container
        0, // out_container
        totalUnits,
        totalCajas,
        0.0, // payment
        request_id,
      );

      const requestStage_id = stageResponse.data[0]?.requeststage_id;
      if (!requestStage_id) throw new Error("No se obtuvo requeststage_id");

      // PASO 5: Registrar cada Producto individualmente (Loop)
      for (const prodId of selectedProductsIds) {
        const prodData = productosData[prodId] || {
          unidades: "0",
          cajas: "0",
          menudencia: true,
        };
        const units = parseInt(prodData.unidades || "0") || 0;
        const cajas = parseContainerValue(prodData.cajas || "0");
        const menudencia = prodData.menudencia;
        const isActive = units > 0 || cajas > 0;

        await addProduct(
          cajas,
          units,
          menudencia,
          0.0, // net_weight (por defecto 0 si no se captura)
          0.0, // gross_weight
          0.0, // payment
          isActive, // active
          requestStage_id,
          parseInt(prodId),
        );
      }

      // Finalización exitosa
      alert("Solicitud registrada con éxito!");

      // Limpiar formulario
      setProveedor("");
      setGrupo("");
      setRuta("");
      setCliente("");
      setProductosData({});
    } catch (error) {
      console.error("Error en registro:", error);
      alert(
        "Error al registrar la solicitud: " +
          (error instanceof Error ? error.message : "Error desconocido"),
      );
    }
  };

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

  // Prepara opciones para el Select de Rutas
  const routeOptions = useMemo(() => {
    return clientGroups.map((g) => ({
      value: g.value,
      label: g.label,
    }));
  }, [clientGroups]);

  // Efecto: Cargar clientes cuando se selecciona una Ruta
  useEffect(() => {
    if (ruta) {
      fetchByGroup(parseInt(ruta));
      setCliente(""); // Resetear cliente al cambiar de ruta
    } else {
      fetchByGroup(undefined);
    }
  }, [ruta]);

  // Prepara opciones para el Select de Clientes
  const clientOptions = useMemo(() => {
    return clients.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    }));
  }, [clients]);

  // Obtiene los productos disponibles según el Grupo seleccionado
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
      // Obtener estado actual o inicializar
      const current = prev[codigo] || {
        cajas: "0",
        unidades: "0",
        menudencia: true,
      };

      const newState = { ...current, [field]: value };

      return {
        ...prev,
        [codigo]: newState,
      };
    });
  };

  // ----------------------------------------------------------------------
  // 5. RENDERIZADO (JSX)
  // ----------------------------------------------------------------------
  return (
    <div className="bg-white p-4 md:p-6 shadow-sm border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto">
        {/* Título de la Página */}
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <span className="text-red-500 text-2xl">+</span>
          Nueva de Solicitud
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- BARRA LATERAL IZQUIERDA (Selectores) --- */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            {/* 1. Selección de Proveedor */}
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

            {/* 2. Selección de Grupo (Categoría) */}
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

            {/* 3. Selección de Ruta */}
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

            {/* 4. Selección de Cliente (Con botón de agregar nuevo) */}
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
                {/* Botón para abrir modal de nuevo cliente */}
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

          {/* --- PANEL DERECHO (Grilla de Productos) --- */}
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
                      productName={producto.name}
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
                      multiplier={
                        state.multiplier
                          ? Number(state.multiplier)
                          : undefined
                      }
                      onMultiplierChange={(val) =>
                        handleProductoChange(
                          prodId,
                          "multiplier",
                          val === null ? "" : String(val),
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER: Botón de Acción --- */}
        <div className="mt-8">
          <Button
            className="w-full"
            leftIcon={<SaveIcon />}
            size="md"
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering ? "Registrando..." : "Registrar Pedido"}
          </Button>
        </div>
      </div>

      {/* --- MODALES --- */}
      <ClientForm
        isOpen={isClientModalOpen}
        onSave={() => {
          setIsClientModalOpen(false);
          // Recargar clientes de la ruta actual si se guardó uno nuevo
          if (ruta) {
            fetchByGroup(parseInt(ruta));
          }
        }}
        onCancel={() => setIsClientModalOpen(false)}
      />
    </div>
  );
}
