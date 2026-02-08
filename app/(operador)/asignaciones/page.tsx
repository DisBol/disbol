"use client";

import React, { useState } from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import ProductAssignment from "./components/ProductAssignment";
import HistoryAssignment from "./components/HistoryAssignment";

export default function AsignacionesPage() {
  const [showReception, setShowReception] = useState(false);

  return (
    <RouteProtection requiredTransaction="Asignaciones">
      <div className="min-h-screen bg-gray-50 pb-12">
        {!showReception && <ProductAssignment />}
        <HistoryAssignment 
          onReceptionStateChange={setShowReception}
        />
        {/* <TableResquest /> */}
      </div>
    </RouteProtection>
  );
}
