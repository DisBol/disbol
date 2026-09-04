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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Clientes</h2>

        <Button
          variant="danger"
          size="sm"
          leftIcon={<RoundPlusIcon className="h-4 w-4 shrink-0" />}
          onClick={() => setIsFormOpen(true)}
          className="text-xs sm:text-sm shrink-0"
        >
          Nuevo Cliente
        </Button>
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
