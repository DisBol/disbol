import { Input } from "@/components/ui/Input";
import { type Codigo, type ProductoInput } from "./types";

interface ProductoRowProps {
  codigo: Codigo;
  value: ProductoInput;
  onChange: (field: keyof ProductoInput, val: string) => void;
}

export function ProductoRow({ codigo, value, onChange }: ProductoRowProps) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
      {/* Código */}
      <span className="w-16 shrink-0 text-sm font-bold text-red-600">
        {codigo}
      </span>

      <div className="w-px h-5 bg-gray-200 shrink-0" />

      {/* Cajas */}
      <div className="flex-1 flex items-center gap-1.5">
        <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">Cajas</span>
        <Input
          type="number"
          inputSize="sm"
          min={0}
          placeholder="0"
          value={value.cajas}
          onChange={(e) => onChange("cajas", e.target.value)}
          className="text-center h-8"
        />
      </div>

      {/* Unidades */}
      <div className="flex-1 flex items-center gap-1.5">
        <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">Unid.</span>
        <Input
          type="number"
          inputSize="sm"
          min={0}
          placeholder="0"
          value={value.unidades}
          onChange={(e) => onChange("unidades", e.target.value)}
          className="text-center h-8"
        />
      </div>
    </div>
  );
}
