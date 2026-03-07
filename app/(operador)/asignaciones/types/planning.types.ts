import { Assignment } from "../stores/assignments-store";
import { Datum } from "../interfaces/getassignmenthistory.interface";

export interface PlanningProps {
  assignment?: Assignment | null;
  rawData?: Datum[] | null;
  onClose?: () => void;
}

export interface GroupData {
  name: string;
  status: "guardado" | "pendiente";
  codes: Array<{ label: string; cajas: number; unidades: number }>;
  totalCajas: number;
  totalUnid: number;
  clientes: Array<{
    name: string;
    estado: string;
    codes: Array<{
      label: string;
      solicitado: number;
      cajas: number;
      unidades: number;
      restante: number;
    }>;
    totalCajas: number;
    totalUnid: number;
  }>;
}

export interface EditableGroupData extends Omit<
  GroupData,
  "codes" | "totalCajas" | "totalUnid"
> {
  codes: Array<{ label: string; cajas: number; unidades: number }>;
  totalCajas: number;
  totalUnid: number;
}

export interface ProcessedPlanningData {
  detalles: Array<{
    label: string;
    cajas: string;
    unidades: string;
  }>;
  processedGroups: GroupData[];
  proveedor: string;
  clienteOrigen: string;
}
