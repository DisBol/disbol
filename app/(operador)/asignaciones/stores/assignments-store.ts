import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Datum } from "../interfaces/getassignmenthistory.interface";

// Interfaces
export interface ProductQuantity {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  menudencia: string;
  // Información necesaria para las APIs
  productId: string;
  ticketId: string;
  productAssignmentId: string; // Este es el ID que se usa para editar
}

export interface Assignment {
  id: string;
  fecha: string;
  proveedor: string;
  providerId: string; // ID del proveedor necesario para eliminar assignment
  productos: ProductQuantity[];
}

export interface AssignmentFilters {
  fechaInicio: string;
  fechaFin: string;
  proveedor: string;
}

interface AssignmentsState {
  // Estado
  assignments: Assignment[];
  rawData: Datum[] | null;
  loading: boolean;
  error: string | null;

  // Filtros
  filters: AssignmentFilters;

  // Pantalla de recepción
  showReception: boolean;
  selectedAssignment: Assignment | null;

  // Estado de edición
  editingAssignments: Set<string>;
  updatingProducts: Set<string>;
  pendingChanges: Map<string, Map<string, Partial<ProductQuantity>>>; // assignmentId -> productCode -> changes

  // Acciones
  setFilters: (filters: Partial<AssignmentFilters>) => void;
  setRawData: (data: Datum[] | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformDataToAssignments: () => void;
  resetState: () => void;

  // Acciones de navegación
  showReceptionScreen: (assignment: Assignment) => void;
  hideReceptionScreen: () => void;

  // Acciones de edición
  startEditingAssignment: (assignmentId: string) => void;
  stopEditingAssignment: (assignmentId: string) => void;
  updateProductInAssignment: (
    assignmentId: string,
    productCode: string,
    updates: Partial<ProductQuantity>,
  ) => void;
  setProductUpdating: (productKey: string, updating: boolean) => void;

  // Nuevas acciones para cambios pendientes
  setPendingChange: (
    assignmentId: string,
    productCode: string,
    changes: Partial<ProductQuantity>,
  ) => void;
  clearPendingChanges: (assignmentId: string) => void;
  revertPendingChanges: (assignmentId: string) => void;
  getPendingChanges: (
    assignmentId: string,
  ) => Map<string, Partial<ProductQuantity>>;
}

// Función para transformar datos de la API
const transformApiDataToAssignments = (
  apiData: Datum[] | null,
): Assignment[] => {
  if (!apiData || apiData.length === 0) return [];

  // Agrupar por Assignment_id
  const groupedData = apiData.reduce(
    (acc, item) => {
      const assignmentId = item.Assignment_id.toString();

      if (!acc[assignmentId]) {
        acc[assignmentId] = {
          id: assignmentId,
          fecha: new Date(item.Assignment_created_at).toLocaleDateString(
            "es-ES",
          ),
          proveedor: item.Provider_name,
          providerId: item.Provider_id.toString(),
          productos: [],
        };
      }

      // Agregar producto
      acc[assignmentId].productos.push({
        codigo: item.Product_name,
        cajas: item.ProductAssignment_container,
        unidades: item.ProductAssignment_units,
        kgBruto: parseFloat(item.ProductAssignment_gross_weight || "0"),
        kgNeto: parseFloat(item.ProductAssignment_net_weight || "0"),
        menudencia: item.ProductAssignment_menudencia,
        productId: item.Product_id.toString(),
        ticketId: item.Ticket_id.toString(),
        productAssignmentId: item.ProductAssignment_id.toString(),
      });

      return acc;
    },
    {} as Record<string, Assignment>,
  );

  return Object.values(groupedData);
};

export const useAssignmentsStore = create<AssignmentsState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      assignments: [],
      rawData: null,
      loading: false,
      error: null,

      // Filtros iniciales
      filters: {
        fechaInicio: "",
        fechaFin: "",
        proveedor: "",
      },

      // Estado de recepción
      showReception: false,
      selectedAssignment: null,

      // Estado de edición
      editingAssignments: new Set(),
      updatingProducts: new Set(),
      pendingChanges: new Map(),

      // Acciones
      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters },
          }),
          false,
          "setFilters",
        ),

      setRawData: (data) => set({ rawData: data }, false, "setRawData"),

      setLoading: (loading) => set({ loading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      transformDataToAssignments: () =>
        set(
          (state) => ({
            assignments: transformApiDataToAssignments(state.rawData),
          }),
          false,
          "transformDataToAssignments",
        ),

      resetState: () =>
        set(
          {
            assignments: [],
            rawData: null,
            loading: false,
            error: null,
            showReception: false,
            selectedAssignment: null,
            editingAssignments: new Set(),
            updatingProducts: new Set(),
            pendingChanges: new Map(),
          },
          false,
          "resetState",
        ),

      // Acciones de navegación
      showReceptionScreen: (assignment) =>
        set(
          {
            showReception: true,
            selectedAssignment: assignment,
          },
          false,
          "showReceptionScreen",
        ),

      hideReceptionScreen: () =>
        set(
          {
            showReception: false,
            selectedAssignment: null,
          },
          false,
          "hideReceptionScreen",
        ),

      // Acciones de edición
      startEditingAssignment: (assignmentId) =>
        set(
          (state) => ({
            editingAssignments: new Set([
              ...state.editingAssignments,
              assignmentId,
            ]),
          }),
          false,
          "startEditingAssignment",
        ),

      stopEditingAssignment: (assignmentId) =>
        set(
          (state) => {
            const newEditing = new Set(state.editingAssignments);
            newEditing.delete(assignmentId);
            return { editingAssignments: newEditing };
          },
          false,
          "stopEditingAssignment",
        ),

      updateProductInAssignment: (assignmentId, productCode, updates) =>
        set(
          (state) => ({
            assignments: state.assignments.map((assignment) =>
              assignment.id === assignmentId
                ? {
                    ...assignment,
                    productos: assignment.productos.map((product) =>
                      product.codigo === productCode
                        ? { ...product, ...updates }
                        : product,
                    ),
                  }
                : assignment,
            ),
          }),
          false,
          "updateProductInAssignment",
        ),

      setProductUpdating: (productKey, updating) =>
        set(
          (state) => {
            const newUpdating = new Set(state.updatingProducts);
            if (updating) {
              newUpdating.add(productKey);
            } else {
              newUpdating.delete(productKey);
            }
            return { updatingProducts: newUpdating };
          },
          false,
          "setProductUpdating",
        ),

      // Nuevas acciones para cambios pendientes
      setPendingChange: (assignmentId, productCode, changes) =>
        set(
          (state) => {
            const newPendingChanges = new Map(state.pendingChanges);
            if (!newPendingChanges.has(assignmentId)) {
              newPendingChanges.set(assignmentId, new Map());
            }
            const assignmentChanges = newPendingChanges.get(assignmentId)!;
            const existingChanges = assignmentChanges.get(productCode) || {};
            assignmentChanges.set(productCode, {
              ...existingChanges,
              ...changes,
            });

            return { pendingChanges: newPendingChanges };
          },
          false,
          "setPendingChange",
        ),

      clearPendingChanges: (assignmentId) =>
        set(
          (state) => {
            const newPendingChanges = new Map(state.pendingChanges);
            newPendingChanges.delete(assignmentId);
            return { pendingChanges: newPendingChanges };
          },
          false,
          "clearPendingChanges",
        ),

      revertPendingChanges: (assignmentId: string) => {
        // Simplemente limpiar cambios pendientes
        // La reversión real se hace refrescando datos desde el servidor
        set(
          (state) => {
            const newPendingChanges = new Map(state.pendingChanges);
            newPendingChanges.delete(assignmentId);
            return { pendingChanges: newPendingChanges };
          },
          false,
          "revertPendingChanges",
        );
      },

      getPendingChanges: (assignmentId) => {
        return get().pendingChanges.get(assignmentId) || new Map();
      },
    }),
    { name: "assignments-store" },
  ),
);
