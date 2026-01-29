import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export type TabType = "clientes" | "grupos";

interface ClientTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ClientTabs({ activeTab, onTabChange }: ClientTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as TabType)}
    >
      <TabsList variant="underlined" fullWidth>
        <TabsTrigger value="clientes" variant="underlined">
          Clientes
        </TabsTrigger>
        <TabsTrigger value="grupos" variant="underlined">
          Grupos
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
