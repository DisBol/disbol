"use client";

import { useState } from "react";
import { Empleado } from "../interfaces";
import { EmpleadosHeader, EmpleadosList } from "../components";

export default function EmpleadosPage() {
  const [empleados] = useState<Empleado[]>([
    {
      id: "1",
      nombre: "Juan Pérez",
      dni: "1234567",
      cargo: "Vendedor",
      estado: "Activo",
    },
    {
      id: "2",
      nombre: "María López",
      dni: "7654321",
      cargo: "Gerente",
      estado: "Activo",
    },
    {
      id: "3",
      nombre: "Carlos Ramírez",
      dni: "1122334",
      cargo: "Contador",
      estado: "Activo",
    },
  ]);

  const handleAgregar = () => {
    // TODO: Abrir modal o navegar a formulario de crear empleado
    console.log("Agregar empleado");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 mb-6">
        <EmpleadosHeader onAgregarClick={handleAgregar} />
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 pb-6">
        <EmpleadosList empleados={empleados} />
      </div>
    </div>
  );
}
