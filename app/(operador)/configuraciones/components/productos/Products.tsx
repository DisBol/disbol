import { Category } from "../../types/ProductTypes";
import { CategoryCard } from "./CategoryCard";
import { ProductsHeader } from "./HeaderActions";

const categories: Category[] = [
  {
    id: "1",
    name: "POLLO SOFIA",
    products: [
      { id: "104", name: "104" },
      { id: "105", name: "105" },
      { id: "106", name: "106" },
      { id: "107", name: "107" },
      { id: "108", name: "108" },
      { id: "109", name: "109" },
      { id: "men", name: "menudencia" },
    ],
  },
  {
    id: "2",
    name: "POLLO AVC",
    products: [
      { id: "cinta", name: "cinta" },
      { id: "verde", name: "verde" },
      { id: "azul", name: "azul" },
      { id: "negro", name: "negro" },
      { id: "blanco", name: "blanco" },
    ],
  },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <ProductsHeader />

      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
