"use client";

import { Button } from "@/components/ui/Button";
import { DocumentIcon } from "@/components/icons/DocumentIcon";
import { ClockCircleIcon } from "@/components/icons/ClockCircleIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import type { DraftEntry } from "../interfaces/nuevo-asiento.interface";

interface BorradoresTabProps {
  entries: DraftEntry[];
  loading?: boolean;
  error?: string | null;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDateTime = (value: string) => {
  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export function BorradoresTab({ entries, loading, error }: BorradoresTabProps) {
  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
        <div className="mb-5 flex items-center gap-2 text-rose-500">
          <ClockCircleIcon className="h-6 w-6" strokeWidth={1.8} />
          <h3 className="text-xl font-bold">Asientos en Borrador</h3>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            Cargando asientos...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="max-h-[calc(100vh-280px)] space-y-5 overflow-y-auto pr-2">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:px-5 sm:py-5"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Factura
                      </span>
                      <span className="text-sm text-slate-500">
                        ID: {entry.id}
                      </span>
                    </div>

                    <h4 className="mb-2 text-xl font-bold tracking-tight text-rose-600">
                      {entry.description}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                          {formatDateTime(entry.created_at)}
                        </span>
                      </div>

                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Activo: {entry.active}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="md"
                    leftIcon={
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    className="rounded-xl bg-rose-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700"
                  >
                    Aprobar
                  </Button>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4 sm:px-5">
                  <p className="mb-4 text-sm font-medium text-slate-900">
                    Resumen del asiento:
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Débito
                      </div>
                      <div className="mt-1 text-sm font-semibold text-rose-500">
                        Bs {formatAmount(entry.amount_debit)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Crédito
                      </div>
                      <div className="mt-1 text-sm font-semibold text-emerald-500">
                        Bs {formatAmount(entry.amount_credit)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Cuenta / Período
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        {entry.Account_id} / {entry.AccountingPeriod_id}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12">
            <DocumentIcon
              className="mb-3 h-12 w-12 text-slate-400"
              strokeWidth={1.5}
            />
            <p className="text-slate-500">No hay asientos en borrador</p>
          </div>
        )}
      </section>
    </div>
  );
}
