"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProductsHeader } from "./HeaderActions";
import ProductList from "./ProductList";
import FormProduct from "./FormProduct";
import { useAddProduct } from "../../hooks/useAddProduct";
import {
  ProductsProvider,
  useProductsContext,
} from "../../context/ProductsContext";
import { ProductFormData } from "../../interfaces/productform.interface";

function ProductsContent() {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const { addProduct } = useAddProduct();
  const { refetch } = useProductsContext();

  const handleNewProduct = () => {
    setShowNewProductForm(true);
    setShowNewCategoryForm(false);
  };

  const handleNewCategory = () => {
    setShowNewCategoryForm(true);
    setShowNewProductForm(false);
  };

  const handleCloseForm = () => {
    setShowNewProductForm(false);
    setShowNewCategoryForm(false);
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    const productData = {
      name: data.productName,
      active: "true",
      Category_id: data.categoryId,
    };

    const success = await addProduct(productData);

    if (success) {
      // Cerrar el formulario y refrescar la lista
      handleCloseForm();
      await refetch();
    }
    // El error se maneja automáticamente en el hook useAddProduct
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <ProductsHeader
          onNewProduct={handleNewProduct}
          onNewCategory={handleNewCategory}
        />

        {showNewProductForm && (
          <div className="flex justify-center">
            <FormProduct
              onCancel={handleCloseForm}
              onSubmit={handleProductSubmit}
            />
          </div>
        )}

        {showNewCategoryForm && (
          <div className="flex justify-center">
            <Card className="p-6 max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Nueva Categoría
              </h2>
              <p className="text-gray-500">
                Formulario de nueva categoría (por implementar)
              </p>
            </Card>
          </div>
        )}

        <ProductList />
      </div>
    </Card>
  );
}

export default function Products() {
  return (
    <ProductsProvider>
      <ProductsContent />
    </ProductsProvider>
  );
}
