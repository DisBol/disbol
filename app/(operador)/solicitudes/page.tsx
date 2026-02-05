import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import NewRequest from "./components/NewRequest";
import TableResquest from "./components/TableResquest";

export default function SolicitudesPage() {
  return (
    <RouteProtection requiredTransaction="Solicitudes">
      <div className="min-h-screen bg-gray-50 pb-12">
        <NewRequest />
        <TableResquest />
      </div>
    </RouteProtection>
  );
}
