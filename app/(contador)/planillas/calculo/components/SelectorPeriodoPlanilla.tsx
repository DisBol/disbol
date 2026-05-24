"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputField } from "@/components/ui/InputField";

interface SelectorPeriodoPlanillaProps {
  onCalcular?: (periodo: string) => Promise<void>;
  loading?: boolean;
}

export default function SelectorPeriodoPlanilla({
  onCalcular,
  loading = false,
}: SelectorPeriodoPlanillaProps) {
  const [periodo, setPeriodo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Establecer fecha actual por defecto
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    setPeriodo(`${año}-${mes}-${dia}`);
  }, []);

  const handleCalcular = async () => {
    if (!periodo) {
      setError("Selecciona un período");
      return;
    }

    try {
      setError("");
      if (onCalcular) {
        await onCalcular(periodo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <InputField
              label="Período"
              type="month"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleCalcular}
            disabled={loading || !periodo}
            variant="danger"
            loading={loading}
          >
            Calcular
          </Button>
        </div>

        {error && <div className="text-danger text-sm mt-3">{error}</div>}
      </CardContent>
    </Card>
  );
}
