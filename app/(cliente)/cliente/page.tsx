"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { NuevaSolicitud } from "./components/NuevaSolicitud";
import { ExtractoCanastos } from "./components/ExtractoCanastos";
import { CODIGOS, type Codigo, type ProductoInput } from "./components/types";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { BoxOutline2Icon } from "@/components/icons/BoxOutline2";

export default function ClientePage() {
  const [proveedor, setProveedor] = useState("pio");
  const [fecha, setFecha] = useState("");
  const [productos, setProductos] = useState<Record<Codigo, ProductoInput>>(
    Object.fromEntries(
      CODIGOS.map((c) => [c, { cajas: "", unidades: "" }]),
    ) as Record<Codigo, ProductoInput>,
  );

  const handleProductoChange = (
    codigo: Codigo,
    field: keyof ProductoInput,
    val: string,
  ) => {
    setProductos((prev) => ({
      ...prev,
      [codigo]: { ...prev[codigo], [field]: val },
    }));
  };

  const handleEnviar = () => {
    // TODO: conectar con API
    console.log({ proveedor, fecha, productos });
  };

  const sharedProps = {
    proveedor,
    setProveedor,
    fecha,
    setFecha,
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
