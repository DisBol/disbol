import { Metadata } from "./getaccountingperiod.interface";

export interface UpdateAccountingPeriodPayload {
  id: number;
  name: string;
  active: string;
  User_id: number;
}

export interface UpdateAccountingPeriodResponse {
  data: UpdateAccountingPeriodData;
  metadata: Metadata;
}

export interface UpdateAccountingPeriodData {
  type?: number;
  index?: number;
  lastID?: number;
  changes?: number;
  totalChanges?: number;
  finalized?: number;
  rowId?: number;
  id?: number;
}
