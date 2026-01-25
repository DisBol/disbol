"use client";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ProductsHeader } from "./HeaderActions";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { useAddProduct } from "../../hooks/productos/useAddProduct";
import { useUpdateProduct } from "../../hooks/productos/useUpdateProduct";
import {
  ProductsProvider,
  useProductsContext,
  ProductView,
} from "../../context/ProductsContext";
import {
  ProductFormData,
  ProductEditFormData,
} from "../../interfaces/productos/productform.interface";

function ProductsContent() {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{
    product: ProductView;
    categoryId: number;
  } | null>(null);
  const { addProduct } = useAddProduct();
  const { updateProduct } = useUpdateProduct();
  const { refetch } = useProductsContext();

  // Ref para hacer scroll al formulario
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll al formulario cuando se abra edición
  useEffect(() => {
    if (editingProduct && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [editingProduct]);

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
    setEditingProduct(null);
  };

  const handleEditProduct = (product: ProductView, categoryId: number) => {
    setEditingProduct({ product, categoryId });
    setShowNewProductForm(false);
    setShowNewCategoryForm(false);
  };

  const handleProductSubmit = async (
    data: ProductFormData | ProductEditFormData,
  ) => {
    const isEditing = "id" in data;

    if (isEditing) {
      // Actualizar producto existente
      const productData = {
        id: data.id,
        name: data.productName,
        active: "true",
        Category_id: data.categoryId,
      };

      const success = await updateProduct(productData);
      if (success) {
        handleCloseForm();
        await refetch();
      }
    } else {
      // Crear nuevo producto
      const productData = {
        name: data.productName,
        active: "true",
        Category_id: data.categoryId,
      };

      const success = await addProduct(productData);
      if (success) {
        handleCloseForm();
        await refetch();
      }
    }
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
            <ProductForm
              onCancel={handleCloseForm}
              onSubmit={handleProductSubmit}
            />
          </div>
        )}

        {editingProduct && (
          <div ref={formRef} className="flex justify-center">
            <ProductForm
              product={editingProduct.product}
              categoryId={editingProduct.categoryId}
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

        <ProductList onEditProduct={handleEditProduct} />
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
