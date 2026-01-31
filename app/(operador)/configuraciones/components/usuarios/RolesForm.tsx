"use client";
import React, { useState, useEffect } from "react";
import { SaveIcon } from "@/components/icons/Save";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useTransaction } from "../../hooks/usuarios/useTransaction";
import { useAddRole } from "../../hooks/usuarios/useAddRole";
import { useAddTransactionRole } from "../../hooks/usuarios/useAddTransactionRole";

interface RolesFormProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RolesForm({
  onSave,
  onCancel,
  isLoading: initialLoading = false,
}: RolesFormProps) {
  const [roleName, setRoleName] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    [],
  );

  const {
    transactions,
    getTransactions,
    isLoading: isLoadingTransactions,
  } = useTransaction();
  const { addRole, isLoading: isAddingRole } = useAddRole();
  const { addTransactionRole, isLoading: isAddingTransaction } =
    useAddTransactionRole();

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const handleCheckboxChange = (id: number) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      alert("El nombre del rol es obligatorio");
      return;
    }

    // 1. Create Role
    const roleResponse = await addRole(roleName);

    if (roleResponse && roleResponse.data && roleResponse.data.lastID) {
      const newRoleId = roleResponse.data.lastID;

      // 2. Assign Transactions
      // We process them sequentially or in parallel. Parallel is faster.
      const transactionPromises = selectedTransactions.map((transactionId) =>
        addTransactionRole(transactionId, newRoleId),
      );

      await Promise.all(transactionPromises);

      // 3. Finish
      onSave();
    } else {
      alert("Error al crear el rol");
    }
  };

  const isLoading =
    initialLoading ||
    isLoadingTransactions ||
    isAddingRole ||
    isAddingTransaction;

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
            {isLoadingTransactions ? (
              <div className="col-span-full text-sm text-gray-500">
                Cargando pantallas...
              </div>
            ) : (
              transactions.map((transaction) => (
                <Checkbox
                  key={transaction.id}
                  label={transaction.name}
                  checked={selectedTransactions.includes(transaction.id)}
                  onChange={() => handleCheckboxChange(transaction.id)}
                />
              ))
            )}
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
