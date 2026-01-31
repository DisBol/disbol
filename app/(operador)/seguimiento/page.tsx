import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";

export default function SeguimientoPage() {
  return (
    <RouteProtection requiredTransaction="Seguimiento">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Seguimiento</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Contenido de seguimiento...</p>
        </div>
      </div>
    </RouteProtection>
  );
}
