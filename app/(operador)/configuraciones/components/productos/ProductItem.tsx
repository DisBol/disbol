import { Product } from "../../types/ProductTypes";

// product-item.tsx
interface Props {
  product: Product;
}

export function ProductItem({ product }: Props) {
  return (
    <div
      className="
      rounded-lg border border-slate-200
      px-4 py-2 text-sm font-medium
      bg-slate-50 hover:bg-slate-100
      cursor-pointer
    "
    >
      {product.name}
    </div>
  );
}
