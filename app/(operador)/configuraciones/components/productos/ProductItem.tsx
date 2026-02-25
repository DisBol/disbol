import { EditIcon } from "../../../../../components/icons/EditIcon2";
import { ProductView } from "../../hooks/productos/useProductsByCategory";
import { DeleteIcon } from "../../../../../components/icons/DeleteIcon";

interface Props {
  product: ProductView;
  categoryId: number;
  onEdit?: (product: ProductView, categoryId: number) => void;
  onDelete?: (product: ProductView, categoryId: number) => void;
}

export function ProductItem({ product, categoryId, onEdit, onDelete }: Props) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product, categoryId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      onDelete?.(product, categoryId);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium bg-slate-50 hover:bg-slate-100 cursor-pointer group relative">
      <span>{product.name}</span>
      <div className="absolute top-1 pt-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-1 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
          aria-label={`Editar ${product.name}`}
          title={`Editar ${product.name}`}
        >
          <EditIcon className="w-3 h-3" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          aria-label={`Eliminar ${product.name}`}
          title={`Eliminar ${product.name}`}
        >
          <DeleteIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
