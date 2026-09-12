"use client";

import { useMemo } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { type Datum as AccountDatum } from "../../plan-cuentas/interfaces/getaccount.interface";
import { type Datum as ElementDatum } from "../../plan-cuentas/interfaces/getelements.interface";
import { type Datum as AsientoDatum } from "../interfaces/getasientobyperiod.interface";

interface BalanceGeneralTabProps {
  periodo: string;
  elements: ElementDatum[];
  accounts: AccountDatum[];
  asientos: AsientoDatum[];
}

export default function BalanceGeneralTab({
  periodo,
  elements,
  accounts,
  asientos,
}: BalanceGeneralTabProps) {
  const [selectedAccount, setSelectedAccount] = useState<{
    id: number;
    name: string;
    currency?: string;
  } | null>(null);

  const formatCurrency = (value: number, currency?: string) => {
    if (!currency) {
      return "-";
    }

    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  const accountCurrencyById = useMemo(
    () => new Map(accounts.map((account) => [account.id, account.money_type])),
    [accounts],
  );

  const resolveCurrency = (currencyList: Array<string | undefined>) => {
    const currencies = Array.from(
      new Set(
        currencyList.filter((currency): currency is string =>
          Boolean(currency),
        ),
      ),
    );

    return currencies.length === 1 ? currencies[0] : undefined;
  };

  const accountTotals = asientos.reduce<Record<number, number>>(
    (accumulator, asiento) => {
      const currentTotal = asiento.amount_credit - asiento.amount_debit;
      accumulator[asiento.Account_id] =
        (accumulator[asiento.Account_id] ?? 0) + currentTotal;
      return accumulator;
    },
    {},
  );

  const selectedAccountEntries = selectedAccount
    ? asientos.filter((asiento) => asiento.Account_id === selectedAccount.id)
    : [];
  const selectedAccountTotals = selectedAccountEntries.reduce(
    (totals, asiento) => ({
      debit: totals.debit + asiento.amount_debit,
      credit: totals.credit + asiento.amount_credit,
    }),
    { debit: 0, credit: 0 },
  );
  const selectedAccountBalance =
    selectedAccountTotals.credit - selectedAccountTotals.debit;

  const formatDate = (value: Date) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : new Intl.DateTimeFormat("es-ES", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(date);
  };

  const groupedElements = ["activo", "pasivo", "patrimonio"].map((group) => {
    const matchedElements = elements.filter((element) =>
      element.name.toLowerCase().includes(group),
    );

    const items = matchedElements.map((element) => {
      const elementAccounts = accounts.filter(
        (account) => account.Elements_id === element.id,
      );
      const elementCurrency = resolveCurrency(
        elementAccounts.map((account) => accountCurrencyById.get(account.id)),
      );

      const total = elementAccounts.reduce(
        (sum, account) => sum + (accountTotals[account.id] ?? 0),
        0,
      );

      return {
        ...element,
        total,
        currency: elementCurrency,
        accounts: elementAccounts.map((account) => ({
          ...account,
          total: accountTotals[account.id] ?? 0,
          currency: accountCurrencyById.get(account.id),
        })),
      };
    });

    const total = items.reduce((sum, element) => sum + element.total, 0);
    const currency = resolveCurrency(items.map((item) => item.currency));

    return {
      title: group.toUpperCase(),
      total,
      currency,
      items,
    };
  });

  const totalActivos = groupedElements[0]?.total ?? 0;
  const totalPasivos = groupedElements[1]?.total ?? 0;
  const totalPatrimonio = groupedElements[2]?.total ?? 0;
  const verificacion = totalActivos - totalPasivos - totalPatrimonio;

  const handleExportPDF = () => {
    console.log("Exportando PDF del balance...");
    alert(`Balance General ${periodo} exportado`);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto p-2 tracking-tight">
      {/* Título y Período */}
      <div className=" pb-2">
        <h2 className="text-xl font-bold text-primary flex items-baseline">
          Balance General - {periodo}
        </h2>
      </div>

      {/* Contenedor principal por secciones reales */}
      <div className="grid gap-5 lg:grid-cols-3">
        {groupedElements.map((section) => (
          <Card
            key={section.title}
            className="shadow-sm border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <CardContent className="p-5 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 border-b border-rose-100/80 pb-2.5 mb-4">
                  {section.title}
                </h3>

                <div className="space-y-4">
                  {section.items.length > 0 ? (
                    section.items.map((element) => (
                      <div key={element.id} className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-semibold text-gray-700 truncate max-w-[65%]">
                            {element.name}
                          </p>
                          <span className="text-sm font-bold text-gray-900 tabular-nums">
                            {formatCurrency(element.total, element.currency)}
                          </span>
                        </div>

                        <div className="space-y-1.5 border-l-2 border-gray-100 pl-3">
                          {element.accounts.length > 0 ? (
                            element.accounts.map((account) => (
                              <button
                                key={account.id}
                                type="button"
                                onClick={() =>
                                  setSelectedAccount({
                                    id: account.id,
                                    name: account.name,
                                    currency: account.currency,
                                  })
                                }
                                className="flex w-full items-center justify-between text-left text-sm py-0.5 rounded-md px-1 -mx-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              >
                                <span className="text-gray-500 font-normal truncate max-w-[70%]">
                                  {account.name}
                                </span>
                                <span
                                  className={`font-mono tabular-nums ${
                                    account.total < 0
                                      ? "text-rose-600 font-semibold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {formatCurrency(
                                    account.total,
                                    account.currency,
                                  )}
                                </span>
                              </button>
                            ))
                          ) : (
                            <p className="text-xs italic text-gray-400 py-1">
                              No hay cuentas asociadas
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No hay elementos registrados para esta sección.
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3.5 mt-6">
                <div className="flex justify-between items-baseline font-bold text-base text-gray-900">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Total {section.title}
                  </span>
                  <span className="text-lg font-extrabold tabular-nums text-gray-900">
                    {formatCurrency(section.total, section.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen de Totales */}
      <Card className="bg-gray-50/40 border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Activos
                </p>
                <p className="text-xl font-extrabold text-gray-900 mt-1 tabular-nums">
                  {formatCurrency(totalActivos, groupedElements[0]?.currency)}
                </p>
              </div>
              <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Pasivos
                </p>
                <p className="text-xl font-extrabold text-gray-900 mt-1 tabular-nums">
                  {formatCurrency(totalPasivos, groupedElements[1]?.currency)}
                </p>
              </div>
              <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Patrimonio
                </p>
                <p className="text-xl font-extrabold text-gray-900 mt-1 tabular-nums">
                  {formatCurrency(
                    totalPatrimonio,
                    groupedElements[2]?.currency,
                  )}
                </p>
              </div>
              <div className="w-1.5 h-10 bg-blue-500 rounded-full" />
            </div>
          </div>

          <div className="mt-4 bg-white border border-gray-100 rounded-xl px-4 py-3 flex justify-between items-center text-sm shadow-sm">
            <span className="font-semibold text-gray-600 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${verificacion === 0 ? "bg-emerald-500" : "bg-rose-500"}`}
              />
              Verificación Cuadrante
            </span>
            <span className="font-mono font-bold text-gray-900 text-base tabular-nums">
              {formatCurrency(verificacion, groupedElements[0]?.currency)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Botón Exportar */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleExportPDF}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all rounded-lg px-5 py-2.5"
        >
          Exportar PDF
        </Button>
      </div>

      <Modal
        isOpen={selectedAccount !== null}
        onClose={() => setSelectedAccount(null)}
        title={selectedAccount ? `Detalle: ${selectedAccount.name}` : ""}
        size="lg"
      >
        <div className="space-y-4">
          {selectedAccountEntries.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-155 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Fecha</th>
                    <th className="px-3 py-2 font-semibold">Descripción</th>
                    <th className="px-3 py-2 text-right font-semibold">Debe</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Haber
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedAccountEntries.map((asiento) => {
                    const saldo = asiento.amount_credit - asiento.amount_debit;

                    return (
                      <tr key={asiento.id} className="text-gray-700">
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
                          {formatDate(asiento.created_at)}
                        </td>
                        <td className="px-3 py-2">
                          {asiento.description || "-"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatCurrency(
                            asiento.amount_debit,
                            selectedAccount?.currency,
                          )}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatCurrency(
                            asiento.amount_credit,
                            selectedAccount?.currency,
                          )}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-semibold tabular-nums ${
                            saldo < 0 ? "text-rose-600" : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(saldo, selectedAccount?.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-500">
              No hay movimientos para esta cuenta en el período seleccionado.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 bg-rose-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                Total Debe
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-900">
                {formatCurrency(
                  selectedAccountTotals.debit,
                  selectedAccount?.currency,
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-blue-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Total Haber
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-900">
                {formatCurrency(
                  selectedAccountTotals.credit,
                  selectedAccount?.currency,
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Saldo
              </p>
              <p
                className={`mt-1 text-lg font-bold tabular-nums ${
                  selectedAccountBalance < 0 ? "text-rose-600" : "text-gray-900"
                }`}
              >
                {formatCurrency(
                  selectedAccountBalance,
                  selectedAccount?.currency,
                )}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
