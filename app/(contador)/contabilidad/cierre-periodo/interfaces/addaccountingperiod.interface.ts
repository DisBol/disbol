import { Metadata } from "./getaccountingperiod.interface";

export interface AddAccountingPeriodPayload {
  name: string;
  active?: string;
  User_id: number;
}

export interface AddAccountingPeriodResponse {
  data: AddAccountingPeriodData;
  metadata: Metadata;
}

export interface AddAccountingPeriodData {
  type?: number;
  index?: number;
  lastID?: number;
  changes?: number;
  totalChanges?: number;
  finalized?: number;
  rowId?: number;
  id?: number;
}
