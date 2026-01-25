import { Card } from "@/components/ui/Card";
import { ProviderHeader } from "./HeaderAction";
import ProviderCard from "./ProviderTable";

export default function Providers() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <ProviderHeader />
        <ProviderCard />
      </div>
    </Card>
  );
}
