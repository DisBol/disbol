"use client";
import React, { useState, useEffect } from "react";
import { Container } from "../../interfaces/contenedores/getcontainer.interface";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

interface FormProviderProps {
  onSave: (data: Partial<Container>) => void;
  onCancel: () => void;
  initialData?: Container | null;
  isLoading?: boolean;
}

export default function ContainerForm({
  onSave,
  onCancel,
  initialData,
  isLoading = false,
}: FormProviderProps) {
  const [name, setName] = useState("");
  const [peso, setPeso] = useState("");
  const [porDefecto, setPorDefecto] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    peso?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPeso(initialData.destare?.toString() || "");
      setPorDefecto(
        initialData.deff === "true" ||
          initialData.deff === "1" ||
          initialData.deff === 1 ||
          initialData.deff === true ||
          false,
      );
    } else {
      setName("");
      setPeso("");
      setPorDefecto(false);
    }
  }, [initialData]);

  const handleSave = async () => {
    const newErrors: { name?: string; peso?: string } = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!peso.trim()) newErrors.peso = "El peso es obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({
      ...initialData,
      name,
      destare: parseFloat(peso),
      deff: porDefecto ? 1 : 0,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top">
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="w-full md:w-1/2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              NOMBRE
            </label>
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              error={errors.name}
              className="w-full"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              PESO (DESTARE) KG
            </label>
            <InputField
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder=""
              error={errors.peso}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 pb-3">
            <input
              type="checkbox"
              id="defecto"
              checked={porDefecto}
              onChange={(e) => setPorDefecto(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <label
              htmlFor="defecto"
              className="text-xs font-bold text-gray-600 uppercase cursor-pointer"
            >
              CONTENEDOR POR DEFECTO
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-start pt-2">
          <Button
            onClick={handleSave}
            variant="danger"
            leftIcon={!isLoading ? <SaveIcon className="h-4 w-4" /> : null}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>

          <Button onClick={onCancel} variant="ghost">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
