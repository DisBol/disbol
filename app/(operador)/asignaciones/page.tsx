"use client";

import React, { useState, useRef } from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import ProductAssignment from "./components/ProductAssignment";
import HistoryAssignment, {
  HistoryAssignmentRef,
} from "./components/HistoryAssignment";

export default function AsignacionesPage() {
  const [showReception, setShowReception] = useState(false);
  const historyRef = useRef<HistoryAssignmentRef>(null);

  const handleAssignmentCreated = () => {
    // Refrescar el historial después de crear una asignación
    historyRef.current?.refresh();
  };

  return (
    <RouteProtection requiredTransaction="Asignaciones">
      <div className="min-h-screen bg-gray-50 pb-12">
        {!showReception && (
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
