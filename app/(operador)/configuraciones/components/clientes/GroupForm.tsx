import React, { useState, useRef, useEffect } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectInput";
import { Button } from "@/components/ui/Button";
import {
  GroupFormProps,
  GroupFormData,
} from "../../interfaces/clientes/getclientgroup.interface";
import { useAddClientGroup } from "../../hooks/clientes/useAddClientGroup";
import { useUpdateClientGroup } from "../../hooks/clientes/useUpdateClientGroup";
import { useGeofences } from "../../hooks/monnet/useGeofences";

const GroupForm: React.FC<GroupFormProps> = ({ onSave, onCancel, group }) => {
  const formRef = useRef<HTMLDivElement>(null);

  const {
    addClientGroup,
    loading: addLoading,
    error: addError,
  } = useAddClientGroup();
  const {
    updateClientGroup,
    loading: updateLoading,
    error: updateError,
  } = useUpdateClientGroup();

  const {
    geofences,
    loading: geofencesLoading,
    error: geofencesError,
  } = useGeofences();

  // Estado combinado para loading y error
  const loading = addLoading || updateLoading;
  const error = addError || updateError;

  const [formData, setFormData] = useState<GroupFormData>(() => {
    if (group) {
      return {
        nombre: group.name,
        idCerca: group.idCerca.toString(),
      };
    }
    return {
      nombre: "",
      idCerca: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efecto para enfocar el formulario cuando se está editando un grupo
  useEffect(() => {
    if (group && formRef.current) {
      // Pequeño delay para asegurar que el DOM esté actualizado
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // También enfocar el primer input
        const firstInput = formRef.current?.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [group]);

  // Validaciones básicas
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.idCerca.trim()) {
      newErrors.idCerca = "Debe seleccionar una ruta";
    } else if (!/^\d+$/.test(formData.idCerca)) {
      newErrors.idCerca = "La ruta seleccionada debe ser válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador: Guardar formulario
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (group) {
        // Modo edición - usar el hook de actualización
        await updateClientGroup(
          group.id,
          formData.nombre,
          formData.idCerca,
          group.active, // Mantener el estado actual
        );
      } else {
        // Modo creación - usar el hook de creación
        await addClientGroup(formData.nombre, formData.idCerca);
      }

      // Notificar al padre que se guardó exitosamente
      await onSave(formData);
    } catch (err) {
      console.error("Error al guardar grupo:", err);
    }
  };

  // Manejadores para los cambios en los campos
  const handleChange =
    (field: keyof GroupFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Limpiar error cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  return (
    <div
      ref={formRef}
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Nombre del Grupo *"
            value={formData.nombre}
            onChange={handleChange("nombre")}
            placeholder="Ej: Grupo A"
            error={errors.nombre}
          />

          {geofencesLoading ? (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pl-0.5 mb-2 block">
                Ruta *
              </label>
              <div className="h-11 bg-gray-100 animate-pulse rounded-md flex items-center px-3">
                <span className="text-gray-500 text-sm">Cargando rutas...</span>
              </div>
            </div>
          ) : geofencesError ? (
            <div>
              <InputField
                label="Ruta *"
                value={formData.idCerca}
                onChange={handleChange("idCerca")}
                placeholder="Ingrese ID manualmente"
                error={errors.idCerca}
                type="number"
              />
              <p className="text-xs text-red-600 mt-1">
                Error cargando rutas: {geofencesError.message}
              </p>
            </div>
          ) : (
            <SelectField
              label="Ruta *"
              value={formData.idCerca}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({ ...prev, idCerca: value }));
                if (errors.idCerca) {
                  setErrors((prev) => ({ ...prev, idCerca: "" }));
                }
              }}
              options={[
                { value: "", label: "Seleccione una ruta" },
                ...geofences
                  .filter((geofence) => geofence.visible === 1) // Solo mostrar geofences visibles
                  .map((geofence) => ({
                    value: geofence.idCerca.toString(),
                    // label: `${geofence.nombre} (${geofence.tipo_cerca}) - ID: ${geofence.idCerca}`,
                    label: `${geofence.nombre}`,
                  })),
              ]}
              error={errors.idCerca}
            />
          )}
        </div>

        {/* Error de guardado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-600">
              Error al guardar: {error.message}
            </p>
          </div>
        )}

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
