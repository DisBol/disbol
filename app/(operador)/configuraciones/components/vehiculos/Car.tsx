"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProviderHeader } from "./HeaderAction";
import ProviderCard from "./CarTable";
import FormProvider from "./CarForrm";

export default function Cars() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (provider: any) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleSave = async () => {
    handleClose();
    setRefreshTrigger((prev) => prev + 1);
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
          />
        )}
        <ProviderCard
          key={refreshTrigger}
          onEdit={handleEdit}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </div>
    </Card>
  );
}
