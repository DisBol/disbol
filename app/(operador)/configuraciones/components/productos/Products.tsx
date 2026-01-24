"use client";
import { CategoryCard } from "./CategoryCard";
import { ProductsHeader } from "./HeaderActions";
import { useProductsByCategory } from "../../hooks/useProductsByCategory";

export default function Products() {
  const { categories, loading, error } = useProductsByCategory();

  if (loading) {
    return (
      <div className="space-y-6">
        <ProductsHeader />
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">Cargando productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ProductsHeader />
        <div className="flex justify-center items-center p-8">
          <div className="text-red-500">
            Error al cargar productos: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader />

      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
