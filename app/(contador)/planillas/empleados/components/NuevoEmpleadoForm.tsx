"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputField } from "@/components/ui/InputField";
import { SelectInput } from "@/components/ui/SelectInput";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { Employee } from "../interface";

interface NuevoEmpleadoFormProps {
  empleado?: Employee | null;
  onGuardar?: (empleado: any) => void;
  onCancelar?: () => void;
}

export default function NuevoEmpleadoForm({
  empleado,
  onGuardar,
  onCancelar,
}: NuevoEmpleadoFormProps) {
  const [id, setId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("true");
  const [positionId, setPositionId] = useState(3);
  const [salario, setSalario] = useState("0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    addEmployee,
    loading: loadingAdd,
    error: errorAdd,
  } = useAddEmployee();
  const {
    updateEmployee,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateEmployee();

  const isEditMode = !!empleado;
  const loading = isEditMode ? loadingUpdate : loadingAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  useEffect(() => {
    if (empleado) {
      setId(empleado.id);
      setNombre(empleado.name);
      setDni(empleado.document);
      setEstado(empleado.active);
      setPositionId(empleado.Position_id || 3);
      setCargo("Empleado");
    }
  }, [empleado]);

  const handleGuardar = async () => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!dni.trim()) newErrors.dni = "El DNI es requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditMode && id) {
      // Modo edición
      const resultado = await updateEmployee(
        id,
        nombre,
        dni,
        estado,
        positionId,
      );

      if (resultado?.success) {
        // Retornar el objeto Employee actualizado
        const empleadoActualizado: Employee = {
          id: resultado.data?.id || id,
          name: resultado.data?.name || nombre,
          document: resultado.data?.document || dni,
          active: resultado.data?.active || estado,
          Position_id: resultado.data?.Position_id || positionId,
          created_at: resultado.data?.created_at || new Date().toISOString(),
          updated_at: resultado.data?.updated_at || new Date().toISOString(),
        };

        if (onGuardar) {
          onGuardar(empleadoActualizado);
        }
        handleCancel();
      }
    } else {
      // Modo crear
      const resultado = await addEmployee(nombre, dni, "true", positionId);

      if (resultado?.success && resultado?.data) {
        // Retornar el objeto Employee
        const nuevoEmpleado: Employee = {
          id: resultado.data.id,
          name: resultado.data.name,
          document: resultado.data.document,
          active: resultado.data.active,
          Position_id: resultado.data.Position_id,
          created_at: resultado.data.created_at || new Date().toISOString(),
          updated_at: resultado.data.updated_at || new Date().toISOString(),
        };

        if (onGuardar) {
          onGuardar(nuevoEmpleado);
        }

        handleCancel();
      }
    }
  };

  const handleCancel = () => {
    setId(null);
    setNombre("");
    setDni("");
    setCargo("");
    setEstado("true");
    setPositionId(3);
    setSalario("0");
    setErrors({});
    if (onCancelar) {
      onCancelar();
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {isEditMode ? "Editar Empleado" : "Nuevo Empleado"}
        </h2>

        <div className="space-y-4">
          <InputField
            label="Nombre"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errors.nombre) {
                setErrors({ ...errors, nombre: "" });
              }
            }}
            error={errors.nombre}
            required
          />

          <InputField
            label="DNI"
            placeholder="DNI"
            value={dni}
            onChange={(e) => {
              setDni(e.target.value);
              if (errors.dni) {
                setErrors({ ...errors, dni: "" });
              }
            }}
            error={errors.dni}
            required
          />

          <InputField
            label="Cargo"
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => {
              setCargo(e.target.value);
              if (errors.cargo) {
                setErrors({ ...errors, cargo: "" });
              }
            }}
            error={errors.cargo}
          />

          <SelectInput
            label="Estado"
            value={estado}
            onChange={(e) => setEstado((e.target as HTMLSelectElement).value)}
            options={[
              { value: "true", label: "Activo" },
              { value: "false", label: "Inactivo" },
            ]}
          />

          <InputField
            label="Salario"
            type="number"
            placeholder="0"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleGuardar}
            variant="danger"
            disabled={loading}
            loading={loading}
          >
            {isEditMode ? "Actualizar" : "Guardar"}
          </Button>
          <Button onClick={handleCancel} variant="danger" disabled={loading}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
