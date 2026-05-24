"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/SelectInput";
import { Card, CardContent } from "@/components/ui/Card";

interface SelectorPeriodoProps {
  onValidar?: (periodo: string) => Promise<void>;
}

export default function SelectorPeriodo({ onValidar }: SelectorPeriodoProps) {
  const [periodo, setPeriodo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Generar periodos disponibles (últimos 24 meses)
  const generatePeriodos = useCallback(() => {
    const periodos = [];
    const today = new Date();

    for (let i = 0; i < 24; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      periodos.push({ value: `${year}-${month}`, label: `${year}-${month}` });
    }

    return periodos;
  }, []);

  const periodos = generatePeriodos();

  useEffect(() => {
    if (!periodo && periodos.length > 0) {
      setPeriodo(periodos[0].value);
    }
  }, [periodos, periodo]);

  const handleValidar = useCallback(async () => {
    if (!periodo) {
      setError("Selecciona un período");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Simular validación con datos estáticos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Respuesta exitosa simulada
      if (onValidar) {
        await onValidar(periodo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al validar período");
    } finally {
      setLoading(false);
    }
  }, [periodo, onValidar]);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <SelectInput
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              options={periodos}
              placeholder="Seleccionar período"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleValidar}
            disabled={loading || !periodo}
            variant="warning"
            loading={loading}
          >
            Iniciar validaciones
          </Button>
        </div>

        {error && (
          <div className="text-danger text-sm mt-3 p-3 bg-red-50 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
