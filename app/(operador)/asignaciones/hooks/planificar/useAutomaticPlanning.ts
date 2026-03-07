import { useCallback } from "react";
import { EditableGroupData } from "../../types/planning.types";

export const useAutomaticPlanning = () => {
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

      // Primero resetear todos los valores a 0
      newGroups.forEach((group, groupIndex) => {
        group.clientes.forEach((cliente) => {
          cliente.codes.forEach((code) => {
            code.cajas = 0;
            code.unidades = 0;
            code.restante = code.solicitado - code.unidades;
          });
          // Recalcular totales del cliente
          cliente.totalCajas = 0;
          cliente.totalUnid = 0;
        });
        // Recalcular totales del grupo
        newGroups[groupIndex] = recalculateGroupTotals(newGroups[groupIndex]);
      });

      // Luego, para cada producto en los detalles
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

        // Encontrar grupos que tienen este producto con solicitud > 0
        const gruposConProducto = newGroups.filter((group) =>
          group.clientes.some((cliente) =>
            cliente.codes.some(
              (code) => code.label === detalle.label && code.solicitado > 0,
            ),
          ),
        );

        if (gruposConProducto.length === 0) return;

        // Dividir equitativamente entre grupos que tienen clientes con solicitud > 0
        const cajasPorGrupo = Math.floor(
          cajasDisponibles / gruposConProducto.length,
        );
        const unidadesPorGrupo = Math.floor(
          unidadesDisponibles / gruposConProducto.length,
        );

        // Calcular sobrantes para distribuir
        let cajasRestantes = cajasDisponibles % gruposConProducto.length;
        let unidadesRestantes = unidadesDisponibles % gruposConProducto.length;

        gruposConProducto.forEach((group) => {
          // Calcular asignación para este grupo (incluyendo sobrantes)
          const cajasParaGrupo = cajasPorGrupo + (cajasRestantes > 0 ? 1 : 0);
          const unidadesParaGrupo =
            unidadesPorGrupo + (unidadesRestantes > 0 ? 1 : 0);

          if (cajasRestantes > 0) cajasRestantes--;
          if (unidadesRestantes > 0) unidadesRestantes--;

          // Encontrar el índice del grupo en el array original
          const groupIndex = newGroups.findIndex((g) => g.name === group.name);
          if (groupIndex === -1) return;

          // Encontrar clientes en este grupo que tienen el producto Y con solicitud > 0
          const clientesConProducto = newGroups[groupIndex].clientes.filter(
            (cliente) =>
              cliente.codes.some(
                (code) => code.label === detalle.label && code.solicitado > 0,
              ),
          );

          if (clientesConProducto.length === 0) return;

          // Dividir la asignación del grupo entre sus clientes CON SOLICITUD > 0
          const cajasPorCliente = Math.floor(
            cajasParaGrupo / clientesConProducto.length,
          );
          const unidadesPorCliente = Math.floor(
            unidadesParaGrupo / clientesConProducto.length,
          );

          // Sobrantes a nivel de grupo
          let cajasRestantesGrupo = cajasParaGrupo % clientesConProducto.length;
          let unidadesRestantesGrupo =
            unidadesParaGrupo % clientesConProducto.length;

          clientesConProducto.forEach((cliente) => {
            const clienteIndex = newGroups[groupIndex].clientes.findIndex(
              (c) => c.name === cliente.name,
            );
            if (clienteIndex === -1) return;

            const codeIndex = newGroups[groupIndex].clientes[
              clienteIndex
            ].codes.findIndex((code) => code.label === detalle.label);
            if (codeIndex === -1) return;

            // Solo asignar si el cliente realmente solicita > 0
            const code =
              newGroups[groupIndex].clientes[clienteIndex].codes[codeIndex];
            if (code.solicitado > 0) {
              // Calcular asignación para este cliente (incluyendo sobrantes)
              const cajasParaCliente =
                cajasPorCliente + (cajasRestantesGrupo > 0 ? 1 : 0);
              const unidadesParaCliente =
                unidadesPorCliente + (unidadesRestantesGrupo > 0 ? 1 : 0);

              if (cajasRestantesGrupo > 0) cajasRestantesGrupo--;
              if (unidadesRestantesGrupo > 0) unidadesRestantesGrupo--;

              // Actualizar valores del cliente
              const updatedCode = {
                ...code,
              };
              updatedCode.cajas = cajasParaCliente;
              updatedCode.unidades = unidadesParaCliente;
              updatedCode.restante =
                updatedCode.solicitado - updatedCode.unidades;

              newGroups[groupIndex].clientes[clienteIndex].codes[codeIndex] =
                updatedCode;
            }
            // Si solicitado === 0, ya está en 0 por el reset inicial
          });

          // Recalcular totales del cliente
          newGroups[groupIndex].clientes.forEach((cliente, clienteIdx) => {
            newGroups[groupIndex].clientes[clienteIdx].totalCajas =
              cliente.codes.reduce((sum, c) => sum + c.cajas, 0);
            newGroups[groupIndex].clientes[clienteIdx].totalUnid =
              cliente.codes.reduce((sum, c) => sum + c.unidades, 0);
          });

          // Recalcular totales del grupo
          newGroups[groupIndex] = recalculateGroupTotals(newGroups[groupIndex]);
        });
      });

      return newGroups;
    },
    [recalculateGroupTotals],
  );

  return {
    executeAutomaticPlanning,
    recalculateGroupTotals,
  };
};
