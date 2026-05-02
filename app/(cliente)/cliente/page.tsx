"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { NuevaSolicitud } from "./components/NuevaSolicitud";
import { ExtractoCanastos } from "./components/ExtractoCanastos";
import type { ProductoInput } from "./components/types";
import { useProductsByCategory } from "@/app/(operador)/configuraciones/hooks/productos/useProductsByCategory";
import { useAddRequest } from "@/app/(operador)/solicitudes/hooks/useAddRequest";
import { useAddRequestPaymentType } from "@/app/(operador)/solicitudes/hooks/useAddrequestpaymenttype";
import { useAddRequestRequestState } from "@/app/(operador)/solicitudes/hooks/useAddrequestrequeststate";
import { useAddRequestStage } from "@/app/(operador)/solicitudes/hooks/useAddrequeststage";
import { useAddProductRequest } from "@/app/(operador)/solicitudes/hooks/useAddproductrequest";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { BoxOutline2Icon } from "@/components/icons/BoxOutline2";

export default function ClientePage() {
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState("");
  const [grupo, setGrupo] = useState("");

  const { data: session } = useSession();
  const [productos, setProductos] = useState<Record<string, ProductoInput>>({});

  // Hooks needed for sending
  const { categories } = useProductsByCategory();
  const { addRequest } = useAddRequest();
  const { addPaymentType } = useAddRequestPaymentType();
  const { addRequestState } = useAddRequestRequestState();
  const { addStage } = useAddRequestStage();
  const { addProduct } = useAddProductRequest();

  const handleProductoChange = (
    codigo: string,
    field: keyof ProductoInput,
    val: string,
  ) => {
    setProductos((prev) => ({
      ...prev,
      [codigo]: {
        ...(prev[codigo] ?? { cajas: "", unidades: "" }),
        [field]: val,
      },
    }));
  };

  const availableProducts = useMemo(() => {
    if (!grupo) return [];
    const selected = categories.find((c) => c.id.toString() === grupo);
    return selected ? selected.products : [];
  }, [grupo, categories]);

  const handleEnviar = async () => {
    const clientId =
      session?.user?.client_id ?? session?.user?.clientId ?? null;
    if (!clientId) return alert("No se encontró clientId en la sesión");

    // Validaciones
    if (!proveedor || !grupo) {
      return alert(
        "Seleccione proveedor y grupo antes de enviar la solicitud.",
      );
    }

    // Validar que exista al menos un producto con cantidad
    const selectedProductIds = availableProducts.map((p) => p.id.toString());
    const hasAny = selectedProductIds.some((id) => {
      const p = productos[id];
      return (
        p && (parseInt(p.unidades || "0") > 0 || parseInt(p.cajas || "0") > 0)
      );
    });

    if (!hasAny) return alert("Seleccione al menos un producto con cantidad.");

    try {
      // Obtener CategoryProvider_id desde categories
      const selectedCategory = categories.find(
        (c) => c.id.toString() === grupo,
      );
      if (!selectedCategory)
        throw new Error("No se encontró la categoría seleccionada");

      const reqResp = await addRequest(
        selectedCategory.CategoryProvider_id,
        Number(clientId),
      );
      const request_id = reqResp.data[0]?.request_id;
      if (!request_id) throw new Error("No se obtuvo request_id del servidor");

      // Agregar tipo de pago y estado
      await addPaymentType(request_id);
      await addRequestState(request_id);

      // Calcular totales
      let totalUnits = 0;
      let totalCajas = 0;
      const parseContainerValue = (value: string) => {
        const num = parseFloat(value || "0");
        return Number.isFinite(num) ? Math.max(0, Math.ceil(num)) : 0;
      };

      selectedProductIds.forEach((id) => {
        const p = productos[id];
        if (p) {
          totalUnits += parseInt(p.unidades || "0") || 0;
          totalCajas += parseContainerValue(p.cajas || "0");
        }
      });

      const stageResp = await addStage(
        1,
        0,
        0,
        totalUnits,
        totalCajas,
        0.0,
        request_id,
      );
      const requestStage_id = stageResp.data[0]?.requeststage_id;
      if (!requestStage_id) throw new Error("No se obtuvo requeststage_id");

      // Registrar productos
      for (const pid of selectedProductIds) {
        const pdata = productos[pid] || { unidades: "0", cajas: "0" };
        const units = parseInt(pdata.unidades || "0") || 0;
        const cajas = parseContainerValue(pdata.cajas || "0");
        const active = units > 0 || cajas > 0;

        if (!active) continue;

        await addProduct(
          cajas,
          units,
          true,
          0.0,
          0.0,
          0.0,
          active,
          requestStage_id,
          Number(pid),
        );
      }

      alert("Solicitud registrada correctamente");

      // limpiar
      setProveedor("");
      setGrupo("");
      setProductos({});
    } catch (err) {
      console.error(err);
      alert(
        "Error al registrar la solicitud: " +
          (err instanceof Error ? err.message : "Error desconocido"),
      );
    }
  };

  const sharedProps = {
    proveedor,
    setProveedor,
    fecha,
    setFecha,
    grupo,
    setGrupo,
    productos,
    onProductoChange: handleProductoChange,
    onEnviar: handleEnviar,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <h1 className="text-xl font-extrabold text-red-600">App Cliente</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Realice sus solicitudes y consulte su extracto de canastos
        </p>
      </div>

      {/* ── Mobile: Tabs ── */}
      <div className="lg:hidden p-4">
        {/* session available for client id */}
        <Tabs defaultValue="solicitud">
          <TabsList variant="solid" fullWidth className="mb-4 w-full">
            <TabsTrigger
              value="solicitud"
              variant="solid"
              size="md"
              className="flex-1 gap-1.5"
              icon={<BoxOutline2Icon size={14} />}
            >
              Solicitud
            </TabsTrigger>
            <TabsTrigger
              value="extracto"
              variant="solid"
              size="md"
              className="flex-1 gap-1.5"
              icon={<BoxOutlineIcon size={14} />}
            >
              Extracto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solicitud" animation="fade">
            <NuevaSolicitud {...sharedProps} />
          </TabsContent>

          <TabsContent value="extracto" animation="fade">
            <ExtractoCanastos />
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Desktop: Grid 2 cols ── */}
      <div className="hidden lg:grid grid-cols-3 gap-6 p-6 items-start">
        <div className="col-span-2">
          <NuevaSolicitud {...sharedProps} />
        </div>
        <div className="col-span-1 sticky top-6">
          <ExtractoCanastos />
        </div>
      </div>
    </div>
  );
}
