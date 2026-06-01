"use client";

import { Empleado } from "../interfaces";

interface EmpleadosListProps {
  empleados: Empleado[];
  onEditarClick?: (empleado: any) => void;
  onAFavorClick?: (empleado: any) => void;
  onDescuentosClick?: (empleado: any) => void;
}

export default function EmpleadosList({
  empleados,
  onEditarClick,
  onAFavorClick,
  onDescuentosClick,
}: EmpleadosListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              DNI
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Cargo
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr
              key={empleado.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-sm text-gray-900">
                {empleado.nombre}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {empleado.dni}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {empleado.cargo}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {empleado.estado}
              </td>
              <td className="px-6 py-4 text-sm space-x-2 flex">
                <button
                  onClick={() => onEditarClick && onEditarClick(empleado)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded text-xs font-medium transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => onAFavorClick && onAFavorClick(empleado)}
                  className="bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded text-xs font-medium transition"
                >
                  A favor
                </button>
                <button
                  onClick={() => onDescuentosClick && onDescuentosClick(empleado)}
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-xs font-medium transition"
                >
                  Descuentos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
