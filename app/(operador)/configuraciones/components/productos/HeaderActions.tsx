import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";

export function ProductsHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-lg font-bold">Productos</h2>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
