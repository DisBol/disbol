import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";

export function ProductsHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">Productos</h2>

      <div className="flex gap-2">
        <Button
          variant="danger"
          size="sm"
          leftIcon={<RoundPlusIcon className="h-4 w-4" />}
        >
          Nuevo Producto
        </Button>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RoundPlusIcon className="h-4 w-4" />}
        >
          Nueva Categoría
        </Button>
      </div>
    </div>
  );
}
