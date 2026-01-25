import React, { useState } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { Chip } from "@/components/ui/Chip";
import { InputField } from "@/components/ui/InputField";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { useCategory } from "../../hooks/proveedores/useCategory";
import { useAddProvider } from "../../hooks/proveedores/useAddProvider";
import { useAddCategoryProvider } from "../../hooks/proveedores/useAddCategoryprovider";

interface AssignedGroup {
  id: string;
  categoryId: number;
  name: string;
  category: string;
}

interface FormProviderProps {
  onSave: (data: { name: string; assignedGroups: AssignedGroup[] }) => void;
  onCancel: () => void;
}

const ProviderForm: React.FC<FormProviderProps> = ({ onSave, onCancel }) => {
  // 1. Usamos el Hook para obtener los datos de la API
  const { categories, rawData, loading, error } = useCategory();
  const { addProvider, loading: saving, error: saveError } = useAddProvider();
  const {
    addCategoryToProvider,
    loading: savingCategories,
    error: categoryError,
  } = useAddCategoryProvider();

  const [name, setName] = useState("");
  const [assignedGroups, setAssignedGroups] = useState<AssignedGroup[]>([]);

  // Función para guardar las relaciones proveedor-categoría
  const saveProviderCategories = async (providerId: number) => {
    for (const group of assignedGroups) {
      await addCategoryToProvider(providerId, group.categoryId);
    }
  };

  // Manejador: Agregar grupo desde el Select
  const handleSelectGroup = (option: SelectOption) => {
    // Evitar duplicados visuales si ya está seleccionado
    if (assignedGroups.some((g) => g.name === option.value)) return;
    const originalItem = rawData?.find((item) => item.name === option.value);

    if (!originalItem) return;

    const newGroup: AssignedGroup = {
      id: crypto.randomUUID(),
      categoryId: originalItem.id,
      name: originalItem.name,
      category: originalItem.name,
    };

    setAssignedGroups((prev) => [...prev, newGroup]);
  };

  // Manejador: Eliminar grupo desde el Chip
  const removeGroup = (id: string) => {
    setAssignedGroups((prev) => prev.filter((group) => group.id !== id));
  };

  // Manejador: Guardar formulario
  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      // Paso 1: Crear el proveedor
      const providerResponse = await addProvider(name);
      const providerId = providerResponse?.data?.[0]?.provider_id;

      if (!providerId) {
        console.error(
          "No se pudo obtener el ID del proveedor creado",
          providerResponse,
        );
        return;
      }

      // Paso 2: Guardar las relaciones proveedor-categoría
      if (assignedGroups.length > 0) {
        await saveProviderCategories(providerId);
      }

      onSave({ name, assignedGroups });
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Nombre del Proveedor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese el nombre"
          />

          <div className="relative">
            <Select
              label="Agregar Grupo de Productos"
              options={categories}
              selectedValues={assignedGroups.map((g) => g.name)}
              onSelect={handleSelectGroup}
              placeholder={
                loading ? "Cargando grupos..." : "Seleccionar grupo..."
              }
              radius="md"
            />
            {error && (
              <span className="text-xs text-red-500 absolute -bottom-5 left-0">
                Error al cargar grupos
              </span>
            )}
          </div>
        </div>

        {/* --- Sección de Chips (Grupos Asignados) --- */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Grupos Asignados ({assignedGroups.length})
          </label>

          <div className="flex flex-wrap gap-2 min-h-[32px] p-2 border border-dashed border-gray-300 rounded-md bg-white">
            {assignedGroups.length === 0 ? (
              <p className="text-sm text-gray-400 italic w-full text-center py-2">
                {loading ? "Esperando datos..." : "No hay grupos asignados"}
              </p>
            ) : (
              assignedGroups.map((group) => (
                <Chip
                  key={group.id}
                  variant="flat"
                  color="danger"
                  size="md"
                  radius="sm"
                  onClose={() => removeGroup(group.id)}
                >
                  {group.name}
                </Chip>
              ))
            )}
          </div>
        </div>

        {/* --- Sección de Botones --- */}
        <div className="flex gap-3 justify-end border-t border-gray-200 pt-4">
          <Button onClick={onCancel} variant="outline">
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            variant="danger"
            leftIcon={<SaveIcon className="w-4 h-4" />}
            disabled={loading || saving || savingCategories}
          >
            {saving || savingCategories ? "Guardando..." : "Guardar Proveedor"}
          </Button>
        </div>
        {(saveError || categoryError) && (
          <p className="text-red-500 text-sm mt-2">
            {saveError || categoryError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProviderForm;
