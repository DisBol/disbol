"use client";
import { DeleteIcon } from "../../../../../components/icons/DeleteIcon";
import { EditIcon } from "../../../../../components/icons/EditIcon2";
import { Chip } from "../../../../../components/ui/Chip";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../../../../components/ui/Table";
import { Datum } from "../../interfaces/clientes/getclientgroup.interface";
import { useClientGroups } from "../../hooks/clientes/useClientsGroups";

interface GroupTableProps {
  onEdit?: (group: Datum) => void;
  onDelete?: (group: Datum) => void;
}

export default function GroupTable({ onEdit, onDelete }: GroupTableProps) {
  const { rawData, isLoading, error } = useClientGroups();

  const handleDeactivate = (group: Datum) => {
    if (
      confirm(
        `¿Estás seguro de que deseas desactivar el grupo "${group.name}"?`,
      )
    ) {
      onDelete?.(group);
    }
  };

  const handleEdit = (group: Datum) => {
    onEdit?.(group);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Cargando grupos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error al cargar grupos: {error.message}
        </div>
      </div>
    );
  }

  // Usar los datos crudos directamente
  const groups = rawData;

  return (
    <div className="w-full">
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id} className="group">
                  <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                    {group.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={group.active === "true" ? "success" : "default"}
                      className="text-xs"
                    >
                      {group.active === "true" ? "Activo" : "Inactivo"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(group)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(group)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <DeleteIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-2.5">
        {groups.length === 0 ? (
          <div className="text-center py-8 px-4 bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-medium text-gray-600">No se encontraron grupos</p>
            <p className="text-xs text-gray-400 mt-1">
              Añade un nuevo grupo para comenzar.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-gray-200/80 rounded-xl p-3.5 shadow-sm flex items-center justify-between gap-3 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-sm break-words">
                    {group.name}
                  </h3>
                  <Chip
                    variant="flat"
                    size="sm"
                    color={group.active === "true" ? "success" : "default"}
                    className="text-[10px] h-5 px-1.5 shrink-0"
                  >
                    {group.active === "true" ? "Activo" : "Inactivo"}
                  </Chip>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(group)}
                  aria-label="Editar grupo"
                  className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors active:scale-95"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeactivate(group)}
                  aria-label="Desactivar grupo"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
