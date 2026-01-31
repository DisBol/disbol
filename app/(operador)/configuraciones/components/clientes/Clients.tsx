"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { ClientTabs, TabType } from "./ClientTabs";
import { ClientGroupHeader } from "./ClientGroupHeader";
import ClientTable from "./ClientTable";
import GroupTable from "./GroupTable";
import { Datum } from "../../interfaces/clientes/getclientgroup.interface";
import { useDeleteClientGroup } from "../../hooks/clientes/useDeleteClientGroup";

export default function Clients() {
  const [activeTab, setActiveTab] = useState<TabType>("clientes");
  const [refreshClients, setRefreshClients] = useState(0);
  const [refreshGroups, setRefreshGroups] = useState(0);
  const [editingGroup, setEditingGroup] = useState<Datum | null>(null);

  // Hook para eliminar grupos
  const { deleteClientGroup } = useDeleteClientGroup();

  // Handlers para refrescar datos después de guardar
  const handleClientSaved = () => {
    setRefreshClients((prev) => prev + 1);
  };

  const handleGroupSaved = () => {
    setRefreshGroups((prev) => prev + 1);
    setEditingGroup(null); // Limpiar el grupo en edición
  };

  // Handler para editar un grupo
  const handleGroupEdit = (group: Datum) => {
    setEditingGroup(group);
  };

  // Handler para eliminar/desactivar un grupo
  const handleGroupDelete = async (group: Datum) => {
    try {
      await deleteClientGroup(group.id, group.name, group.idCerca.toString());
      console.log(`Grupo "${group.name}" desactivado exitosamente`);
      handleGroupSaved(); // Refrescar la lista
    } catch (error) {
      console.error("Error al desactivar grupo:", error);
    }
  };

  // Handler para cancelar edición
  const handleGroupEditCancel = () => {
    setEditingGroup(null);
  };

  return (
    <Card className="p-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
      >
        <div className="space-y-6">
          <ClientTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="clientes" animation="fade">
            <ClientGroupHeader
              activeTab="clientes"
              onClientSaved={handleClientSaved}
            />
            <div className="mt-6">
              <ClientTable
                key={refreshClients}
                onClientUpdated={handleClientSaved}
              />
            </div>
          </TabsContent>

          <TabsContent value="grupos" animation="fade">
            <ClientGroupHeader
              activeTab="grupos"
              onGroupSaved={handleGroupSaved}
              editingGroup={editingGroup}
              onGroupEdit={handleGroupEditCancel}
            />
            <div className="mt-6">
              <GroupTable
                key={refreshGroups}
                onEdit={handleGroupEdit}
                onDelete={handleGroupDelete}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
