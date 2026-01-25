"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectInput";
import { useProductsContext } from "../../context/ProductsContext";
import {
  ProductFormData,
  ProductEditFormData,
} from "../../interfaces/productos/productform.interface";
import { ProductView } from "../../hooks/productos/useProductsByCategory";
import { useState } from "react";

interface ProductFormProps {
  // Para edición
  product?: ProductView;
  categoryId?: number;
  // Callbacks
  onCancel?: () => void;
  onSubmit?: (data: ProductFormData | ProductEditFormData) => void;
}

export default function ProductForm({
  product,
  categoryId,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const { categories, loading } = useProductsContext();
  const isEditing = !!product;

  // Estado inicial basado en si es edición o creación
  const [formData, setFormData] = useState({
    ...(isEditing && { id: product.id }),
    categoryId: categoryId?.toString() || "",
    productName: product?.name || "",
  });
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    const newErrors: Partial<ProductFormData> = {};
    if (!formData.categoryId) newErrors.categoryId = "Selecciona una categoría";
    if (!formData.productName.trim())
      newErrors.productName = "Ingresa el nombre del producto";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData as ProductFormData | ProductEditFormData);

      // Solo resetear en modo creación
      if (!isEditing) {
        setFormData({ categoryId: "", productName: "" });
        setErrors({});
      }
    }
  };

  const handleCancel = () => {
    // Resetear al estado inicial
    setFormData({
      ...(isEditing && { id: product!.id }),
      categoryId: categoryId?.toString() || "",
      productName: product?.name || "",
    });
    setErrors({});
    onCancel?.();
  };

  return (
    <Card className="p-6 w-full">
      <h2 className="text-md font-bold text-gray-900 mb-4">
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="Categoría *"
          id="category"
          options={categoryOptions}
          placeholder="Seleccionar Categoría..."
          value={formData.categoryId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
          }
          error={errors.categoryId}
          disabled={loading}
        />

        <InputField
          label="Nombre del Producto *"
          id="productName"
          type="text"
          placeholder="Ingrese el nombre del producto"
          value={formData.productName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, productName: e.target.value }))
          }
          error={errors.productName}
        />

        <div className="flex gap-3 pt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 sm:flex-none sm:w-36"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="danger"
            className="flex-1 sm:flex-none sm:w-36"
            disabled={loading}
          >
            {isEditing ? "Actualizar" : "Crear Producto"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
