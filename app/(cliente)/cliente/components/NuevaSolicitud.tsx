"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { SelectField } from "@/components/ui/SelectInput";
import { ProductoRow } from "./ProductoRow";
import { CODIGOS, proveedores, type Codigo, type ProductoInput } from "./types";

interface NuevaSolicitudProps {
  proveedor: string;
  setProveedor: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  productos: Record<Codigo, ProductoInput>;
  onProductoChange: (codigo: Codigo, field: keyof ProductoInput, val: string) => void;
  onEnviar: () => void;
}

export function NuevaSolicitud({
  proveedor,
  setProveedor,
  fecha,
  setFecha,
  productos,
  onProductoChange,
  onEnviar,
}: NuevaSolicitudProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <h2 className="text-sm font-bold text-red-600">Nueva Solicitud</h2>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Proveedor + Fecha en una fila */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            options={proveedores}
            inputSize="sm"
          />
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
          <div className="space-y-1.5">
            {CODIGOS.map((codigo) => (
              <ProductoRow
                key={codigo}
                codigo={codigo}
                value={productos[codigo]}
                onChange={(field, val) => onProductoChange(codigo, field, val)}
              />
            ))}
          </div>
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
