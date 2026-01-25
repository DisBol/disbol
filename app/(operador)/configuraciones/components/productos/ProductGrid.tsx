// product-grid.tsx
import { ProductView } from "../../hooks/productos/useProductsByCategory";
import { ProductItem } from "./ProductItem";

interface Props {
  products: ProductView[];
  categoryId: number;
  onEditProduct?: (product: ProductView, categoryId: number) => void;
}

export function ProductGrid({ products, categoryId, onEditProduct }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          categoryId={categoryId}
          onEdit={onEditProduct}
        />
      ))}
    </div>
  );
}
