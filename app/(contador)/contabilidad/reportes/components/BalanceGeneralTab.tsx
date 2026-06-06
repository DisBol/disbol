"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { type Datum as AccountDatum } from "../../plan-cuentas/interfaces/getaccount.interface";
import { type Datum as ElementDatum } from "../../plan-cuentas/interfaces/getelements.interface";
import { type Datum as AsientoDatum } from "../../nuevo-asiento/interfaces/getasiento.interface";

interface BalanceGeneralTabProps {
  periodo: string;
  periodoId: number | null;
  elements: ElementDatum[];
  accounts: AccountDatum[];
  asientos: AsientoDatum[];
}

export default function BalanceGeneralTab({
  periodo,
  periodoId,
  elements,
  accounts,
  asientos,
}: BalanceGeneralTabProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const filteredAsientos = useMemo(
    () =>
      periodoId === null
        ? []
        : asientos.filter(
            (asiento) => asiento.AccountingPeriod_id === periodoId,
          ),
    [asientos, periodoId],
  );

  const accountTotals = useMemo(() => {
    return filteredAsientos.reduce<Record<number, number>>(
      (accumulator, asiento) => {
        const currentTotal = asiento.amount_credit - asiento.amount_debit;
        accumulator[asiento.Account_id] =
          (accumulator[asiento.Account_id] ?? 0) + currentTotal;
        return accumulator;
      },
      {},
    );
  }, [filteredAsientos]);

  const groupedElements = ["activo", "pasivo", "patrimonio"].map((group) => {
    const matchedElements = elements.filter((element) =>
      element.name.toLowerCase().includes(group),
    );

    const items = matchedElements.map((element) => {
      const elementAccounts = accounts.filter(
        (account) => account.Elements_id === element.id,
      );

      const total = elementAccounts.reduce(
        (sum, account) => sum + (accountTotals[account.id] ?? 0),
        0,
      );

      return {
        ...element,
        total,
        accounts: elementAccounts.map((account) => ({
          ...account,
          total: accountTotals[account.id] ?? 0,
        })),
      };
    });

    const total = items.reduce((sum, element) => sum + element.total, 0);

    return {
      title: group.toUpperCase(),
      total,
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
    <div className="space-y-8">
      {/* Título */}
      <h2 className="text-2xl font-bold text-red-600">
        Balance General - {periodo}
      </h2>

      {/* Contenedor principal por secciones reales */}
      <div className="grid gap-6 lg:grid-cols-3">
        {groupedElements.map((section) => (
          <Card key={section.title}>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-red-600 mb-6">
                {section.title}
              </h3>

              <div className="space-y-6">
                {section.items.length > 0 ? (
                  section.items.map((element) => (
                    <div key={element.id} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {element.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          Total: {formatCurrency(element.total)}
                        </span>
                      </div>

                      <div className="space-y-2 pl-1">
                        {element.accounts.length > 0 ? (
                          element.accounts.map((account) => (
                            <div
                              key={account.id}
                              className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm"
                            >
                              <span className="text-gray-700">
                                {account.name}
                              </span>
                              <span
                                className={`font-medium ${
                                  account.total < 0
                                    ? "text-danger"
                                    : "text-gray-900"
                                }`}
                              >
                                {formatCurrency(account.total)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm italic text-gray-500 px-3 py-2">
                            No hay cuentas asociadas
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay elementos registrados para esta sección.
                  </p>
                )}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mt-6">
                <div className="flex justify-between font-bold text-lg text-gray-700">
                  <span>TOTAL {section.title}:</span>
                  <span>{formatCurrency(section.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Activos
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatCurrency(totalActivos)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Pasivos
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatCurrency(totalPasivos)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Patrimonio
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatCurrency(totalPatrimonio)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-3">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Verificación</span>
              <span>{formatCurrency(verificacion)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón Exportar */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleExportPDF} variant="danger" size="md">
          Exportar Balance General PDF
        </Button>
      </div>
    </div>
  );
}
