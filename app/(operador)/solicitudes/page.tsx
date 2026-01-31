import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";

export default function SolicitudesPage() {
  return (
    <RouteProtection requiredTransaction="Solicitudes">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Solicitudes</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Contenido de solicitudes...</p>
        </div>
      </div>
    </RouteProtection>
  );
}
