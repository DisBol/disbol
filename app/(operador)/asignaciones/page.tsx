"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAssignmentsStore } from "./stores/assignments-store";
import { RouteProtection } from "@/components/shared/RouteProtection";
import ProductAssignment from "./components/ProductAssignment";
import HistoryAssignment, {
  HistoryAssignmentRef,
} from "./components/HistoryAssignment";

export default function AsignacionesPage() {
  const [showReception, setShowReception] = useState(false);
  const historyRef = useRef<HistoryAssignmentRef>(null);
  const hideReceptionScreen = useAssignmentsStore(
    (state) => state.hideReceptionScreen,
  );
  const showPlanning = useAssignmentsStore((state) => state.showPlanning);
  const showDistribute = useAssignmentsStore((state) => state.showDistribute);

  // Limpiar el estado de recepción al salir de la página
  useEffect(() => {
    return () => {
      hideReceptionScreen();
    };
  }, [hideReceptionScreen]);

  const handleAssignmentCreated = () => {
    // Refrescar el historial después de crear una asignación
    historyRef.current?.refresh();
  };

  return (
    <RouteProtection requiredTransaction="Asignaciones">
      <div className="min-h-screen bg-gray-50 pb-12">
        {!showReception && !showPlanning && !showDistribute && (
          <ProductAssignment onAssignmentCreated={handleAssignmentCreated} />
        )}
        <HistoryAssignment
          ref={historyRef}
          onReceptionStateChange={setShowReception}
        />
        {/* <TableResquest /> */}
      </div>
    </RouteProtection>
  );
}
