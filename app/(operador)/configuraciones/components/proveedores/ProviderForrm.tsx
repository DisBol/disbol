import React, { useState } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { Chip } from "@/components/ui/Chip";
import { InputField } from "@/components/ui/InputField";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { useCategory } from "../../hooks/proveedores/useCategory";
import { useAddProvider } from "../../hooks/proveedores/useAddProvider";
import { useAddCategoryProvider } from "../../hooks/proveedores/useAddCategoryprovider";
import { ProviderView } from "../../hooks/proveedores/useCategoryprovider";
import { useUpdateProvider } from "../../hooks/proveedores/useUpdateProvider";
import { useEffect } from "react";
import { useUpdateCategory } from "../../hooks/proveedores/useUpdateCategoryprovider";
import { useProviderStore } from "../../store/providers.store";

interface AssignedGroup {
  id: string;
  categoryId: number;
  name: string;
  category: string;
  CategoryProvider_id?: number;
}

interface FormProviderProps {
  onSave: (data: { name: string; assignedGroups: AssignedGroup[] }) => void;
  onCancel: () => void;
  initialData?: ProviderView | null;
}

const ProviderForm: React.FC<FormProviderProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const { categories, rawData, loading, error } = useCategory();
  const { addProvider, loading: saving, error: saveError } = useAddProvider();
  const {
    addCategoryToProvider,
    loading: savingCategories,
    error: categoryError,
  } = useAddCategoryProvider();

  const {
    updateProvider,
    loading: updating,
    error: updateError,
  } = useUpdateProvider();
  const {
    updateCategory,
    loading: updatingCategory,
    error: updateCategoryError,
  } = useUpdateCategory();

  const [name, setName] = useState("");
  const [assignedGroups, setAssignedGroups] = useState<AssignedGroup[]>([]);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [groupError, setGroupError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialData.nombre);
      const groups = initialData.grupos.map((g) => ({
        id: crypto.randomUUID(),
        categoryId: g.id,
        name: g.name,
        category: g.name,
        CategoryProvider_id: g.CategoryProvider_id,
      }));
      setAssignedGroups(groups);
    } else {
      setName("");
      setAssignedGroups([]);
    }
  }, [initialData]);

  const handleSelectGroup = (option: SelectOption) => {
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
    let hasError = false;
    if (!name.trim()) {
      setNameError("El nombre es obligatorio");
      hasError = true;
    } else {
      setNameError(undefined);
    }
    if (assignedGroups.length === 0) {
      setGroupError("Debe seleccionar al menos un grupo");
      hasError = true;
    } else {
      setGroupError(undefined);
    }
    if (hasError) return;

    try {
      let providerId: number | undefined;

      if (initialData) {
        providerId = initialData.id;
        const currentActive =
          initialData.estado === "Activo" ? "true" : "false";
        await updateProvider(providerId, name, currentActive);
        // Grupos actuales en el formulario
        const currentGroupIds = new Set(
          assignedGroups.map((g) => g.categoryId),
        );
        // Grupos originales (de la BD)
        const initialGroupIds = new Set(initialData.grupos.map((g) => g.id));
        const promises = [];
        // A) Agregar solo las NUEVAS
        const groupsToAdd = assignedGroups.filter(
          (g) => !initialGroupIds.has(g.categoryId),
        );
        for (const group of groupsToAdd) {
          promises.push(addCategoryToProvider(providerId, group.categoryId));
        }
        // B) Desactivar las REMOVIDAS
        const groupsToRemove = initialData.grupos.filter(
          (g) => !currentGroupIds.has(g.id),
        );
        for (const group of groupsToRemove) {
          // pasando 'false' como estado.
          if (group.CategoryProvider_id != null) {
            promises.push(updateCategory(group.CategoryProvider_id, "false"));
          }
        }
        // Ejecutar todas las promesas en paralelo
        await Promise.all(promises);
      } else {
        // Paso 1: Crear el proveedor
        const providerResponse = await addProvider(name);
        providerId = providerResponse?.data?.[0]?.provider_id;
        if (!providerId) {
          console.error(
            "No se pudo obtener el ID del proveedor creado",
            providerResponse,
          );
          return;
        }
        // Paso 2: Guardar las relaciones proveedor-categoría
        if (assignedGroups.length > 0) {
          const promises = assignedGroups.map((group) =>
            addCategoryToProvider(providerId!, group.categoryId),
          );
          await Promise.all(promises);
        }
      }
      // 3. FINALMENTE: Actualizar la tienda UNA SOLA VEZ
      await useProviderStore.getState().fetchProviders();
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
            error={nameError}
          />

          <div className="flex flex-col gap-2">
            <Select
              label="Agregar Grupo de Productos"
              options={categories}
              selectedValues={assignedGroups.map((g) => g.name)}
              onSelect={handleSelectGroup}
              placeholder={
                loading ? "Cargando grupos..." : "Seleccionar grupo..."
              }
              radius="md"
              size="lg"
              className="h-12 px-4 text-base" // igualando al input
              variant={groupError ? "error" : undefined}
            />
            {(groupError || error) && (
              <span className="text-xs text-danger mt-0.5">
                {groupError || "Error al cargar grupos"}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Grupos Asignados ({assignedGroups.length})
          </label>

          <div className="flex flex-wrap gap-2 min-h-8 p-2 border border-dashed border-gray-300 rounded-md bg-white">
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
            disabled={
              loading ||
              saving ||
              savingCategories ||
              updating ||
              updatingCategory
            }
          >
            {saving || savingCategories || updating || updatingCategory
              ? "Guardando..."
              : "Guardar Proveedor"}
          </Button>
        </div>
        {(saveError || categoryError) && (
          <p className="text-red-500 text-sm mt-2">
            {saveError || categoryError || updateError || updateCategoryError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProviderForm;
