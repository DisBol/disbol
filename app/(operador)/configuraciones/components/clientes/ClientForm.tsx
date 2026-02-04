import React, { useState, useMemo } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { SelectInput, SelectOption } from "@/components/ui/SelectInput";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useClientGroups } from "../../hooks/clientes/useClientsGroups";
import { useAddClient } from "../../hooks/clientes/useAddClient";
import { useUpdateClient } from "../../hooks/clientes/useUpdateClient";
import { ClientFormData } from "../../interfaces/clientes/addclient.interface";
import { Datum as ClientData } from "../../interfaces/clientes/getclient.interface";
import MapSelector from "./MapSelector";

interface ClientFormModalProps {
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
  client?: ClientData;
}

const ClientForm: React.FC<ClientFormModalProps> = ({
  onSave,
  onCancel,
  client,
  isOpen,
}) => {
  const { clientGroups, isLoading: groupsLoading } = useClientGroups();
  const { addClient, loading: adding, error: addError } = useAddClient();
  const {
    updateClient,
    loading: updating,
    error: updateError,
  } = useUpdateClient();

  const isEditing = !!client;
  const saving = adding || updating;
  const saveError = addError || updateError;

  // Derive initial form data from client prop
  const initialFormData = useMemo(() => {
    if (client && isOpen) {
      return {
        name: client.name || "",
        document: client.document || "",
        phone: client.phone || "",
        clientGroupId: client.ClientGroup_id?.toString() || "",
        lat: client.lat || -16.5,
        lng: client.long || -68.15,
      };
    }
    return {
      name: "",
      document: "",
      phone: "",
      clientGroupId: "",
      lat: -16.5,
      lng: -68.15,
    };
  }, [client, isOpen]);

  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form and errors when opening modal for new client
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Update form data when initial data changes
  React.useEffect(() => {
    setFormData(initialFormData);
    setErrors({});
  }, [initialFormData]);

  // Enhanced onCancel to reset form
  const handleCancel = () => {
    if (!isEditing) {
      resetForm();
    }
    onCancel();
  };

  // Validaciones básicas
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.document.trim()) {
      newErrors.document = "El documento es requerido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    if (!formData.clientGroupId) {
      newErrors.clientGroupId = "Debe seleccionar un grupo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador: Guardar formulario
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && client) {
        // Actualizar cliente existente
        await updateClient(
          client.id,
          formData.name,
          formData.document,
          formData.lat,
          formData.lng,
          formData.phone,
          client.active || "true", // Mantener el estado actual de activo
          formData.clientGroupId,
        );
      } else {
        // Crear nuevo cliente
        await addClient(
          formData.name,
          formData.document,
          formData.lat,
          formData.lng,
          formData.phone,
          formData.clientGroupId,
        );
      }

      // Notificar éxito al componente padre
      onSave();

      // Reset form solo si no estamos editando
      if (!isEditing) {
        resetForm();
      }
    } catch (err) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "guardar"} cliente:`,
        err,
      );
      // El error ya está manejado en los hooks
    }
  };

  // Manejadores para los cambios en los campos
  const handleInputChange =
    (field: keyof ClientFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Limpiar error cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleSelectChange =
    (field: keyof ClientFormData) => (value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Limpiar error cuando el usuario cambie la selección
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  // Manejador para cambios de ubicación en el mapa
  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat, lng }));
  };

  // Opciones para el select de grupos
  const groupOptions: SelectOption[] = clientGroups.map((group) => ({
    value: group.value,
    label: group.label,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <InputField
            label="Nombre del Cliente"
            value={formData.name}
            onChange={handleInputChange("name")}
            placeholder="Ingrese el nombre del cliente"
            error={errors.name}
          />
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer pl-0.5">
              Grupo / Ruta *
            </label>
            <SelectInput
              options={groupOptions}
              value={formData.clientGroupId}
              onChange={(e) =>
                handleSelectChange("clientGroupId")(e.target.value)
              }
              placeholder="Seleccionar Grupo..."
              variant={errors.clientGroupId ? "error" : "default"}
              disabled={groupsLoading}
            />
            {errors.clientGroupId && (
              <p className="text-sm text-red-600">{errors.clientGroupId}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <InputField
            label="Documento"
            value={formData.document}
            onChange={handleInputChange("document")}
            placeholder="Ej: 100000"
            error={errors.document}
          />

          <InputField
            label="Teléfono"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            placeholder="Ej: 70404040"
            error={errors.phone}
          />
        </div>

        {/* Sección del mapa */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ubicación</label>
          <MapSelector
            lat={formData.lat}
            lng={formData.lng}
            onLocationChange={handleLocationChange}
            height={256}
          />
        </div>

        {/* Error de guardado */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              Error al guardar: {saveError.message}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<SaveIcon className="h-4 w-4" />}
            onClick={handleSave}
            disabled={saving || !formData.name.trim()}
            loading={saving}
          >
            {saving
              ? `${isEditing ? "Actualizando" : "Guardando"}...`
              : isEditing
                ? "Actualizar Cliente"
                : "Guardar Cliente"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClientForm;
