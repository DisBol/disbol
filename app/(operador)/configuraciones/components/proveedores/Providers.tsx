import { ProviderHeader } from "./HeaderAction";
import ProviderCard from "./ProviderTable";

export default function Providers() {
    return (
        <div className="space-y-6">
            <ProviderHeader />
            <ProviderCard />
        </div>
    );
}
