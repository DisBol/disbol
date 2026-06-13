"use client";

import { useState } from "react";
import { Empleado } from "../interfaces";
import { Employee } from "./interface";
import { useGetEmployeeDriver, useAddEmployee } from "./hooks";
import {
  EmpleadosHeader,
  EmpleadosList,
  NuevoEmpleadoForm,
  AjusteForm,
} from "./components";

export default function EmpleadosPage() {
  const {
    empleados: empleadosAPI,
    loading: loadingEmpleados,
    error: errorEmpleados,
    getEmpleados,
    updateEmpleadoLocal,
    addEmpleadoLocal,
  } = useGetEmployeeDriver();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState<Employee | null>(null);
  const [ajusteAbierto, setAjusteAbierto] = useState(false);
  const [tipoAjuste, setTipoAjuste] = useState<"favor" | "contra" | null>(null);
  const [empleadoAjuste, setEmpleadoAjuste] = useState<Empleado | null>(null);

  // Mapear empleados de API a estructura Empleado
  const empleados: Empleado[] = empleadosAPI.map((emp) => ({
    id: emp.id.toString(),
    nombre: emp.name,
    dni: emp.document,
    cargo: emp.Position_name || "Empleado",
    salario: emp.Salary_amount,
    estado: emp.active === "true" ? "Activo" : "Inactivo",
  }));

  const handleAgregar = () => {
    setEmpleadoEditar(null);
    setModalAbierto(true);
  };

  const handleEditar = (empleado: Empleado) => {
    // Encontrar el empleado original de la API
    const empleadoOriginal = empleadosAPI.find(
      (e) => e.id.toString() === empleado.id,
    );
    if (empleadoOriginal) {
      setEmpleadoEditar(empleadoOriginal);
      setModalAbierto(true);
    }
  };

  const handleAFavor = (empleado: Empleado) => {
    setEmpleadoAjuste(empleado);
    setTipoAjuste("favor");
    setAjusteAbierto(true);
  };

  const handleDescuentos = (empleado: Empleado) => {
    setEmpleadoAjuste(empleado);
    setTipoAjuste("contra");
    setAjusteAbierto(true);
  };

  const handleGuardarEmpleado = (empleadoActualizado: Employee) => {
    // Si el empleado ya existe, actualizar; si no, agregar
    const empleadoExistente = empleadosAPI.find(
      (e) => Number(e.id) === Number(empleadoActualizado.id),
    );

    if (empleadoExistente) {
      // Actualizar en tiempo real
      updateEmpleadoLocal(empleadoActualizado);
    } else {
      // Agregar nuevo en tiempo real
      addEmpleadoLocal(empleadoActualizado);
    }

    setEmpleadoEditar(null);
    setModalAbierto(false);
  };

  const handleGuardarAjuste = (monto: number, detalle: string) => {
    console.log(
      `Ajuste ${tipoAjuste} para ${empleadoAjuste?.nombre}: ${monto} - ${detalle}`,
    );
    // TODO: Guardar ajuste en la API
    setAjusteAbierto(false);
    setEmpleadoAjuste(null);
    setTipoAjuste(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 mb-6">
        <EmpleadosHeader onAgregarClick={handleAgregar} />
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 pb-6">
        {/* Formulario Nuevo Empleado */}
        {modalAbierto && (
          <NuevoEmpleadoForm
            empleado={empleadoEditar}
            onGuardar={handleGuardarEmpleado}
            onCancelar={() => {
              setEmpleadoEditar(null);
              setModalAbierto(false);
            }}
          />
        )}

        {/* Formulario Ajuste */}
        {ajusteAbierto && empleadoAjuste && tipoAjuste && (
          <AjusteForm
            empleadoNombre={empleadoAjuste.nombre}
            empleadoId={Number(empleadoAjuste.id)}
            tipoAjuste={tipoAjuste}
            onCancelar={() => {
              setAjusteAbierto(false);
              setEmpleadoAjuste(null);
              setTipoAjuste(null);
            }}
          />
        )}

        {/* Estado de carga */}
        {loadingEmpleados && (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando empleados...</p>
          </div>
        )}

        {/* Mensaje de error */}
        {errorEmpleados && !loadingEmpleados && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errorEmpleados}
          </div>
        )}

        {/* Tabla de Empleados */}
        {!loadingEmpleados && (
          <EmpleadosList
            empleados={empleados}
            onEditarClick={handleEditar}
            onAFavorClick={handleAFavor}
            onDescuentosClick={handleDescuentos}
          />
        )}
      </div>
    </div>
  );
}
