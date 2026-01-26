"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProviderHeader } from "./HeaderAction";
import ProviderCard from "./ProviderTable";
import FormProvider from "./ProviderForrm";
import { ProviderView } from "../../hooks/proveedores/useCategoryprovider";
import { useProviderStore } from "../../store/providers.store";

export default function Providers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderView | null>(
    null,
  );
  const { fetchProviders } = useProviderStore();

  const handleEdit = (provider: ProviderView) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleSave = async () => {
    await fetchProviders();
    handleClose();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <ProviderHeader />

        {isFormOpen && (
          <FormProvider
            onSave={handleSave}
            onCancel={handleClose}
            initialData={editingProvider}
          />
        )}
        <ProviderCard onEdit={handleEdit} />
      </div>
    </Card>
  );
}
