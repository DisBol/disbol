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
      className="w-full"
    >
      <TabsList variant="underlined" fullWidth className="grid grid-cols-2 w-full">
        <TabsTrigger
          value="clientes"
          variant="underlined"
          className="w-full text-center py-2 sm:py-2.5 text-xs sm:text-sm font-semibold"
        >
          Clientes
        </TabsTrigger>
        <TabsTrigger
          value="grupos"
          variant="underlined"
          className="w-full text-center py-2 sm:py-2.5 text-xs sm:text-sm font-semibold"
        >
          Grupos
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
