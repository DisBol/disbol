"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectInput";
import { useProductsContext } from "../../context/ProductsContext";
import { ProductFormData } from "../../interfaces/productform.interface";
import { useState } from "react";

interface FormProductProps {
  onCancel?: () => void;
  onSubmit?: (data: ProductFormData) => void;
}

export default function FormProduct({ onCancel, onSubmit }: FormProductProps) {
  const { categories, loading } = useProductsContext();
  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: "",
    productName: "",
  });
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    const newErrors: Partial<ProductFormData> = {};
    if (!formData.categoryId) newErrors.categoryId = "Selecciona una categoría";
    if (!formData.productName.trim())
      newErrors.productName = "Ingresa el nombre del producto";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Llamar a la función onSubmit si se proporciona
      onSubmit?.(formData);

      // Resetear el formulario
      setFormData({ categoryId: "", productName: "" });
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({ categoryId: "", productName: "" });
    setErrors({});
    onCancel?.();
  };

  return (
    <Card className="p-6 w-full">
      <h2 className="text-md font-bold text-gray-900 mb-4">Nuevo Producto</h2>

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
            Crear Producto
          </Button>
        </div>
      </form>
    </Card>
  );
}
