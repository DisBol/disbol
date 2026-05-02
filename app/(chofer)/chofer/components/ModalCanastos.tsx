"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ContainerOption {
  value: string;
  label: string;
}

interface ModalCanastosProps {
  isOpen: boolean;
  onClose: () => void;
  containers: ContainerOption[];
  quantities: Record<string, number>;
  setQuantities: (q: Record<string, number>) => void;
  onConfirm: () => void;
  saving?: boolean;
}

export default function ModalCanastos({
  isOpen,
  onClose,
  containers,
  quantities,
  setQuantities,
  onConfirm,
  saving = false,
}: ModalCanastosProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Devolver Canastos"
      size="lg"
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-500">
          Ingresa la cantidad para cada tipo de canasto. Solo se enviarán los
          valores mayores a 0.
        </p>

        <div className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto pr-1">
          {containers.map((container) => {
            const quantity = quantities[container.value] || 0;
            const isActive = quantity > 0;

            return (
              <div
                key={container.value}
                className={`flex items-center gap-4 rounded-xl border p-3 transition-all duration-150 ${
                  isActive
                    ? "border-green-300 bg-green-50 shadow-sm"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-gray-800">
                  {container.label}
                </p>

                <div className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantities({
                        ...quantities,
                        [container.value]: Math.max(0, quantity - 1),
                      })
                    }
                    disabled={quantity === 0 || saving}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [container.value]: Math.max(0, Number(e.target.value)),
                      })
                    }
                    disabled={saving}
                    className={`w-10 bg-transparent text-center text-sm font-semibold outline-none transition-colors ${
                      isActive ? "text-green-700" : "text-gray-700"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setQuantities({
                        ...quantities,
                        [container.value]: quantity + 1,
                      })
                    }
                    disabled={saving}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {Object.values(quantities).some((v) => v > 0) && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
            {Object.values(quantities).reduce((a, b) => a + b, 0)} canasto(s) en
            total para devolver
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size="md"
            radius="lg"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            size="md"
            radius="lg"
            disabled={saving}
            onClick={onConfirm}
          >
            {saving ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
