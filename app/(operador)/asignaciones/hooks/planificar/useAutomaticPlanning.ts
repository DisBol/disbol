import { useCallback } from "react";
import { EditableGroupData } from "../../types/planning.types";

export const useAutomaticPlanning = () => {
  // Helper para calcular el multiplicador según código de producto
  const getMultiplier = useCallback((productCode: string) => {
    if (productCode.includes("104") || productCode.includes("105")) return 15;
    if (
      productCode.includes("106") ||
      productCode.includes("107") ||
      productCode.includes("108") ||
      productCode.includes("109")
    )
      return 12;
    return 0;
  }, []);

  // Función para recalcular totales de un grupo basado en sus clientes
  const recalculateGroupTotals = useCallback(
    (group: EditableGroupData): EditableGroupData => {
      // Crear un mapa para acumular totales por producto
      const productTotals = new Map<
        string,
        { cajas: number; unidades: number }
      >();

      // Sumar todos los valores de los clientes para cada producto
      group.clientes.forEach((cliente) => {
        cliente.codes.forEach((code) => {
          if (!productTotals.has(code.label)) {
            productTotals.set(code.label, { cajas: 0, unidades: 0 });
          }
          const total = productTotals.get(code.label)!;
          total.cajas += code.cajas;
          total.unidades += code.unidades;
        });
      });

      // Actualizar los códigos del grupo
      const updatedCodes = group.codes.map((code) => {
        const total = productTotals.get(code.label) || {
          cajas: 0,
          unidades: 0,
        };
        return {
          ...code,
          cajas: total.cajas,
          unidades: total.unidades,
        };
      });

      // Calcular totales generales
      const totalCajas = updatedCodes.reduce(
        (sum, code) => sum + code.cajas,
        0,
      );
      const totalUnid = updatedCodes.reduce(
        (sum, code) => sum + code.unidades,
        0,
      );

      return {
        ...group,
        codes: updatedCodes,
        totalCajas,
        totalUnid,
      };
    },
    [],
  );

  // Función principal de planificación automática
  const executeAutomaticPlanning = useCallback(
    (
      editableGroups: EditableGroupData[],
      updatedDetalles: Array<{
        label: string;
        cajas: string;
        unidades: string;
      }>,
    ): EditableGroupData[] => {
      if (editableGroups.length === 0 || updatedDetalles.length === 0) {
        return editableGroups;
      }

      const newGroups = [...editableGroups];

      // Crear un Set de productos a procesar para facilitar la búsqueda
      const productosAProcesar = new Set(updatedDetalles.map((d) => d.label));

      // Solo resetear valores de productos excedidos
      newGroups.forEach((group, groupIndex) => {
        group.clientes.forEach((cliente) => {
          cliente.codes.forEach((code) => {
            // Solo resetear si el producto está en la lista de excedidos
            if (productosAProcesar.has(code.label)) {
              code.cajas = 0;
              code.unidades = 0;
              code.restante = code.solicitado - code.unidades;
            }
          });
          // Recalcular totales del cliente
          cliente.totalCajas = cliente.codes.reduce(
            (sum, code) => sum + code.cajas,
            0,
          );
          cliente.totalUnid = cliente.codes.reduce(
            (sum, code) => sum + code.unidades,
            0,
          );
        });
        // Recalcular totales del grupo
        newGroups[groupIndex] = recalculateGroupTotals(newGroups[groupIndex]);
      });

      // Luego, procesar solo los productos en updatedDetalles
      updatedDetalles.forEach((detalle) => {
        // Extraer el valor disponible (posición 2) - después del "/"
        const cajasParts = detalle.cajas.split("/");
        const unidadesParts = detalle.unidades.split("/");

        // Validar y extraer solo el valor después del "/" (posición 2)
        const cajasDisponibles =
          cajasParts.length > 1 ? parseInt(cajasParts[1]) || 0 : 0;
        const unidadesDisponibles =
          unidadesParts.length > 1 ? parseInt(unidadesParts[1]) || 0 : 0;

        // Si no hay nada disponible en posición 2 (x/0), no distribuir
        if (cajasDisponibles === 0 && unidadesDisponibles === 0) return;

        // Calcular total solicitado para este producto (posición 1)
        let totalCajasSolicitadas = 0;

        newGroups.forEach((group) => {
          group.clientes.forEach((cliente) => {
            const code = cliente.codes.find((c) => c.label === detalle.label);
            if (code && code.solicitado > 0) {
              totalCajasSolicitadas += code.solicitado;
            }
          });
        });

        // Si no hay solicitudes para este producto, continuar
        if (totalCajasSolicitadas === 0) return;

        // Calcular porcentaje de disponibilidad de cajas
        const porcentajeCajas =
          cajasDisponibles >= totalCajasSolicitadas
            ? 1
            : cajasDisponibles / totalCajasSolicitadas;

        console.log(
          `Producto ${detalle.label}: disponible ${cajasDisponibles}, solicitado ${totalCajasSolicitadas}, porcentaje ${(porcentajeCajas * 100).toFixed(2)}%`,
        );

        // Aplicar distribución proporcional a cada cliente
        newGroups.forEach((group, groupIndex) => {
          group.clientes.forEach((cliente, clienteIndex) => {
            const codeIndex = cliente.codes.findIndex(
              (c) => c.label === detalle.label,
            );

            if (codeIndex !== -1) {
              const code =
                newGroups[groupIndex].clientes[clienteIndex].codes[codeIndex];

              if (code.solicitado > 0) {
                // Calcular asignación proporcional de cajas con redondeo hacia abajo
                const cajasAsignadas =
                  porcentajeCajas >= 1
                    ? code.solicitado
                    : Math.floor(code.solicitado * porcentajeCajas);

                // Calcular unidades basándose en las cajas asignadas y el multiplicador
                const multiplier = getMultiplier(detalle.label);
                const unidadesAsignadas =
                  multiplier > 0 ? cajasAsignadas * multiplier : cajasAsignadas; // Si no hay multiplicador, usar el mismo valor que cajas

                // Asignar valores
                code.cajas = cajasAsignadas;
                code.unidades = unidadesAsignadas;
                code.restante = code.solicitado - code.unidades;

                console.log(
                  `Cliente ${cliente.name} - ${detalle.label}: solicitado ${code.solicitado}, asignado ${cajasAsignadas} cajas → ${unidadesAsignadas} unidades (multiplier: ${multiplier})`,
                );
              }
            }
          });

          // Recalcular totales del cliente
          newGroups[groupIndex].clientes.forEach((cliente, clienteIdx) => {
            cliente.totalCajas = cliente.codes.reduce(
              (sum, code) => sum + code.cajas,
              0,
            );
            cliente.totalUnid = cliente.codes.reduce(
              (sum, code) => sum + code.unidades,
              0,
            );
          });

          // Recalcular totales del grupo
          newGroups[groupIndex] = recalculateGroupTotals(newGroups[groupIndex]);
        });
      });

      return newGroups;
    },
    [recalculateGroupTotals, getMultiplier],
  );

  return {
    executeAutomaticPlanning,
    recalculateGroupTotals,
  };
};
