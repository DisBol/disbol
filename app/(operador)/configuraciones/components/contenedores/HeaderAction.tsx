"use client";
import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";

interface ProviderHeaderProps {
  onOpenForm?: () => void;
}

export function ProviderHeader({ onOpenForm }: ProviderHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Contenedores</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RoundPlusIcon className="h-4 w-4" />}
            onClick={onOpenForm}
          >
            Nuevo Contenedor
          </Button>
        </div>
      </div>
    </div>
  );
}
