"use client";
import { useProductsContext, ProductView } from "../../context/ProductsContext";
import { CategoryCard } from "./CategoryCard";

interface ProductListProps {
  onEditProduct?: (product: ProductView, categoryId: number) => void;
  onDeleteProduct?: (product: ProductView, categoryId: number) => void;
  onEditCategory?: (category: { id: number; name: string }) => void;
}

export default function ProductList({
  onEditProduct,
  onDeleteProduct,
  onEditCategory,
}: ProductListProps) {
  const { categories, loading, error } = useProductsContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">
          Error al cargar productos: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onEditCategory={onEditCategory}
        />
      ))}
    </div>
  );
}
