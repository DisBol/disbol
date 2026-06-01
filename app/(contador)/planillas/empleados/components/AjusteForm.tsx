"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputField } from "@/components/ui/InputField";

interface AjusteFormProps {
  empleadoNombre: string;
  tipoAjuste: "favor" | "contra";
  onGuardar?: (monto: number, detalle: string) => void;
  onCancelar?: () => void;
}

export default function AjusteForm({
  empleadoNombre,
  tipoAjuste,
  onGuardar,
  onCancelar,
}: AjusteFormProps) {
  const [monto, setMonto] = useState("");
  const [detalle, setDetalle] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const titulo =
    tipoAjuste === "favor" ? "Ajuste a Favor" : "Ajuste en Contra";

  const handleGuardar = () => {
    const newErrors: Record<string, string> = {};

    if (!monto.trim()) newErrors.monto = "El monto es requerido";
    if (isNaN(parseFloat(monto))) newErrors.monto = "El monto debe ser un número";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onGuardar) {
      onGuardar(parseFloat(monto), detalle);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setMonto("");
    setDetalle("");
    setErrors({});
    if (onCancelar) {
      onCancelar();
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {titulo} - {empleadoNombre}
        </h2>

        <div className="space-y-4">
          <InputField
            label="Monto"
            type="number"
            placeholder="0"
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value);
              if (errors.monto) {
                setErrors({ ...errors, monto: "" });
              }
            }}
            error={errors.monto}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalle del ajuste
            </label>
            <textarea
              placeholder="Detalle del ajuste"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleGuardar}
            variant={tipoAjuste === "favor" ? "success" : "danger"}
          >
            Guardar Ajuste
          </Button>
          <Button onClick={handleCancel} variant="secondary">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
