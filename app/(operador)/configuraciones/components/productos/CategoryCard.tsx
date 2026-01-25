import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import {
  CategoryView,
  ProductView,
} from "../../hooks/productos/useProductsByCategory";
import { ProductGrid } from "./ProductGrid";

interface Props {
  category: CategoryView;
  onEditProduct?: (product: ProductView, categoryId: number) => void;
  onDeleteProduct?: (product: ProductView, categoryId: number) => void;
}

export function CategoryCard({
  category,
  onEditProduct,
  onDeleteProduct,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-red-600 font-bold text-sm uppercase">
          {category.name}
        </h3>
      </CardHeader>

      <CardContent>
        <ProductGrid
          products={category.products}
          categoryId={category.id}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      </CardContent>
    </Card>
  );
}
