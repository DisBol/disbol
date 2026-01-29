"use client";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { Chip } from "@/components/ui/Chip";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Datum } from "../../interfaces/clientes/getclientgroup.interface";
import { useClientGroups } from "../../hooks/clientes/useClientsGroups";

interface GroupTableProps {
  onEdit?: (group: Datum) => void;
  onDelete?: (groupId: number) => void;
}

export default function GroupTable({ onEdit, onDelete }: GroupTableProps) {
  const { clientGroups, isLoading, error } = useClientGroups();

  const handleDeactivate = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que deseas desactivar el grupo "${name}"?`)) {
      onDelete?.(id);
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

  // Transformar los datos del hook para la tabla
  const groups = clientGroups.map((group) => ({
    id: parseInt(group.value),
    name: group.label,
    descripcion: "Descripción predeterminada", // Campo quemado como solicitaste
    active: group.active,
  }));

  return (
    <div className="w-full">
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                <TableHead className="text-xs sm:text-sm">
                  Descripción
                </TableHead>
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
                  <TableCell className="text-gray-600 text-xs sm:text-sm">
                    {group.descripcion}
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
                        onClick={() =>
                          handleEdit({
                            id: group.id,
                            name: group.name,
                            idCerca: 0, // Campo requerido por la interfaz
                            active: group.active,
                            created_at: new Date(),
                            updated_at: new Date(),
                          })
                        }
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(group.id, group.name)}
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
      <div className="md:hidden space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium">Nombre</p>
                <p className="font-medium text-gray-900 text-sm">
                  {group.name}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    handleEdit({
                      id: group.id,
                      name: group.name,
                      idCerca: 0,
                      active: group.active,
                      created_at: new Date(),
                      updated_at: new Date(),
                    })
                  }
                  className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeactivate(group.id, group.name)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Descripción
              </p>
              <p className="text-sm text-gray-700">{group.descripcion}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Estado</p>
              <Chip
                variant="flat"
                size="sm"
                color={group.active === "true" ? "success" : "default"}
                className="text-xs"
              >
                {group.active === "true" ? "Activo" : "Inactivo"}
              </Chip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
