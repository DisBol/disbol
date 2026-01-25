"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { useState } from "react";
import { useAddCategory } from "../../hooks/productos/useAddCategory";

interface CategoryFormData {
  categoryName: string;
}

interface CategoryFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function CategoryForm({
  onCancel,
  onSuccess,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
  });
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const { addCategory, isLoading, error } = useAddCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    const newErrors: Partial<CategoryFormData> = {};
    if (!formData.categoryName.trim())
      newErrors.categoryName = "Ingresa el nombre de la categoría";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await addCategory(formData.categoryName.trim());

      if (result) {
        // Resetear formulario después de envío exitoso
        setFormData({ categoryName: "" });
        setErrors({});
        onSuccess?.();
      }
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
          error={errors.categoryName || error || undefined}
        />

        <div className="flex gap-3 pt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:w-36"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:w-36"
          >
            {isLoading ? "Creando..." : "Crear Categoría"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
