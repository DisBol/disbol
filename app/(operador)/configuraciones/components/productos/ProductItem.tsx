import { ProductView } from "../../hooks/productos/useProductsByCategory";
import { EditIcon } from "@/components/icons/EditIcon";

interface Props {
  product: ProductView;
  categoryId: number;
  onEdit?: (product: ProductView, categoryId: number) => void;
}

export function ProductItem({ product, categoryId, onEdit }: Props) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product, categoryId);
  };

  return (
    <div className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium bg-slate-50 hover:bg-slate-100 cursor-pointer group relative">
      <span>{product.name}</span>
      <button
        onClick={handleEdit}
        className="absolute right-1 p-1 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
        aria-label={`Editar ${product.name}`}
        title={`Editar ${product.name}`}
      >
        <EditIcon className="w-3 h-3" />
      </button>
    </div>
  );
}
