"use client";
import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import ClientForm from "./ClientForm";

export function ClientHeader() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveClient = async () => {
    console.log("Nuevo cliente guardado exitosamente");
    // La lógica de guardado ya está en ClientForm con useAddClient hook
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Clientes</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RoundPlusIcon className="h-4 w-4" />}
            onClick={() => setIsFormOpen(true)}
          >
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Modal de Cliente */}
      <ClientForm
        isOpen={isFormOpen}
        onSave={handleSaveClient}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
