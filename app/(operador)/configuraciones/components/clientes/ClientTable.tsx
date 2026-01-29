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
import { useState } from "react";
import { useClients } from "../../hooks/clientes/useClients";
import { useClientGroups } from "../../hooks/clientes/useClientsGroups";
import { useUpdateClient } from "../../hooks/clientes/useUpdateClient";
import { Datum as ClientData } from "../../interfaces/clientes/getclient.interface";
import ClientForm from "./ClientForm";

interface ClientTableProps {
  onClientUpdated?: () => void;
}

export default function ClientTable({ onClientUpdated }: ClientTableProps) {
  const { clients, rawData, loading, error } = useClients();
  const { clientGroups } = useClientGroups();
  const { updateClient, loading: updateLoading } = useUpdateClient();
  const [editingClient, setEditingClient] = useState<ClientData | undefined>(
    undefined,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Función para abrir modal de edición
  const handleEditClient = (clientId: number) => {
    const clientData = rawData?.find((client) => client.id === clientId);
    if (clientData) {
      setEditingClient(clientData);
      setIsEditModalOpen(true);
    }
  };

  // Función para eliminar cliente (soft delete)
  const handleDeleteClient = async (clientId: number) => {
    try {
      const clientData = rawData?.find((client) => client.id === clientId);
      if (!clientData) return;

      // Mostrar mensaje de confirmación
      if (
        confirm(`¿Estás seguro de que deseas eliminar a ${clientData.name}?`)
      ) {
        await updateClient(
          clientData.id,
          clientData.name,
          clientData.document,
          clientData.lat,
          clientData.long,
          clientData.phone,
          "false", // Cambiar active a false
          clientData.ClientGroup_id.toString(),
        );

        // Refrescar la lista después de eliminar
        onClientUpdated?.();
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      // Aquí podrías mostrar un toast o mensaje de error
    }
  };

  // Función para cerrar modal de edición
  const handleCloseEditModal = () => {
    setEditingClient(undefined);
    setIsEditModalOpen(false);
  };

  // Función para manejar actualización exitosa
  const handleClientSaved = () => {
    handleCloseEditModal();
    onClientUpdated?.();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Cargando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error al cargar clientes: {error.message}
        </div>
      </div>
    );
  }

  // Función para obtener el nombre del grupo por ID
  const getGroupName = (groupId: number) => {
    const group = clientGroups.find((g) => g.value === groupId.toString());
    return group ? group.label : "Sin grupo";
  };

  return (
    <div className="w-full">
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                <TableHead className="text-xs sm:text-sm">Grupo</TableHead>
                <TableHead className="text-xs sm:text-sm">Teléfono</TableHead>
                <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="group">
                  <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                    {client.name}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs sm:text-sm">
                    {getGroupName(client.clientGroupId)}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs sm:text-sm">
                    {client.phone}
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={client.active === "true" ? "success" : "default"}
                      className="text-xs"
                    >
                      {client.active === "true" ? "Activo" : "Inactivo"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClient(client.id)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        disabled={updateLoading}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
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
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium">Nombre</p>
                <p className="font-medium text-gray-900 text-sm">
                  {client.name}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditClient(client.id)}
                  className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  disabled={updateLoading}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Grupo</p>
              <p className="text-sm text-gray-700">
                {getGroupName(client.clientGroupId)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Teléfono</p>
              <p className="text-sm text-gray-700">{client.phone}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Estado</p>
              <Chip
                variant="flat"
                size="sm"
                color={client.active === "true" ? "success" : "default"}
                className="text-xs"
              >
                {client.active === "true" ? "Activo" : "Inactivo"}
              </Chip>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      <ClientForm
        isOpen={isEditModalOpen}
        onSave={handleClientSaved}
        onCancel={handleCloseEditModal}
        client={editingClient}
      />
    </div>
  );
}
