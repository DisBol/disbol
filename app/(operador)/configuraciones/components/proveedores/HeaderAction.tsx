import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";

export function ProviderHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">Proveedores</h2>

      <div className="flex gap-2">
        <Button
          variant="danger"
          size="sm"
          leftIcon={<RoundPlusIcon className="h-4 w-4" />}
        >
          Nuevo Proveedor
        </Button>

      </div>
    </div>
  );
}
