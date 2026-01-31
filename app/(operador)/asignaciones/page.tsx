import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";

export default function AsignacionesPage() {
  return (
    <RouteProtection requiredTransaction="Asignaciones">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Asignaciones</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Contenido de asignaciones...</p>
        </div>
      </div>
    </RouteProtection>
  );
}
