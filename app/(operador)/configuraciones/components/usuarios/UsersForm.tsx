"use client";
import React, { useState, useEffect } from "react";
import { Datum, UserFormData } from "../../interfaces/usuarios/user.interface";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectInput";
import { useRole } from "../../hooks/usuarios/useRole";

interface UsersFormProps {
  onSave: (data: UserFormData) => void;
  onCancel: () => void;
  initialData?: Datum | null;
  isLoading?: boolean;
}

export default function UsersForm({
  onSave,
  onCancel,
  initialData,
  isLoading = false,
}: UsersFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState("");
  const { roles, isLoading: isLoadingRoles } = useRole();
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    rolId?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username || "");
      setPassword(initialData.password || "");
      // Assuming initialData has Role_id. If not, we might need to match by name or fix initialData type/source
      setRolId(initialData.Role_id?.toString() || "");
    } else {
      setUsername("");
      setPassword("");
      setRolId("");
    }
  }, [initialData]);

  const handleSave = async () => {
    const newErrors: {
      username?: string;
      password?: string;
      rolId?: string;
    } = {};
    if (!username.trim()) newErrors.username = "El usuario es obligatorio";
    if (!password.trim()) newErrors.password = "La contraseña es obligatoria";
    if (!rolId.trim()) newErrors.rolId = "El rol es obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({
      ...initialData,
      username: username,
      password: password,
      Role_id: rolId,
      Role_name: roles.find((r) => r.id.toString() === rolId)?.name || "",
      Client_id: "1",
      Employee_id: "1",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top">
      <div className="max-w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              USUARIO
            </label>
            <InputField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              error={errors.username}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              CONTRASEÑA
            </label>
            <InputField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              error={errors.password}
              className="w-full"
              type="password"
            />
          </div>

          <div>
            <SelectField
              label="ROL"
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
              placeholder="Seleccionar rol..."
              error={errors.rolId}
              className="w-full"
              options={roles.map((role) => ({
                value: role.id.toString(),
                label: role.name,
              }))}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-start pt-2">
          <Button
            onClick={handleSave}
            variant="danger"
            leftIcon={!isLoading ? <SaveIcon className="h-4 w-4" /> : null}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>

          <Button onClick={onCancel} variant="ghost">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
