"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { CategoryFormData } from "../../interfaces/productos/addcategory.interface";
import { useState } from "react";

interface CategoryFormProps {
  onCancel?: () => void;
  onSubmit?: (data: CategoryFormData) => void;
}

export default function CategoryForm({
  onCancel,
  onSubmit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
  });
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    const newErrors: Partial<CategoryFormData> = {};
    if (!formData.categoryName.trim())
      newErrors.categoryName = "Ingresa el nombre de la categoría";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);

      // Resetear formulario después de envío exitoso
      setFormData({ categoryName: "" });
      setErrors({});
    }
  };

  const handleCancel = () => {
    // Resetear al estado inicial
    setFormData({ categoryName: "" });
    setErrors({});
    onCancel?.();
  };

  return (
    <Card className="p-6 w-full">
      <h2 className="text-md font-bold text-gray-900 mb-4">Nueva Categoría</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Nombre de la Categoría *"
          id="categoryName"
          type="text"
          placeholder="Ingrese el nombre de la categoría"
          value={formData.categoryName}
          onChange={(e) =>
            setFormData({ ...formData, categoryName: e.target.value })
          }
          error={errors.categoryName}
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
          >
            Crear Categoría
          </Button>
        </div>
      </form>
    </Card>
  );
}
