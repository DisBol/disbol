"use client";

import React, { useState } from "react";
import CardCode from "@/components/ui/CardCode";
import { CloseRoundedIcon } from "@/components/icons/CloseRoundedIcon";
import { ProductQuantity } from "../stores/assignments-store";

interface EditableProductCardProps {
  product: ProductQuantity;
  isEditing: boolean;
  onLocalChange: (
    productCode: string,
    updates: Partial<ProductQuantity>,
  ) => void;
  onDelete: (productCode: string) => void;
  isUpdating?: boolean;
}

const EditableProductCard: React.FC<EditableProductCardProps> = ({
  product,
  isEditing,
  onLocalChange,
  onDelete,
  isUpdating = false,
}) => {
  // Estado local para valores editables
  const [localValues, setLocalValues] = useState({
    cajas: product.cajas.toString(),
    unidades: product.unidades.toString(),
  });

  // Resetear valores cuando cambie el producto o salga del modo edición
  React.useEffect(() => {
    setLocalValues({
      cajas: product.cajas.toString(),
      unidades: product.unidades.toString(),
    });
  }, [product.cajas, product.unidades, isEditing]);

  // Handler genérico para cambios en campos
  const handleFieldChange = (field: "cajas" | "unidades", value: string) => {
    const numericValue = parseInt(value) || 0;
    setLocalValues((prev) => ({ ...prev, [field]: value }));

    // Si el producto está inactivo y se está editando, activarlo
    const updates: Partial<ProductQuantity> = { [field]: numericValue };
    if (!product.active && numericValue > 0) {
      updates.active = true;
    }

    onLocalChange(product.codigo, updates);
  };

  const handleRemove = () => {
    if (isUpdating) return;
    if (
      window.confirm(`¿Está seguro de eliminar el producto ${product.codigo}?`)
    ) {
      onDelete(product.codigo);
    }
  };

  return (
    <div className={`relative group ${!product.active ? "opacity-60" : ""}`}>
      <div className={!product.active ? "bg-gray-200 rounded-lg p-1" : ""}>
        <CardCode
          label={`Código ${product.codigo}`}
          cajas={localValues.cajas}
          unidades={localValues.unidades}
          onCajasChange={
            isEditing ? (value) => handleFieldChange("cajas", value) : undefined
          }
          onUnidadesChange={
            isEditing
              ? (value) => handleFieldChange("unidades", value)
              : undefined
          }
          readOnly={!isEditing}
          variant={isUpdating ? "active" : "default"}
          weightInfo={{
            adicional: [
              {
                label: "",
                value: `${product.kgBruto.toFixed(2)} kg Bruto`,
                color: "default",
              },
              {
                label: "",
                value: `${product.kgNeto.toFixed(2)} kg Neto`,
                color: "default",
              },
            ],
          }}
        />
      </div>

      {/* Botón de eliminar - solo visible en modo edición */}
      {isEditing && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
          disabled={isUpdating}
          title="Eliminar producto"
        >
          <CloseRoundedIcon className="w-3 h-3" />
        </button>
      )}

      {/* Indicador de carga */}
      {isUpdating && (
        <div className="absolute inset-0 bg-blue-50/50 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default EditableProductCard;
