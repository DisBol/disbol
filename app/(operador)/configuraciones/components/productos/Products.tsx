import { Card } from "@/components/ui/Card";
import { ProductsHeader } from "./HeaderActions";
import ProductList from "./ProductList";

export default function Products() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <ProductsHeader />
        <ProductList />
      </div>
    </Card>
  );
}
