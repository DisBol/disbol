"use client";

import { useMemo } from "react";
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
import { CierrePeriodo } from "../interfaces";
import { useGetAccountingPeriod } from "../hooks/useGetAccountingPeriod";
import { useGetAsiento } from "../../nuevo-asiento/hooks/getAsiento";
import { useGetAccount } from "../../plan-cuentas/hooks/useGetAccount";

interface HistorialCierresProps {
  onSelectCierre?: (cierre: CierrePeriodo) => void;
}

export default function HistorialCierres({
  onSelectCierre,
}: HistorialCierresProps) {
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
        fechaCierre: new Date(periodo.updated_at),
        cerradoPor: "contador",
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
                    <TableCell className="font-medium">
                      {cierre.periodo}
                    </TableCell>
                    <TableCell>{formatDate(cierre.fechaCierre)}</TableCell>
                    <TableCell>{cierre.cerradoPor}</TableCell>
                    <TableCell className="text-center">
                      {cierre.asientos}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      {formatCurrency(cierre.resultado, cierre.currency)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => {
                          if (onSelectCierre) {
                            onSelectCierre(cierre);
                          }
                        }}
                        variant="danger"
                        size="sm"
                      >
                        Ver Detalles
                      </Button>
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
    </Card>
  );
}
