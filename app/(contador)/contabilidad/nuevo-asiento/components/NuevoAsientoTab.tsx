"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";

export type JournalLine = {
  id: string;
  date: string;
  accountId: number | null;
  glosa: string;
  debit: number;
  credit: number;
};

interface NuevoAsientoTabProps {
  journalLines: JournalLine[];
  entryDate: string;
  autoEditLineId?: string | null;
  accountOptions: SelectOption[];
  debitTotal: number;
  creditTotal: number;
  balanced: boolean;
  onEntryDateChange: (value: string) => void;
  onAddLine: () => void;
  onSaveDraft: () => void;
  savingDraft?: boolean;
  onUpdateLine: (
    id: string,
    field: keyof Omit<JournalLine, "id">,
    value: string | number,
  ) => void;
  onRemoveLine: (id: string) => void;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function NuevoAsientoTab({
  journalLines,
  entryDate,
  autoEditLineId,
  accountOptions,
  debitTotal,
  creditTotal,
  balanced,
  onEntryDateChange,
  onAddLine,
  onSaveDraft,
  savingDraft,
  onUpdateLine,
  onRemoveLine,
}: NuevoAsientoTabProps) {
  const [editingLineIds, setEditingLineIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!autoEditLineId) {
      return;
    }

    setEditingLineIds((currentIds) =>
      currentIds.includes(autoEditLineId)
        ? currentIds
        : [...currentIds, autoEditLineId],
    );
  }, [autoEditLineId]);

  const isEditingLine = (id: string) => editingLineIds.includes(id);

  const startEditingLine = (id: string) => {
    setEditingLineIds((currentIds) =>
      currentIds.includes(id) ? currentIds : [...currentIds, id],
    );
  };

  const stopEditingLine = (id: string) => {
    setEditingLineIds((currentIds) =>
      currentIds.filter((lineId) => lineId !== id),
    );
  };

  const getAccountLabel = (accountId: number | null) =>
    accountOptions.find((option) => option.value === String(accountId))?.label ??
    "—";

  return (
    <div className="space-y-5 px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <DateField
          label="Fecha"
          value={entryDate}
          onChange={(event) => onEntryDateChange(event.target.value)}
          className="rounded-lg bg-white"
          size="md"
          radius="md"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-primary">Líneas del Asiento</h2>
        <Button
          type="button"
          variant="secondary"
          className="rounded-xl bg-slate-800 text-white hover:bg-slate-700"
          onClick={onAddLine}
        >
          + Añadir Línea
        </Button>
      </div>

      <div className="space-y-4">
        <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 xl:grid xl:grid-cols-[140px_240px_minmax(0,1fr)_140px_140px_170px] xl:gap-4">
          <div>Fecha</div>
          <div>Cuenta</div>
          <div>Glosa</div>
          <div className="text-right">Débito (BOB)</div>
          <div className="text-right">Crédito (BOB)</div>
          <div className="text-center">Acciones</div>
        </div>

        {journalLines.map((line, index) => (
          <div
            key={line.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3 xl:hidden">
              <div className="text-sm font-semibold text-slate-700">
                Línea {index + 1}
              </div>
              <div className="flex gap-2">
                {isEditingLine(line.id) ? (
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-md bg-green-600! text-white! shadow-sm hover:bg-green-700!"
                    onClick={() => stopEditingLine(line.id)}
                  >
                    Guardar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-md bg-violet-500 hover:bg-violet-600"
                    onClick={() => startEditingLine(line.id)}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="rounded-md"
                  onClick={() => onRemoveLine(line.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[140px_240px_minmax(0,1fr)_140px_140px_170px] xl:items-start">
              <FieldBlock label="Fecha">
                {isEditingLine(line.id) ? (
                  <DateField
                    value={line.date}
                    onChange={(event) =>
                      onUpdateLine(line.id, "date", event.target.value)
                    }
                    className="rounded-md bg-white"
                    size="sm"
                    radius="md"
                    showCalendarIcon
                  />
                ) : (
                  <div className="rounded-md border border-transparent px-3 py-2 text-sm text-slate-700">
                    {line.date}
                  </div>
                )}
              </FieldBlock>

              <FieldBlock label="Cuenta">
                {isEditingLine(line.id) ? (
                  <Select
                    options={accountOptions}
                    selectedValues={
                      line.accountId !== null ? [String(line.accountId)] : []
                    }
                    onSelect={(option) =>
                      onUpdateLine(line.id, "accountId", Number(option.value))
                    }
                    placeholder="Seleccionar cuenta"
                    size="sm"
                    radius="md"
                    closeOnSelect
                    className="rounded-md"
                    disabled={accountOptions.length === 0}
                  />
                ) : (
                  <div className="rounded-md border border-transparent px-3 py-2 text-sm text-slate-700">
                    {getAccountLabel(line.accountId)}
                  </div>
                )}
              </FieldBlock>

              <FieldBlock label="Glosa">
                {isEditingLine(line.id) ? (
                  <Input
                    value={line.glosa}
                    onChange={(event) =>
                      onUpdateLine(line.id, "glosa", event.target.value)
                    }
                    placeholder="Glosa"
                    className="rounded-md"
                    inputSize="sm"
                  />
                ) : (
                  <div className="rounded-md border border-transparent px-3 py-2 text-sm text-slate-700">
                    {line.glosa || "—"}
                  </div>
                )}
              </FieldBlock>

              <FieldBlock label="Débito (BOB)">
                {isEditingLine(line.id) ? (
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={String(line.debit)}
                    onChange={(event) =>
                      onUpdateLine(
                        line.id,
                        "debit",
                        Number(event.target.value || 0),
                      )
                    }
                    placeholder="0"
                    className="rounded-md text-right tabular-nums"
                    inputSize="sm"
                  />
                ) : (
                  <div className="rounded-md border border-transparent px-3 py-2 text-right text-sm tabular-nums text-slate-700">
                    {formatAmount(line.debit)}
                  </div>
                )}
              </FieldBlock>

              <FieldBlock label="Crédito (BOB)">
                {isEditingLine(line.id) ? (
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={String(line.credit)}
                    onChange={(event) =>
                      onUpdateLine(
                        line.id,
                        "credit",
                        Number(event.target.value || 0),
                      )
                    }
                    placeholder="0"
                    className="rounded-md text-right tabular-nums"
                    inputSize="sm"
                  />
                ) : (
                  <div className="rounded-md border border-transparent px-3 py-2 text-right text-sm tabular-nums text-slate-700">
                    {formatAmount(line.credit)}
                  </div>
                )}
              </FieldBlock>

              <FieldBlock label="Acciones">
                <div className="hidden flex-wrap gap-2 xl:flex xl:justify-center">
                  {isEditingLine(line.id) ? (
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-md bg-green-600! text-white! shadow-sm hover:bg-green-700!"
                      onClick={() => stopEditingLine(line.id)}
                    >
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-md bg-violet-500 hover:bg-violet-600"
                      onClick={() => startEditingLine(line.id)}
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="rounded-md"
                    onClick={() => onRemoveLine(line.id)}
                  >
                    Eliminar
                  </Button>
                </div>
                <div className="xl:hidden text-sm text-slate-500">
                  Usa los botones de la cabecera de la línea
                </div>
              </FieldBlock>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div
          className={`max-w-md rounded-xl border px-5 py-4 ${
            balanced
              ? "border-emerald-400 bg-emerald-50"
              : "border-amber-300 bg-amber-50"
          }`}
        >
          <p className="text-center text-sm font-medium text-emerald-700">
            {balanced ? "✓ Asiento Balanceado" : "Asiento Descuadrado"}
          </p>
          <p className="mt-2 text-lg font-bold text-primary">
            Débito: Bs {formatAmount(debitTotal)} | Crédito: Bs{" "}
            {formatAmount(creditTotal)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={onSaveDraft}
            loading={savingDraft}
          >
            Guardar como Borrador
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
          >
            Guardar y Aprobar
          </Button>
        </div>
      </div>
    </div>
  );
}
