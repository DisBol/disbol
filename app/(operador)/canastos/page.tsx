import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";

export default function CanastosPage() {
  return (
    <RouteProtection requiredTransaction="Canastos">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Canastos</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Contenido de canastos...</p>
        </div>
      </div>
    </RouteProtection>
  );
}
