"use client";
import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { TabType } from "./ClientTabs";
import ClientForm from "./ClientForm";
import GroupForm from "./GroupForm";
import {
  Datum,
  GroupFormData,
} from "../../interfaces/clientes/getclientgroup.interface";

interface ClientGroupHeaderProps {
  activeTab: TabType;
  onClientSaved?: () => void;
  onGroupSaved?: () => void;
  editingGroup?: Datum | null;
  onGroupEdit?: (group: Datum | null) => void;
}

export function ClientGroupHeader({
  activeTab,
  onClientSaved,
  onGroupSaved,
  editingGroup,
  onGroupEdit,
}: ClientGroupHeaderProps) {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);

  const handleSaveClient = () => {
    console.log("Cliente guardado exitosamente");
    setIsClientFormOpen(false);
    // Notificar al componente padre para refrescar la lista
    onClientSaved?.();
  };

  const handleSaveGroup = async (data: GroupFormData) => {
    console.log("Grupo guardado exitosamente:", data);
    setIsGroupFormOpen(false);
    onGroupEdit?.(null); // Limpiar el grupo en edición
    // Notificar al componente padre para refrescar la lista
    onGroupSaved?.();
  };

  const isClientTab = activeTab === "clientes";

  const handleNewClick = () => {
    if (isClientTab) {
      setIsClientFormOpen(true);
    } else {
      // Limpiar cualquier grupo en edición y abrir formulario para nuevo grupo
      onGroupEdit?.(null);
      setIsGroupFormOpen(true);
    }
  };

  const handleCancelClient = () => {
    setIsClientFormOpen(false);
  };

  const handleCancelGroup = () => {
    setIsGroupFormOpen(false);
    onGroupEdit?.(null); // Limpiar el grupo en edición
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold">
          {isClientTab ? "Clientes" : "Grupos"}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RoundPlusIcon className="h-4 w-4" />}
            onClick={handleNewClick}
          >
            {isClientTab ? "Nuevo Cliente" : "Nuevo Grupo"}
          </Button>
        </div>
      </div>

      {/* Modal de Cliente */}
      <ClientForm
        isOpen={isClientFormOpen}
        onSave={handleSaveClient}
        onCancel={handleCancelClient}
      />

      {/* Form de Grupo (se despliega abajo) */}
      {(isGroupFormOpen || editingGroup) && (
        <GroupForm
          onSave={handleSaveGroup}
          onCancel={handleCancelGroup}
          group={editingGroup || undefined}
        />
      )}
    </>
  );
}
