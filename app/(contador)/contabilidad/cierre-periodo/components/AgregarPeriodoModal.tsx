"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAddAccountingPeriod } from "../hooks/useAddAccountingPeriod";

interface AgregarPeriodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AgregarPeriodoModal({
  isOpen,
  onClose,
  onSuccess,
}: AgregarPeriodoModalProps) {
  const { data: session } = useSession();
  const { addAccountingPeriod, loading, error: apiError } = useAddAccountingPeriod();

  const [name, setName] = useState("");
  const [active, setActive] = useState<string>("true");
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setActive("true");
    setFormError(null);
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError("El nombre del período es requerido");
      return;
    }

    setFormError(null);

    try {
      const currentUserId = session?.user?.id ? Number(session.user.id) : 2;

      await addAccountingPeriod({
        name: name.trim(),
        active,
        User_id: currentUserId,
      });

      resetForm();
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch {
      // Error handled by hook apiError
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar Período Contable"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Período <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ej. Enero, Febrero 2026..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formError) setFormError(null);
            }}
            disabled={loading}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        {(formError || apiError) && (
          <div className="text-sm p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {formError || apiError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Guardar Período
          </Button>
        </div>
      </form>
    </Modal>
  );
}
