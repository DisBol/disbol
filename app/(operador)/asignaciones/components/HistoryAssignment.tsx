"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import ReceptionScreen from "./ReceptionScreen";
import HistoryAssignmentFilters from "./HistoryAssignmentFilters";
import HistoryAssignmentList from "./HistoryAssignmentList";
import { useAssignmentsStore, Assignment } from "../stores/assignments-store";
import { useAssignmentFilters } from "../hooks/useAssignmentFilters";

// Interface para los métodos expuestos del componente
export interface HistoryAssignmentRef {
  refresh: () => void;
}

interface HistoryAssignmentProps {
  onReceptionStateChange?: (show: boolean) => void;
}

const HistoryAssignment = forwardRef<
  HistoryAssignmentRef,
  HistoryAssignmentProps
>(({ onReceptionStateChange }, ref) => {
  const {
    showReception,
    selectedAssignment,
    showReceptionScreen,
    hideReceptionScreen,
  } = useAssignmentsStore();

  const { assignments, loading, error, applyFilters } = useAssignmentFilters();

  // Exponer funciones al componente padre
  useImperativeHandle(ref, () => ({
    refresh: applyFilters,
  }));

  const handleRecibirClick = (assignment: Assignment) => {
    showReceptionScreen(assignment);
    onReceptionStateChange?.(true);
  };

  const handleBackFromReception = () => {
    hideReceptionScreen();
    onReceptionStateChange?.(false);
  };

  // Si estamos mostrando la pantalla de recepción, renderizarla
  if (showReception && selectedAssignment) {
    return (
      <ReceptionScreen
        assignment={selectedAssignment}
        onBack={handleBackFromReception}
      />
    );
  }

  return (
    <div className="bg-white p-4 md:p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h1 className="text-lg font-bold text-gray-900"></h1>

          {/* Filtros */}
          <HistoryAssignmentFilters
            onApplyFilters={applyFilters}
            loading={loading}
          />
        </div>

        {/* Lista de Asignaciones */}
        <HistoryAssignmentList
          assignments={assignments}
          loading={loading}
          error={error}
          onRecibirClick={handleRecibirClick}
          onRefreshData={applyFilters}
        />
      </div>
    </div>
  );
});

HistoryAssignment.displayName = "HistoryAssignment";

export default HistoryAssignment;
