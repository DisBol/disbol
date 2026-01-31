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
import { Datum } from "../../interfaces/usuarios/user.interface";

interface UsersTableProps {
  onEdit?: (user: Datum) => void;
  onDelete?: (user: Datum) => void;
  users: Datum[];
  isLoading: boolean;
}

export default function UsersTable({
  onEdit,
  onDelete,
  users,
  isLoading,
}: UsersTableProps) {
  const handleDelete = (user: Datum) => {
    onDelete?.(user);
  };

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Usuario</TableHead>
                <TableHead className="text-xs sm:text-sm">CI</TableHead>
                <TableHead className="text-xs sm:text-sm">Rol</TableHead>
                <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="font-bold text-gray-900 text-xs sm:text-sm">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">
                    {user.password}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">
                    {user.Role_name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={user.active === "true" ? "success" : "danger"}
                      className="text-xs"
                    >
                      {user.active === "true" ? "Activo" : "Inactivo"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit?.(user)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
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
          users?.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Usuario</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {user.username}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit?.(user)}
                    className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Contraseña
                </p>
                <p className="text-sm text-gray-700">{user.password}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Rol</p>
                <p className="text-sm text-gray-700">{user.Role_name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-2">Estado</p>
                <Chip
                  variant="flat"
                  size="sm"
                  color={user.active === "true" ? "success" : "danger"}
                  className="text-xs"
                >
                  {user.active === "true" ? "Activo" : "Inactivo"}
                </Chip>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
