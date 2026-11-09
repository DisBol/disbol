import { GetAsientoByPeriod } from "../../reportes/service/getAsientoByPeriod";
import { ValidacionResponse } from "../interfaces";

const toCents = (value: number) => Math.round(Number(value || 0) * 100);

// Revisa que un período pueda cerrarse: sin borradores y con debe = haber
export async function validarCierrePeriodo(
  AccountingPeriod_id: number,
  nombrePeriodo: string,
): Promise<ValidacionResponse> {
  const response = await GetAsientoByPeriod(AccountingPeriod_id);
  const lineas = (response.data ?? []).filter((a) => a.active !== "false");

  const errores: string[] = [];

  const borradores = lineas.filter(
    (a) => a.state === "borrador" || a.state === null,
  );
  if (borradores.length > 0) {
    errores.push(
      `Hay ${borradores.length} línea(s) en borrador sin aprobar.`,
    );
  }

  const debe = lineas.reduce((sum, a) => sum + toCents(a.amount_debit), 0);
  const haber = lineas.reduce((sum, a) => sum + toCents(a.amount_credit), 0);
  if (debe !== haber) {
    errores.push(
      `El período no cuadra: Debe ${(debe / 100).toFixed(2)} y Haber ${(haber / 100).toFixed(2)}.`,
    );
  }

  // Cada asiento (líneas con la misma descripción) también debe cuadrar
  const porAsiento = new Map<string, number>();
  for (const a of lineas) {
    porAsiento.set(
      a.description,
      (porAsiento.get(a.description) ?? 0) +
        toCents(a.amount_debit) -
        toCents(a.amount_credit),
    );
  }
  const descuadrados = [...porAsiento.entries()].filter(([, saldo]) => saldo !== 0);
  if (descuadrados.length > 0) {
    errores.push(
      `${descuadrados.length} asiento(s) descuadrado(s): ${descuadrados
        .slice(0, 5)
        .map(([descripcion]) => `«${descripcion}»`)
        .join(", ")}${descuadrados.length > 5 ? "…" : ""}`,
    );
  }

  return errores.length === 0
    ? {
        exito: true,
        mensaje: `El período ${nombrePeriodo} puede cerrarse: ${lineas.length} línea(s), sin borradores y cuadrado.`,
      }
    : {
        exito: false,
        mensaje: `El período ${nombrePeriodo} no puede cerrarse`,
        errores,
      };
}
