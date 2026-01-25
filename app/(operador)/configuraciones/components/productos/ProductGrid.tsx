// product-grid.tsx
import { ProductView } from "../../hooks/useProductsByCategory";
import { ProductItem } from "./ProductItem";

interface Props {
  products: ProductView[];
}

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
