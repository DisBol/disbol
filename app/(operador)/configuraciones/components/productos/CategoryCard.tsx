import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Category } from "../../types/ProductTypes";
import { ProductGrid } from "./ProductGrid";

interface Props {
  category: Category;
}

export function CategoryCard({ category }: Props) {
  return (
 
      <Card>
        <CardHeader>
          <h3 className="text-red-600 font-bold text-sm uppercase">
            {category.name}
          </h3>
        </CardHeader>

        <CardContent>
          <ProductGrid products={category.products} />
        </CardContent>
      </Card>
  
  );
}
