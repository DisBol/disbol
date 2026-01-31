"use client";
import React, { useState } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { RoleFormData } from "../../interfaces/usuarios/role.interface";

interface RolesFormProps {
  onSave: (data: RoleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RolesForm({
  onSave,
  onCancel,
  isLoading = false,
}: RolesFormProps) {
  const [roleName, setRoleName] = useState("");
  const [screens, setScreens] = useState({
    dashboard: false,
    consolidacion: false,
    asignaciones: false,
    seguimiento: false,
    canastos: false,
    appChofer: false,
    appCliente: false,
    contabilidad: false,
    rrhh: false,
    configuracion: false,
  });

  const handleScreenChange = (key: keyof typeof screens) => {
    setScreens((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      alert("El nombre del rol es obligatorio");
      return;
    }
    onSave({ roleName, screens });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in slide-in-from-top">
      <div className="max-w-full mx-auto space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            NOMBRE DEL ROL
          </label>
          <InputField
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder=""
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-4">
            PANTALLAS CON ACCESO
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Checkbox
              label="Dashboard"
              checked={screens.dashboard}
              onChange={() => handleScreenChange("dashboard")}
            />
            <Checkbox
              label="Consolidación"
              checked={screens.consolidacion}
              onChange={() => handleScreenChange("consolidacion")}
            />
            <Checkbox
              label="Asignaciones"
              checked={screens.asignaciones}
              onChange={() => handleScreenChange("asignaciones")}
            />
            <Checkbox
              label="Seguimiento"
              checked={screens.seguimiento}
              onChange={() => handleScreenChange("seguimiento")}
            />
            <Checkbox
              label="Canastos"
              checked={screens.canastos}
              onChange={() => handleScreenChange("canastos")}
            />
            <Checkbox
              label="App Chofer"
              checked={screens.appChofer}
              onChange={() => handleScreenChange("appChofer")}
            />
            <Checkbox
              label="App Cliente"
              checked={screens.appCliente}
              onChange={() => handleScreenChange("appCliente")}
            />
            <Checkbox
              label="Contabilidad"
              checked={screens.contabilidad}
              onChange={() => handleScreenChange("contabilidad")}
            />
            <Checkbox
              label="RRHH / Planillas"
              checked={screens.rrhh}
              onChange={() => handleScreenChange("rrhh")}
            />
            <Checkbox
              label="Configuración"
              checked={screens.configuracion}
              onChange={() => handleScreenChange("configuracion")}
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
            {isLoading ? "Guardando..." : "Guardar Rol"}
          </Button>

          <Button onClick={onCancel} variant="ghost" className="bg-gray-100">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
      />
      <span
        onClick={onChange}
        className="text-sm text-gray-600 cursor-pointer select-none"
      >
        {label}
      </span>
    </div>
  );
}
