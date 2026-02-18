import { useCallback, useEffect } from "react";
import { useAssignmentsStore } from "../stores/assignments-store";
import { useGetAssignmentHistory } from "./useGetassignmenthistory";

// Función para convertir fecha a yyyy-mm-dd hh:mm:ss
const formatDateForAPI = (dateStr: string, isEndDate = false) => {
  if (!dateStr) return null;

  let year: string, month: string, day: string;

  // Detectar formato de fecha
  if (dateStr.includes("/")) {
    // Formato dd/mm/yyyy
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    [day, month, year] = parts;
  } else if (dateStr.includes("-")) {
    // Formato yyyy-mm-dd
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    [year, month, day] = parts;
  } else {
    return null;
  }

  // Validar que sean números
  if (
    !day ||
    !month ||
    !year ||
    isNaN(parseInt(day)) ||
    isNaN(parseInt(month)) ||
    isNaN(parseInt(year))
  ) {
    return null;
  }

  // Validar rangos
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  if (
    dayNum < 1 ||
    dayNum > 31 ||
    monthNum < 1 ||
    monthNum > 12 ||
    yearNum < 2000
  ) {
    return null;
  }

  const time = isEndDate ? "23:59:59" : "00:00:00";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${time}`;
};

export const useAssignmentFilters = () => {
  const {
    filters,
    assignments,
    setRawData,
    setLoading,
    setError,
    transformDataToAssignments,
  } = useAssignmentsStore();

  const {
    data: assignmentData,
    loading: apiLoading,
    error: apiError,
    fetchAssignmentHistory,
  } = useGetAssignmentHistory();

  // Efecto para actualizar el store cuando cambian los datos de la API
  useEffect(() => {
    setRawData(assignmentData);
    transformDataToAssignments();
  }, [assignmentData, setRawData, transformDataToAssignments]);

  // Sincronizar estado de carga y error con el store
  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading, setLoading]);

  useEffect(() => {
    setError(apiError);
  }, [apiError, setError]);

  // Función para aplicar filtros
  const applyFilters = useCallback(async () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    let startDate: string;
    let endDate: string;

    if (filters.fechaInicio || filters.fechaFin) {
      // Si hay fechas seleccionadas, validar que ambas estén presentes
      if (!filters.fechaInicio || !filters.fechaFin) {
        alert("Por favor, seleccione tanto fecha de inicio como fecha de fin.");
        return;
      }

      // Usar fechas seleccionadas
      const formattedStartDate = formatDateForAPI(filters.fechaInicio, false);
      const formattedEndDate = formatDateForAPI(filters.fechaFin, true);

      if (!formattedStartDate || !formattedEndDate) {
        alert(
          "Formato de fecha inválido. Use el formato dd/mm/yyyy o seleccione una fecha del calendario.",
        );
        return;
      }

      startDate = formattedStartDate;
      endDate = formattedEndDate;
    } else {
      // Usar fechas por defecto (últimos 30 días)
      startDate = thirtyDaysAgo.toISOString().split("T")[0] + " 00:00:00";
      endDate = today.toISOString().split("T")[0] + " 23:59:59";
    }

    const providerId = filters.proveedor ? parseInt(filters.proveedor) : 0; // 0 para listar todos

    await fetchAssignmentHistory({
      start_date: startDate,
      end_date: endDate,
      Provider_id: providerId,
    });
  }, [filters, fetchAssignmentHistory]);

  // Cargar datos iniciales
  useEffect(() => {
    applyFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    assignments,
    loading: apiLoading,
    error: apiError,
    applyFilters,
  };
};
