import {
  Card,
  CardHeader,
  CardContent,
} from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/Button";
import {
  CategoryView,
  ProductView,
} from "../../hooks/productos/useProductsByCategory";
import { ProductGrid } from "./ProductGrid";
import { EditIcon } from "../../../../../components/icons/EditIcon2";

interface Props {
  category: CategoryView;
  onEditProduct?: (product: ProductView, categoryId: number) => void;
  onDeleteProduct?: (product: ProductView, categoryId: number) => void;
  onEditCategory?: (category: { id: number; name: string }) => void;
}

export function CategoryCard({
  category,
  onEditProduct,
  onDeleteProduct,
  onEditCategory,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-red-600 font-bold text-sm uppercase">
            {category.name}
          </h3>
          {onEditCategory && (
            <Button
              variant="ghost"
              onClick={() =>
                onEditCategory({ id: category.id, name: category.name })
              }
              className="h-8 w-10 p-0 hover:bg-gray-100"
            >
              <EditIcon
                size={16}
                className="text-gray-500 hover:text-gray-700"
              />
            </Button>
          )}
        </div>
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
