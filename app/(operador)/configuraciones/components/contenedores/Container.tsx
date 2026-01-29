"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProviderHeader } from "./HeaderAction";
import ProviderCard from "./ContainerTable";
import FormProvider from "./ContainerForm";
import { Container } from "../../interfaces/contenedores/getcontainer.interface";
import { useContainer } from "../../hooks/contenedores/useContainer";
import { useUpdateContainer } from "../../hooks/contenedores/useUpdateContainer";
import { useAddContainer } from "../../hooks/contenedores/useAddContainer";

export default function Containers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Container | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const { containersData, isLoading, refresh } = useContainer();
  const { updateContainer } = useUpdateContainer();
  const { addContainer } = useAddContainer();

  const handleEdit = (provider: Container) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleSave = async (data: Partial<Container>) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      let success = false;
      if (editingProvider) {
        if (!editingProvider.id) return;
        const result = await updateContainer({
          id: editingProvider.id,
          name: data.name || "",
          destare: data.destare || 0,
          deff: data.deff || 0,
          active: editingProvider.active,
        });
        success = !!result;
      } else {
        const result = await addContainer({
          name: data.name || "",
          destare: data.destare || 0,
          deff: data.deff || 0,
          active: "true",
        });
        success = !!result;
      }

      if (success) {
        await refresh();
        handleClose();
      } else {
        alert("Error al guardar el contenedor. Por favor, intente de nuevo.");
      }
    } catch (error) {
      console.error("Error saving container:", error);
      alert("Ocurrió un error inesperado.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (container: Container) => {
    try {
      const result = await updateContainer({
        id: container.id,
        name: container.name,
        destare: container.destare,
        deff:
          container.deff === "true" ||
          container.deff === "1" ||
          container.deff === 1 ||
          container.deff === true
            ? 1
            : 0,
        active: "false",
      });

      if (result) {
        await refresh();
      } else {
        alert("Error al eliminar el contenedor. Por favor, intente de nuevo.");
      }
    } catch (error) {
      console.error("Error deleting container:", error);
      alert("Ocurrió un error inesperado al eliminar.");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <ProviderHeader
          onOpenForm={() => {
            if (isFormOpen) {
              handleClose();
            } else {
              setEditingProvider(null);
              setIsFormOpen(true);
            }
          }}
        />

        {isFormOpen && (
          <FormProvider
            onSave={handleSave}
            onCancel={handleClose}
            initialData={editingProvider}
            isLoading={isSaving}
          />
        )}
        <ProviderCard
          onEdit={handleEdit}
          onDelete={handleDelete}
          data={containersData}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
}
