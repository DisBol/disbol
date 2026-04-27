import { useEffect, useMemo } from "react";
import { RequestHistoryFilters } from "../hooks/useGetrequesthistory";
import { Select } from "@/components/ui/SelecMultipe";
import { DateField } from "@/components/ui/DateField";
import { useCategoryProvider } from "@/app/(operador)/configuraciones/hooks/proveedores/useCategoryprovider";
import { useClientGroups } from "@/app/(operador)/configuraciones/hooks/clientes/useClientsGroups";
import { useClients } from "@/app/(operador)/configuraciones/hooks/clientes/useClients";

interface FIiltroRequestProps {
  filters: RequestHistoryFilters;
  updateFilter: (key: keyof RequestHistoryFilters, value: unknown) => void;
}

export default function FIiltroRequest({
  filters,
  updateFilter,
}: FIiltroRequestProps) {
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const { clientGroups, isLoading: isLoadingGroups } = useClientGroups();
  const { clients, fetchByGroup, loading: isLoadingClients } = useClients();

  useEffect(() => {
    if (filters.ClientGroup_id) {
      fetchByGroup(filters.ClientGroup_id);
    } else {
      fetchByGroup(undefined);
    }
  }, [filters.ClientGroup_id, fetchByGroup]);

  const handleDateChange = (
    type: "start" | "end",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dateStr = e.target.value;
    if (!dateStr) return;

    const formatted =
      type === "start" ? `${dateStr} 00:00:00` : `${dateStr} 23:59:59`;

    if (type === "start") {
      updateFilter("start_date", formatted);
    } else {
      updateFilter("end_date", formatted);
    }
  };

  // Compute Options
  const providerOptions = useMemo(() => {
    return [
      { value: "0", label: "Todos los Proveedores" },
      ...providers.map((p) => ({
        value: p.id.toString(),
        label: p.nombre,
      })),
    ];
  }, [providers]);

  const groupOptions = useMemo(() => {
    return [
      { value: "0", label: "Todos los Grupos" },
      ...clientGroups.map((g) => ({
        value: g.value,
        label: g.label,
      })),
    ];
  }, [clientGroups]);

  const clientOptions = useMemo(() => {
    return [
      { value: "0", label: "Todos los Clientes" },
      ...clients.map((c) => ({
        value: c.id.toString(),
        label: c.name,
      })),
    ];
  }, [clients]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 font-primary">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <DateField
                label="FECHA INICIO"
                size="sm"
                value={
                  filters.start_date ? filters.start_date.split(" ")[0] : ""
                }
                onChange={(e) => handleDateChange("start", e)}
              />
            </div>
            <div>
              <DateField
                label="FECHA FIN"
                size="sm"
                value={filters.end_date ? filters.end_date.split(" ")[0] : ""}
                onChange={(e) => handleDateChange("end", e)}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-2">
          <Select
            label="PROVEEDOR"
            size="sm"
            options={providerOptions}
            selectedValues={[filters.Provider_id.toString()]}
            onSelect={(opt) => updateFilter("Provider_id", Number(opt.value))}
            placeholder={isLoadingProviders ? "Cargando..." : "Seleccionar..."}
          />
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-2">
          <Select
            label="GRUPO"
            size="sm"
            options={groupOptions}
            selectedValues={[filters.ClientGroup_id.toString()]}
            onSelect={(opt) =>
              updateFilter("ClientGroup_id", Number(opt.value))
            }
            placeholder={isLoadingGroups ? "Cargando..." : "Seleccionar..."}
          />
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <Select
            label="CLIENTE"
            size="sm"
            options={clientOptions}
            selectedValues={
              filters.Client_id ? [filters.Client_id.toString()] : []
            }
            onSelect={(opt) => updateFilter("Client_id", Number(opt.value))}
            placeholder={isLoadingClients ? "Cargando..." : "Seleccionar..."}
            disabled={!filters.ClientGroup_id} // Disable if no group selected, similar to NewRequest logic "disabled={!ruta}"
          />
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-2">
          <Select
            label="ESTADO"
            size="sm"
            options={[
              { value: "0", label: "Todos los Estados" },
              { value: "1", label: "Emitido" },
              { value: "2", label: "Enviado" },
            ]}
            selectedValues={[filters.RequestState_id.toString()]}
            onSelect={(opt) =>
              updateFilter("RequestState_id", Number(opt.value))
            }
            placeholder="Seleccionar..."
          />
        </div>
      </div>
    </div>
  );
}
