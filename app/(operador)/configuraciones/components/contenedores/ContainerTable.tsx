"use client";
import { DeleteIcon } from "../../../../../components/icons/DeleteIcon";
import { EditIcon } from "../../../../../components/icons/EditIcon";
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
import { Container } from "../../interfaces/contenedores/getcontainer.interface";

interface ContainerTableProps {
  onEdit?: (container: Container) => void;
  onDelete?: (container: Container) => void;
  data: Container[] | null;
  isLoading: boolean;
}

export default function ContainerTable({
  onEdit,
  onDelete,
  data,
  isLoading,
}: ContainerTableProps) {
  const handleDelete = (container: Container) => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${container.name}?`)) {
      onDelete?.(container);
    }
  };

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                <TableHead className="text-xs sm:text-sm">
                  Peso (Destare)
                </TableHead>
                <TableHead className="text-xs sm:text-sm">
                  Por Defecto
                </TableHead>
                <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((container) => (
                <TableRow key={container.id} className="group">
                  <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                    {container.name}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">
                    {container.destare} kg
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={
                        container.deff === "true" ||
                        container.deff === "1" ||
                        container.deff === 1 ||
                        container.deff === true
                          ? "success"
                          : "danger"
                      }
                      className="text-xs"
                    >
                      {container.deff === "true" ||
                      container.deff === "1" ||
                      container.deff === 1 ||
                      container.deff === true
                        ? "Sí"
                        : "No"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit?.(container)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(container)}
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

      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="text-center p-4 text-gray-500">Cargando...</div>
        ) : (
          data?.map((container) => (
            <div
              key={container.id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Nombre</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {container.name}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit?.(container)}
                    className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(container)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Peso (Destare)
                </p>
                <p className="text-sm text-gray-700">{container.destare} kg</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-2">
                  Por Defecto
                </p>
                <Chip
                  variant="flat"
                  size="sm"
                  color={
                    container.deff === "true" ||
                    container.deff === "1" ||
                    container.deff === 1 ||
                    container.deff === true
                      ? "success"
                      : "danger"
                  }
                  className="text-xs"
                >
                  {container.deff === "true" ||
                  container.deff === "1" ||
                  container.deff === 1 ||
                  container.deff === true
                    ? "Sí"
                    : "No"}
                </Chip>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
