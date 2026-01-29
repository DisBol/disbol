import React, { useState, useEffect } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { GroupFormProps } from "../../interfaces/clientes/getclientgroup.interface";

const GroupForm: React.FC<GroupFormProps> = ({ onSave, onCancel, group }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Si estamos editando un grupo, cargamos los datos
  useEffect(() => {
    if (group) {
      setFormData({
        nombre: group.nombre,
        descripcion: group.descripcion,
      });
    }
  }, [group]);

  // Validaciones básicas
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador: Guardar formulario
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      await onSave(formData);
    } catch (err) {
      console.error("Error al guardar grupo:", err);
    } finally {
      setSaving(false);
    }
  };

  // Manejadores para los cambios en los campos
  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Nombre del Grupo"
            value={formData.nombre}
            // onChange={handleChange("nombre")}
            placeholder="Ej: Grupo A"
            error={errors.nombre}
          />

          <InputField
            label="Descripción"
            value={formData.descripcion}
            // onChange={handleChange("descripcion")}
            placeholder="Ej: Clientes principales del norte"
            error={errors.descripcion}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<SaveIcon className="h-4 w-4" />}
            onClick={handleSave}
            disabled={loading || !formData.nombre.trim()}
            loading={loading}
          >
            {loading
              ? "Guardando..."
              : group
                ? "Actualizar Grupo"
                : "Guardar Grupo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
