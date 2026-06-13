"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputField } from "@/components/ui/InputField";
import {
  SelectField,
  SelectInput,
  type SelectOption,
} from "@/components/ui/SelectInput";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { Employee } from "../interface";
import {
  GetPosition,
  type PositionItem,
} from "@/app/(contador)/planillas/empleados/services/getposition";

interface NuevoEmpleadoFormProps {
  empleado?: Employee | null;
  onGuardar?: (empleado: Employee) => void;
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
  const [estado, setEstado] = useState("true");
  const [positionId, setPositionId] = useState(3);
  const [salario, setSalario] = useState("0");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [positionOptions, setPositionOptions] = useState<SelectOption[]>([]);
  const [positionLoading, setPositionLoading] = useState(false);

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
      console.log("NuevoEmpleadoForm: editing employee:", empleado);
      setId(empleado.id);
      setNombre(empleado.name);
      setDni(empleado.document);
      setEstado(empleado.active);
      setPositionId(empleado.Position_id || 3);
      setSalario(String(empleado.Salary_amount ?? 0));
    }
  }, [empleado]);

  useEffect(() => {
    let active = true;

    const loadPositions = async () => {
      try {
        setPositionLoading(true);
        const response = await GetPosition("true");

        if (!active) return;

        const options = response.data.map((position: PositionItem) => ({
          value: String(position.id),
          label: position.name,
        }));

        setPositionOptions(options);

        if (!empleado && options.length > 0) {
          setPositionId(Number(options[0].value));
        }
      } catch {
        if (!active) return;

        setPositionOptions([]);
      } finally {
        if (active) {
          setPositionLoading(false);
        }
      }
    };

    void loadPositions();

    return () => {
      active = false;
    };
  }, [empleado]);

  const handleGuardar = async () => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!dni.trim()) newErrors.dni = "El DNI es requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditMode && id && empleado) {
      const nameChanged = nombre.trim() !== empleado.name;
      const documentChanged = dni.trim() !== empleado.document;
      const activeChanged = estado !== empleado.active;
      const positionChanged = positionId !== (empleado.Position_id || 3);
      const salaryChanged = Number(salario) !== (empleado.Salary_amount ?? 0);

      const employeeInfoChanged = nameChanged || documentChanged || activeChanged || positionChanged;
      const salaryInfoChanged = salaryChanged;

      const salaryId = empleado.Salary_id || empleado.salary_id || empleado.SalaryId || empleado.salaryId;
      let resultado;

      if (employeeInfoChanged && salaryInfoChanged) {
        resultado = await updateEmployee(
          id,
          nombre,
          dni,
          estado,
          positionId,
          Number(salario) || 0,
          salaryId,
        );
      } else if (employeeInfoChanged) {
        resultado = await updateEmployee(
          id,
          nombre,
          dni,
          estado,
          positionId,
        );
      } else if (salaryInfoChanged) {
        resultado = await updateEmployee(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          Number(salario) || 0,
          salaryId,
        );
      } else {
        handleCancel();
        return;
      }

      const hasSuccess = resultado?.success || resultado?.data || (resultado as any)?.id;
      const responseData = Array.isArray(resultado?.data) ? resultado?.data[0] : (resultado?.data || (resultado as any));
      const employeeId = Number(responseData?.Employee_id || responseData?.id || id);

      if (hasSuccess && employeeId) {
        // Retornar el objeto Employee actualizado
        const cargoLabel = positionOptions.find(
          (opt) => Number(opt.value) === positionId,
        )?.label;
        const empleadoActualizado: Employee = {
          id: employeeId,
          name: responseData?.name || nombre,
          document: responseData?.document || dni,
          active: responseData?.active || estado,
          Position_id: responseData?.Position_id || positionId,
          created_at: responseData?.created_at || empleado.created_at || new Date().toISOString(),
          updated_at: responseData?.updated_at || new Date().toISOString(),
          Salary_amount: Number(salario) || undefined,
          Position_name: cargoLabel || empleado.Position_name,
          Salary_id: responseData?.Salary_id || responseData?.salary_id || responseData?.SalaryId || responseData?.salaryId || salaryId,
        };

        if (onGuardar) {
          onGuardar(empleadoActualizado);
        }
        handleCancel();
      }
    } else {
      // Modo crear
      const resultado = await addEmployee(
        nombre,
        dni,
        "true",
        positionId,
        Number(salario) || 0,
      );

      const hasSuccess = resultado?.success || resultado?.data || (resultado as any)?.id;
      const responseData = Array.isArray(resultado?.data) ? resultado?.data[0] : (resultado?.data || (resultado as any));
      const employeeId = Number(responseData?.Employee_id || responseData?.id);

      if (hasSuccess && employeeId) {
        // Retornar el objeto Employee
        const cargoLabel = positionOptions.find(
          (opt) => Number(opt.value) === positionId,
        )?.label;
        const nuevoEmpleado: Employee = {
          id: employeeId,
          name: responseData?.name || nombre,
          document: responseData?.document || dni,
          active: responseData?.active || "true",
          Position_id: responseData?.Position_id || positionId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          Salary_amount: responseData?.amount || Number(salario) || undefined,
          Position_name: cargoLabel,
          Salary_id: responseData?.Salary_id || responseData?.salary_id || responseData?.SalaryId || responseData?.salaryId,
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

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer pl-0.5">
              Cargo
            </label>
            <SelectInput
              value={String(positionId)}
              onChange={(e) => setPositionId(Number(e.target.value))}
              options={positionOptions}
              placeholder={
                positionLoading ? "Cargando cargos..." : "Selecciona un cargo"
              }
              disabled={positionLoading || positionOptions.length === 0}
            />
          </div>

          <SelectField
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
