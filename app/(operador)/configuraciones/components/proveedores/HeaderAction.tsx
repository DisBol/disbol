"use client";
import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import FormProvider from "./ProviderForrm";
import { useProviderStore } from "../../store/providers.store";

export function ProviderHeader() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { fetchProviders } = useProviderStore();

  const handleSaveProvider = async (data: {
    name: string;
    assignedGroups: { id: string; name: string; category: string }[];
  }) => {
    console.log("Nuevo proveedor guardado:", data);
    await fetchProviders();
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Proveedores</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RoundPlusIcon className="h-4 w-4" />}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      {/* Form que se despliega */}
      {isFormOpen && (
        <FormProvider
          onSave={handleSaveProvider}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
