"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUpdateAccountingPeriod } from "../hooks/useUpdateAccountingPeriod";
import { Datum } from "../interfaces/getaccountingperiod.interface";

interface CerrarPeriodoModalProps {
  periodo: Datum | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CerrarPeriodoModal({
  periodo,
  isOpen,
  onClose,
  onSuccess,
}: CerrarPeriodoModalProps) {
  const { data: session } = useSession();
  const { updateAccountingPeriod, loading, error } =
    useUpdateAccountingPeriod();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!periodo) return null;

  const handleConfirmar = async () => {
    setErrorMessage(null);

    try {
      const currentUserId = session?.user?.id ? Number(session.user.id) : 2;

      await updateAccountingPeriod({
        id: periodo.id,
        name: periodo.name,
        active: "false",
        User_id: currentUserId,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Error al cerrar el período contable",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!loading) {
          setErrorMessage(null);
          onClose();
        }
      }}
      title="Cerrar Período Contable"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-700 text-sm">
          ¿Estás seguro de que deseas cerrar el período contable{" "}
          <strong className="text-gray-900 font-semibold">
            {periodo.name}
          </strong>
          ?
        </p>

        {(errorMessage || error) && (
          <div className="text-sm p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errorMessage || error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirmar}
            loading={loading}
          >
            Confirmar Cierre
          </Button>
        </div>
      </div>
    </Modal>
  );
}
