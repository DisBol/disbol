"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import type { JournalLine } from "../interfaces/nuevo-asiento.interface";
import type { Datum } from "../../cierre-periodo/interfaces/getaccountingperiod.interface";

interface NuevoAsientoTabProps {
  journalLines: JournalLine[];
  selectedPeriodId: string;
  onPeriodChange: (value: string) => void;
  accountingPeriods: Datum[];
  loadingPeriods: boolean;
  autoEditLineId?: string | null;
  accountOptions: SelectOption[];
  debitTotal: number;
  creditTotal: number;
  balanced: boolean;
  onAddLine: () => void;
  onSaveDraft: (state: "borrador" | "aprobado") => void;
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
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 xl:hidden">
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function NuevoAsientoTab({
  journalLines,
  selectedPeriodId,
  onPeriodChange,
  accountingPeriods,
  loadingPeriods,
  autoEditLineId,
  accountOptions,
  debitTotal,
  creditTotal,
  balanced,
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
    accountOptions.find((option) => option.value === String(accountId))
      ?.label ?? "—";

  const renderAccountLabel = (accountId: number | null) => {
    const label = getAccountLabel(accountId);
    if (label === "—") return <span className="text-slate-400">—</span>;
    const parts = label.split(" - ");
    if (parts.length >= 2) {
      const code = parts[0];
      const name = parts.slice(1).join(" - ");
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 ring-1 ring-slate-200 select-all">
            {code}
          </span>
          <span className="text-sm font-semibold text-slate-900 break-words leading-tight">
            {name}
          </span>
        </div>
      );
    }
    return <span className="text-sm font-semibold text-slate-900 break-words leading-tight">{label}</span>;
  };

  const periodOptions = React.useMemo(
    (): SelectOption[] =>
      accountingPeriods.map((period) => ({
        value: String(period.id),
        label: period.name,
      })),
    [accountingPeriods],
  );

  return (
    <div className="space-y-5 px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Select
          label="Fecha"
          options={periodOptions}
          selectedValues={selectedPeriodId ? [selectedPeriodId] : []}
          onSelect={(option) => onPeriodChange(option.value)}
          placeholder={
            loadingPeriods ? "Cargando períodos..." : "Seleccionar período"
          }
          disabled={loadingPeriods || periodOptions.length === 0}
          emptyMessage="No hay períodos disponibles"
          closeOnSelect
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
        <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 xl:grid xl:grid-cols-[110px_260px_minmax(0,1fr)_120px_120px_140px] xl:gap-4">
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
              {line.isNew ? (
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
              ) : (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Registrado
                </span>
              )}
            </div>

            <div className="grid gap-4 xl:grid-cols-[110px_260px_minmax(0,1fr)_120px_120px_140px] xl:items-start">
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
                  <div className="rounded-md border border-transparent py-2 text-sm text-slate-700">
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
                  <div className="rounded-md border border-transparent py-2">
                    {renderAccountLabel(line.accountId)}
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
                  <div className="rounded-md border border-transparent py-2 text-sm text-slate-600 italic break-words leading-relaxed">
                    {line.glosa || <span className="text-slate-400 italic">—</span>}
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
                  <div className="rounded-md border border-transparent py-2 text-right text-sm font-semibold tabular-nums text-slate-700">
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
                  <div className="rounded-md border border-transparent py-2 text-right text-sm font-semibold tabular-nums text-slate-700">
                    {formatAmount(line.credit)}
                  </div>
                )}
              </FieldBlock>

              <FieldBlock label="Acciones">
                {line.isNew ? (
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
                ) : (
                  <div className="hidden xl:flex xl:justify-center">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Registrado
                    </span>
                  </div>
                )}
                {line.isNew ? (
                  <div className="xl:hidden text-sm text-slate-500">
                    Usa los botones de la cabecera de la línea
                  </div>
                ) : (
                  <div className="xl:hidden text-sm text-emerald-600 font-semibold">
                    Asiento ya registrado en base de datos
                  </div>
                )}
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
            onClick={() => onSaveDraft("borrador")}
            loading={savingDraft}
          >
            Guardar como Borrador
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
            onClick={() => onSaveDraft("aprobado")}
            loading={savingDraft}
          >
            Guardar y Aprobar
          </Button>
        </div>
      </div>
    </div>
  );
}
