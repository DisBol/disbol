"use client";
import { useState, useEffect } from "react";
import { InputField } from "@/components/ui/InputField";
import { Select } from "@/components/ui/SelecMultipe";
import { Button } from "@/components/ui/Button";
import { useAddCar } from "../../hooks/vehiculos/useAddCar";
import { useUpdateCar } from "../../hooks/vehiculos/useUpdateCar";
import { useVehicleGetAll } from "../../hooks/monnet/usevehicleGetAll";

interface FormProviderProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any | null;
}

export default function ProviderForm({
  onSave,
  onCancel,
  initialData,
}: FormProviderProps) {
  const { addCar, isLoading: isAdding, error: addError } = useAddCar();
  const {
    vehicles,
    isLoading: isLoadingVehicles,
    error: vehiclesError,
  } = useVehicleGetAll();

  const monnetOptions = vehicles.map((v) => ({
    label: v.nombre,
    value: v.patente,
  }));
  const {
    updateCar,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateCar();

  const [name, setName] = useState("");
  const [placa, setPlaca] = useState("");
  const [monet, setMonet] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    placa?: string;
    monet?: string;
    submit?: string;
  }>({});

  const isLoading = isAdding || isUpdating;
  const hookError = addError || updateError;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPlaca(initialData.license || "");
      setMonet(initialData.idCar || "");
    } else {
      setName("");
      setPlaca("");
      setMonet("");
    }
  }, [initialData]);

  const handleSave = async () => {
    const newErrors: { name?: string; placa?: string; monet?: string } = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!placa.trim()) newErrors.placa = "La placa es obligatoria";
    if (!monet) newErrors.monet = "Campo requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    let result;
    if (initialData) {
      result = await updateCar(
        initialData.id,
        name,
        monet, // idCar
        placa, // license
        initialData.active || "true",
      );
    } else {
      // Usamos 'monet' como 'idCar' basado en la estructura observada
      result = await addCar(name, monet, placa, "true");
    }

    if (result) {
      onSave(result);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top">
      <div className="max-w-full mx-auto space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {initialData ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h3>

          <div className="space-y-4">
            {/* Nombre del Vehículo */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                NOMBRE DEL VEHÍCULO *
              </label>
              <InputField
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese el nombre del vehículo"
                error={errors.name}
                className="w-full"
              />
            </div>

            {/* Placa */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                PLACA *
              </label>
              <InputField
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="Ingrese la placa del vehículo"
                error={errors.placa}
                className="w-full"
              />
            </div>

            {/* Monnet */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Monnet *
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  options={monnetOptions}
                  selectedValues={monet ? [monet] : []}
                  onSelect={(option) => setMonet(option.value)}
                  placeholder={
                    isLoadingVehicles
                      ? "Cargando vehículos GPS..."
                      : vehiclesError
                        ? "Error al cargar GPS"
                        : "Seleccionar vehículo GPS"
                  }
                  radius="md"
                  size="lg"
                  className="h-10 px-3 text-sm w-full"
                  variant={errors.monet ? "error" : undefined}
                  disabled={isLoadingVehicles}
                />
                {errors.monet && (
                  <span className="text-xs text-danger mt-0.5">
                    {errors.monet}
                  </span>
                )}
              </div>
            </div>

            {(hookError || errors.submit) && (
              <div className="text-red-500 text-sm">
                {hookError || errors.submit}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="px-6"
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            variant="danger"
            className="px-6 bg-pink-600 hover:bg-pink-700 text-white"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading
              ? "Guardando..."
              : initialData
                ? "Actualizar Vehículo"
                : "Crear Vehículo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
