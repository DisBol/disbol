"use client";

interface EmpleadosHeaderProps {
  onAgregarClick?: () => void;
}

export default function EmpleadosHeader({
  onAgregarClick,
}: EmpleadosHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Gestión de Empleados
      </h1>
      <button
        onClick={onAgregarClick}
        className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded font-semibold transition"
      >
        Agregar Empleado
      </button>
    </div>
  );
}
