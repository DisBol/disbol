"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProviderHeader } from "./HeaderAction";
import UsersTable from "./UsersTable";
import UsersForm from "./UsersForm";
import RolesForm from "./RolesForm";
import { Datum, UserFormData } from "../../interfaces/usuarios/user.interface";
import { RoleFormData } from "../../interfaces/usuarios/role.interface";
import { useAddUser } from "../../hooks/usuarios/useAddUser";
import { useUser } from "../../hooks/usuarios/useUser";
import { useUpdateUser } from "../../hooks/usuarios/useUpdateUser";

export default function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Datum | null>(null);
  const { addUser, loading: isAdding } = useAddUser();
  const { users, isLoading: isLoadingUsers, refetch } = useUser();
  const { updateUser, loading: isUpdating } = useUpdateUser();

  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (item: Datum) => {
    setEditingItem(item);
    setIsRoleFormOpen(false);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setIsRoleFormOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (data: UserFormData) => {
    if (isSaving) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      if (editingItem) {
        await updateUser(
          editingItem.id,
          data.username || "",
          data.password || "",
          "true",
          parseInt(data.Role_id || "1"),
        );
      } else {
        await addUser(
          data.username || "",
          data.password || "",
          data.Role_id || "1",
        );
      }
      refetch();
      handleClose();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRole = async (data: RoleFormData) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Role Saved:", data);
    setIsSaving(false);
    handleClose();
    alert("Rol guardado (simulado, ver consola)");
  };

  const handleDelete = async (item: Datum) => {
    if (confirm(`¿Estás seguro de eliminar a ${item.username}?`)) {
      try {
        await updateUser(
          item.id,
          item.username,
          item.password,
          "false",
          item.Role_id,
        );
        alert("Usuario eliminado correctamente");
        refetch();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar usuario");
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <ProviderHeader
          onOpenForm={() => {
            setEditingItem(null);
            setIsRoleFormOpen(false);
            setIsFormOpen(true);
          }}
          onOpenRoleForm={() => {
            setEditingItem(null);
            setIsFormOpen(false);
            setIsRoleFormOpen(true);
          }}
        />

        {isFormOpen && (
          <UsersForm
            onSave={handleSave}
            onCancel={handleClose}
            initialData={editingItem}
            isLoading={isSaving}
          />
        )}

        {isRoleFormOpen && (
          <RolesForm
            onSave={handleSaveRole}
            onCancel={handleClose}
            isLoading={isSaving}
          />
        )}

        <UsersTable
          onEdit={handleEdit}
          onDelete={handleDelete}
          users={users}
          isLoading={isLoadingUsers}
        />
      </div>
    </Card>
  );
}
