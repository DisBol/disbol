"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { CierrePeriodo } from "../interfaces";
import { useGetAccountingPeriod } from "../hooks/useGetAccountingPeriod";
import { useGetAsiento } from "../../nuevo-asiento/hooks/getAsiento";
import { useGetAccount } from "../../plan-cuentas/hooks/useGetAccount";
import CerrarPeriodoModal from "./CerrarPeriodoModal";
import type { Datum as AccountingPeriod } from "../interfaces/getaccountingperiod.interface";

interface HistorialCierresProps {
  onSelectCierre?: (cierre: CierrePeriodo) => void;
  onValidar?: (periodo: string) => Promise<void>;
  onPeriodChanged?: () => void;
}

export default function HistorialCierres({
  onSelectCierre,
  onValidar,
  onPeriodChanged,
}: HistorialCierresProps) {
  const [validatingPeriodId, setValidatingPeriodId] = useState<string | null>(
    null,
  );
  const [periodoParaCerrar, setPeriodoParaCerrar] =
    useState<AccountingPeriod | null>(null);
  const {
    data: accountingPeriods,
    loading: loadingPeriods,
    error: periodsError,
  } = useGetAccountingPeriod();
  const {
    data: asientos,
    loading: loadingAsientos,
    error: asientosError,
  } = useGetAsiento();
  const {
    data: accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useGetAccount();

  const handleValidar = async (periodoId: string) => {
    if (!onValidar) return;

    setValidatingPeriodId(periodoId);
    try {
      await onValidar(periodoId);
    } finally {
      setValidatingPeriodId(null);
    }
  };

  const currencyByAccountId = useMemo(() => {
    return new Map(
      accounts.map((account) => [account.id, account.money_type || ""]),
    );
  }, [accounts]);

  const cierres = useMemo<CierrePeriodo[]>(() => {
    return accountingPeriods.map((periodo) => {
      const asientosPeriodo = asientos.filter(
        (asiento) => asiento.AccountingPeriod_id === periodo.id,
      );
      const currencies = Array.from(
        new Set(
          asientosPeriodo
            .map((asiento) => currencyByAccountId.get(asiento.Account_id))
            .filter((currency): currency is string => Boolean(currency)),
        ),
      );
      const currency = currencies.length === 1 ? currencies[0] : undefined;

      const totalIngresos = asientosPeriodo.reduce(
        (accumulator, asiento) => accumulator + asiento.amount_credit,
        0,
      );

      const totalGastos = asientosPeriodo.reduce(
        (accumulator, asiento) => accumulator + asiento.amount_debit,
        0,
      );

      return {
        id: String(periodo.id),
        periodo: periodo.name,
        active: periodo.active,
        fechaCierre: new Date(periodo.updated_at),
        cerradoPor: periodo.User_name,
        asientos: asientosPeriodo.length,
        resultado: totalIngresos - totalGastos,
        estado: "cerrado",
        totalIngresos,
        totalGastos,
        currency,
        asientosDetalle: asientosPeriodo.map((asiento) => ({
          id: String(asiento.id),
          fecha: new Date(asiento.created_at).toISOString().split("T")[0],
          tipo: asiento.description,
          glosa: asiento.description,
          currency: currencyByAccountId.get(asiento.Account_id) || "",
          total: asiento.amount_credit - asiento.amount_debit,
        })),
      };
    });
  }, [accountingPeriods, asientos, currencyByAccountId]);

  const loading = loadingPeriods || loadingAsientos || loadingAccounts;
  const error = periodsError || asientosError || accountsError;

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  };

  const formatCurrency = (value: number, currency?: string) => {
    if (!currency) {
      return "-";
    }

    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">
          Historial de Cierres
        </h2>
      </CardHeader>
      <CardContent>
        {cierres.length > 0 ? (
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Fecha de Cierre</TableHead>
                  <TableHead>Cerrado por</TableHead>
                  <TableHead className="text-center">Asientos</TableHead>
                  <TableHead className="text-right">Resultado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cierres.map((cierre) => (
                  <TableRow key={cierre.id}>
                    <TableCell className="min-w-40 font-medium">
                      <div>{cierre.periodo}</div>
                      <Chip
                        variant="flat"
                        color={cierre.active === "true" ? "success" : "default"}
                        size="sm"
                        radius="full"
                        className="mt-1 text-[10px]"
                      >
                        {cierre.active === "true" ? "ACTIVO" : "INACTIVO"}
                      </Chip>
                    </TableCell>
                    <TableCell>{formatDate(cierre.fechaCierre)}</TableCell>
                    <TableCell>{cierre.cerradoPor}</TableCell>
                    <TableCell className="text-center">
                      {cierre.asientos}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      {formatCurrency(cierre.resultado, cierre.currency)}
                    </TableCell>
                    <TableCell className="min-w-md text-center">
                      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap lg:items-center lg:justify-center">
                        <Button
                          onClick={() => {
                            if (onSelectCierre) {
                              onSelectCierre(cierre);
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full whitespace-nowrap lg:w-auto"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          onClick={() => handleValidar(cierre.id)}
                          variant="warning"
                          size="sm"
                          loading={validatingPeriodId === cierre.id}
                          disabled={
                            validatingPeriodId !== null ||
                            cierre.active !== "true"
                          }
                          className="w-full whitespace-nowrap lg:w-auto"
                        >
                          Validar
                        </Button>
                        <Button
                          onClick={() => {
                            const periodo = accountingPeriods.find(
                              (item) => String(item.id) === cierre.id,
                            );
                            if (periodo) setPeriodoParaCerrar(periodo);
                          }}
                          variant="danger"
                          size="sm"
                          disabled={cierre.active !== "true"}
                          className="w-full whitespace-nowrap lg:w-auto"
                        >
                          Cerrar período
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {error
              ? "No se pudo cargar el historial"
              : "No hay cierres registrados"}
          </div>
        )}
      </CardContent>

      <CerrarPeriodoModal
        periodo={periodoParaCerrar}
        isOpen={periodoParaCerrar !== null}
        onClose={() => setPeriodoParaCerrar(null)}
        onSuccess={async () => {
          setPeriodoParaCerrar(null);
          await onPeriodChanged?.();
        }}
      />
    </Card>
  );
}
