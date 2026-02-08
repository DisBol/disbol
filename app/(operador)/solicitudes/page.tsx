import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import TableResquest from "./components/TableResquest";
import NewRequest from "./components/NewRequest";

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
