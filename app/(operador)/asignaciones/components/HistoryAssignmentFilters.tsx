"use client";

import React, { useMemo } from "react";
import { DateField } from "@/components/ui/DateField";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/SelecMultipe";
import { useAssignmentsStore } from "../stores/assignments-store";
import { useCategoryProvider } from "../../configuraciones/hooks/proveedores/useCategoryprovider";

interface HistoryAssignmentFiltersProps {
  onApplyFilters: () => void;
  loading: boolean;
}

const HistoryAssignmentFilters: React.FC<HistoryAssignmentFiltersProps> = ({
  onApplyFilters,
  loading,
}) => {
  const { filters, setFilters } = useAssignmentsStore();
  const { providers, loading: isLoadingProviders } = useCategoryProvider();

  const providerOptions = useMemo(() => {
    return providers.map((p) => ({
      value: p.id.toString(),
      label: p.nombre,
    }));
  }, [providers]);

  const handleProviderChange = (option: { value: string; label: string }) => {
    setFilters({ proveedor: option.value });
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ fechaInicio: e.target.value });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ fechaFin: e.target.value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
      {/* Proveedor Filter */}
      <div className="min-w-50">
        <Select
          size="sm"
          options={providerOptions}
          selectedValues={filters.proveedor ? [filters.proveedor] : []}
          onSelect={handleProviderChange}
          placeholder={
            isLoadingProviders ? "Cargando..." : "Seleccionar proveedor"
          }
        />
      </div>

      {/* Fecha Inicio */}
      <div className="min-w-35">
        <DateField
          size="sm"
          value={filters.fechaInicio}
          onChange={handleFechaInicioChange}
          placeholder="dd/mm/aaaa"
        />
      </div>

      {/* Fecha Fin */}
      <div className="min-w-35">
        <DateField
          size="sm"
          value={filters.fechaFin}
          onChange={handleFechaFinChange}
          placeholder="dd/mm/aaaa"
        />
      </div>

      {/* Botón Filtrar */}
      <div>
        <Button
          variant="primary"
          color="primary"
          size="sm"
          onClick={onApplyFilters}
          disabled={loading}
        >
          Filtrar
        </Button>
      </div>
    </div>
  );
};

export default HistoryAssignmentFilters;
