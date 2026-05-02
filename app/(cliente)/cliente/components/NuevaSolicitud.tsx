"use client";

import { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { SelectField } from "@/components/ui/SelectInput";
import { Input } from "@/components/ui/Input";
import { ProductoRow } from "./ProductoRow";
import type { ProductoInput } from "./types";
import { useProductsByCategory } from "@/app/(operador)/configuraciones/hooks/productos/useProductsByCategory";
import { useCategoryProvider } from "@/app/(operador)/configuraciones/hooks/proveedores/useCategoryprovider";
import { useClientGroups } from "@/app/(operador)/configuraciones/hooks/clientes/useClientsGroups";

interface NuevaSolicitudProps {
  proveedor: string;
  setProveedor: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  grupo: string;
  setGrupo: (v: string) => void;
  productos: Record<string, ProductoInput>;
  onProductoChange: (
    codigo: string,
    field: keyof ProductoInput,
    val: string,
  ) => void;
  onEnviar: () => void;
}

export function NuevaSolicitud({
  proveedor,
  setProveedor,
  fecha,
  setFecha,
  grupo,
  setGrupo,
  productos,
  onProductoChange,
  onEnviar,
}: NuevaSolicitudProps) {
  const { categories, loading: isLoadingProducts } = useProductsByCategory();

  const availableProducts = useMemo(() => {
    if (!proveedor || !grupo) return [];
    const selected = categories.find((c) => c.id.toString() === grupo);
    return selected ? selected.products : [];
  }, [proveedor, grupo, categories]);
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const { clientGroups, isLoading: isLoadingGroups } = useClientGroups();

  const providerOptions = useMemo(() => {
    return providers.map((p) => ({ value: p.id.toString(), label: p.nombre }));
  }, [providers]);

  const groupOptions = useMemo(() => {
    if (!proveedor) return [];
    const selected = providers.find((p) => p.id.toString() === proveedor);
    if (!selected) return [];
    return selected.grupos.map((g) => ({
      value: g.id.toString(),
      label: g.name,
    }));
  }, [proveedor, providers]);

  const routeOptions = useMemo(() => {
    return clientGroups.map((g) => ({ value: g.value, label: g.label }));
  }, [clientGroups]);
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <h2 className="text-sm font-bold text-red-600">Nueva Solicitud</h2>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Proveedor + Fecha en una fila */}
        <div className="grid grid-cols-3 gap-3">
          <SelectField
            label="Proveedor"
            value={proveedor}
            onChange={(e) => {
              setProveedor(e.target.value);
              setGrupo("");
            }}
            options={providerOptions}
            inputSize="sm"
            placeholder={
              isLoadingProviders
                ? "Cargando proveedores..."
                : "Seleccionar proveedor"
            }
          />

          <SelectField
            label="Grupo"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            options={groupOptions}
            inputSize="sm"
            placeholder={
              !proveedor
                ? "Seleccione primero un proveedor"
                : "Seleccionar grupo"
            }
            disabled={!proveedor}
          />

          {/* Ruta ya no es necesaria */}
        </div>

        <div>
          <DateField
            label="Fecha de Entrega"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            size="sm"
            radius="md"
          />
        </div>

        {/* Productos */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Productos Solicitados
          </p>
          {availableProducts.length === 0 ? (
            <div className="text-sm text-gray-500">
              Seleccione un grupo para ver productos
            </div>
          ) : (
            <div className="space-y-2">
              {availableProducts.map((p) => {
                const pid = p.id.toString();
                const val = productos[pid] ?? { cajas: "", unidades: "" };
                return (
                  <div
                    key={pid}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">
                        {p.name}
                      </div>
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        inputSize="sm"
                        min={0}
                        placeholder="Cajas"
                        value={val.cajas}
                        onChange={(e) =>
                          onProductoChange(pid, "cajas", e.target.value)
                        }
                        className="text-center h-8"
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        inputSize="sm"
                        min={0}
                        placeholder="Unid."
                        value={val.unidades}
                        onChange={(e) =>
                          onProductoChange(pid, "unidades", e.target.value)
                        }
                        className="text-center h-8"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button
          variant="danger"
          size="md"
          radius="lg"
          fullWidth
          onClick={onEnviar}
          className="h-10"
        >
          Enviar Solicitud
        </Button>
      </CardContent>
    </Card>
  );
}
