"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { ClientTabs, TabType } from "./ClientTabs";
import { ClientGroupHeader } from "./ClientGroupHeader";
import ClientTable from "./ClientTable";
import GroupTable from "./GroupTable";

export default function Clients() {
  const [activeTab, setActiveTab] = useState<TabType>("clientes");
  const [refreshClients, setRefreshClients] = useState(0);
  const [refreshGroups, setRefreshGroups] = useState(0);

  // Handlers para refrescar datos después de guardar
  const handleClientSaved = () => {
    setRefreshClients((prev) => prev + 1);
  };

  const handleGroupSaved = () => {
    setRefreshGroups((prev) => prev + 1);
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
            />
            <div className="mt-6">
              <GroupTable key={refreshGroups} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
