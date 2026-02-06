import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import ProductAssignment from "./components/ProductAssignment";
import HistoryAssignment from "./components/HistoryAssignment";

export default function AsignacionesPage() {
  return (
    <RouteProtection requiredTransaction="Asignaciones">
      <div className="min-h-screen bg-gray-50 pb-12">
        <ProductAssignment />
        <HistoryAssignment />
        {/* <TableResquest /> */}
      </div>
    </RouteProtection>
  );
}
