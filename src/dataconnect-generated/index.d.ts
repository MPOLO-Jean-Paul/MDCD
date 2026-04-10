import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddInventoryItemData {
  inventoryItem_insert: InventoryItem_Key;
}

export interface AddInventoryItemVariables {
  name: string;
  category: string;
  unitPrice: number;
  initialStock: number;
  reorderLevel: number;
}

export interface ArchiveLabReportData {
  labReportArchive_insert: LabReportArchive_Key;
}

export interface ArchiveLabReportVariables {
  patientId: UUIDString;
  consultationId: UUIDString;
  testResults: string;
  interpretations?: string | null;
}

export interface CreateInvoiceData {
  invoice_insert: Invoice_Key;
}

export interface CreateInvoiceVariables {
  patientId: UUIDString;
  items: string;
  totalAmount: number;
  amountPatient: number;
  amountInsurance: number;
  reason: string;
}

export interface GetGlobalAnalyticsData {
  invoices: ({
    totalAmount: number;
    status: string;
    createdAt: TimestampString;
    reason: string;
    amountPatient: number;
    amountInsurance: number;
  })[];
}

export interface GetInventoryData {
  inventoryItems: ({
    id: UUIDString;
    name: string;
    category: string;
    unitPrice: number;
    currentStock: number;
    reorderLevel: number;
    updatedAt: TimestampString;
  } & InventoryItem_Key)[];
}

export interface GetLatestInvoiceData {
  invoices: ({
    id: UUIDString;
    totalAmount: number;
    status: string;
    createdAt: TimestampString;
    reason: string;
    amountPatient: number;
    amountInsurance: number;
  } & Invoice_Key)[];
}

export interface GetLatestInvoiceVariables {
  patientId: UUIDString;
}

export interface GetPatientHistoryData {
  patientDetail?: {
    id: UUIDString;
    medicalHistory?: string | null;
    familyHistory?: string | null;
    allergies?: string | null;
    bloodGroup?: string | null;
  } & PatientDetail_Key;
}

export interface GetPatientHistoryVariables {
  patientId: UUIDString;
}

export interface InsuranceProvider_Key {
  id: UUIDString;
  __typename?: 'InsuranceProvider_Key';
}

export interface InventoryItem_Key {
  id: UUIDString;
  __typename?: 'InventoryItem_Key';
}

export interface InventoryTransaction_Key {
  id: UUIDString;
  __typename?: 'InventoryTransaction_Key';
}

export interface Invoice_Key {
  id: UUIDString;
  __typename?: 'Invoice_Key';
}

export interface LabReportArchive_Key {
  id: UUIDString;
  __typename?: 'LabReportArchive_Key';
}

export interface LogTransactionData {
  inventoryTransaction_insert: InventoryTransaction_Key;
}

export interface LogTransactionVariables {
  itemId: UUIDString;
  type: string;
  quantity: number;
  reason?: string | null;
  staffId?: UUIDString | null;
}

export interface PatientDetail_Key {
  id: UUIDString;
  __typename?: 'PatientDetail_Key';
}

export interface Staff_Key {
  id: UUIDString;
  __typename?: 'Staff_Key';
}

export interface UpdateInvoiceStatusData {
  invoice_update?: Invoice_Key | null;
}

export interface UpdateInvoiceStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateStockData {
  inventoryItem_update?: InventoryItem_Key | null;
}

export interface UpdateStockVariables {
  itemId: UUIDString;
  newStock: number;
}

export interface UpsertPatientData {
  patientDetail_upsert: PatientDetail_Key;
}

export interface UpsertPatientVariables {
  id: UUIDString;
  firstName: string;
  lastName: string;
  nationalId?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
}

export interface UpsertStaffData {
  staff_upsert: Staff_Key;
}

export interface UpsertStaffVariables {
  id: UUIDString;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  specialty?: string | null;
  phone?: string | null;
}

interface UpsertStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStaffVariables): MutationRef<UpsertStaffData, UpsertStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertStaffVariables): MutationRef<UpsertStaffData, UpsertStaffVariables>;
  operationName: string;
}
export const upsertStaffRef: UpsertStaffRef;

export function upsertStaff(vars: UpsertStaffVariables): MutationPromise<UpsertStaffData, UpsertStaffVariables>;
export function upsertStaff(dc: DataConnect, vars: UpsertStaffVariables): MutationPromise<UpsertStaffData, UpsertStaffVariables>;

interface UpsertPatientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPatientVariables): MutationRef<UpsertPatientData, UpsertPatientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPatientVariables): MutationRef<UpsertPatientData, UpsertPatientVariables>;
  operationName: string;
}
export const upsertPatientRef: UpsertPatientRef;

export function upsertPatient(vars: UpsertPatientVariables): MutationPromise<UpsertPatientData, UpsertPatientVariables>;
export function upsertPatient(dc: DataConnect, vars: UpsertPatientVariables): MutationPromise<UpsertPatientData, UpsertPatientVariables>;

interface AddInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
  operationName: string;
}
export const addInventoryItemRef: AddInventoryItemRef;

export function addInventoryItem(vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;
export function addInventoryItem(dc: DataConnect, vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;

interface UpdateStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStockVariables): MutationRef<UpdateStockData, UpdateStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStockVariables): MutationRef<UpdateStockData, UpdateStockVariables>;
  operationName: string;
}
export const updateStockRef: UpdateStockRef;

export function updateStock(vars: UpdateStockVariables): MutationPromise<UpdateStockData, UpdateStockVariables>;
export function updateStock(dc: DataConnect, vars: UpdateStockVariables): MutationPromise<UpdateStockData, UpdateStockVariables>;

interface LogTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogTransactionVariables): MutationRef<LogTransactionData, LogTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogTransactionVariables): MutationRef<LogTransactionData, LogTransactionVariables>;
  operationName: string;
}
export const logTransactionRef: LogTransactionRef;

export function logTransaction(vars: LogTransactionVariables): MutationPromise<LogTransactionData, LogTransactionVariables>;
export function logTransaction(dc: DataConnect, vars: LogTransactionVariables): MutationPromise<LogTransactionData, LogTransactionVariables>;

interface CreateInvoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
  operationName: string;
}
export const createInvoiceRef: CreateInvoiceRef;

export function createInvoice(vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;
export function createInvoice(dc: DataConnect, vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface UpdateInvoiceStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
  operationName: string;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;

export function updateInvoiceStatus(vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
export function updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface ArchiveLabReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchiveLabReportVariables): MutationRef<ArchiveLabReportData, ArchiveLabReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ArchiveLabReportVariables): MutationRef<ArchiveLabReportData, ArchiveLabReportVariables>;
  operationName: string;
}
export const archiveLabReportRef: ArchiveLabReportRef;

export function archiveLabReport(vars: ArchiveLabReportVariables): MutationPromise<ArchiveLabReportData, ArchiveLabReportVariables>;
export function archiveLabReport(dc: DataConnect, vars: ArchiveLabReportVariables): MutationPromise<ArchiveLabReportData, ArchiveLabReportVariables>;

interface GetInventoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetInventoryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetInventoryData, undefined>;
  operationName: string;
}
export const getInventoryRef: GetInventoryRef;

export function getInventory(options?: ExecuteQueryOptions): QueryPromise<GetInventoryData, undefined>;
export function getInventory(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetInventoryData, undefined>;

interface GetPatientHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPatientHistoryVariables): QueryRef<GetPatientHistoryData, GetPatientHistoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPatientHistoryVariables): QueryRef<GetPatientHistoryData, GetPatientHistoryVariables>;
  operationName: string;
}
export const getPatientHistoryRef: GetPatientHistoryRef;

export function getPatientHistory(vars: GetPatientHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetPatientHistoryData, GetPatientHistoryVariables>;
export function getPatientHistory(dc: DataConnect, vars: GetPatientHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetPatientHistoryData, GetPatientHistoryVariables>;

interface GetLatestInvoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLatestInvoiceVariables): QueryRef<GetLatestInvoiceData, GetLatestInvoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLatestInvoiceVariables): QueryRef<GetLatestInvoiceData, GetLatestInvoiceVariables>;
  operationName: string;
}
export const getLatestInvoiceRef: GetLatestInvoiceRef;

export function getLatestInvoice(vars: GetLatestInvoiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetLatestInvoiceData, GetLatestInvoiceVariables>;
export function getLatestInvoice(dc: DataConnect, vars: GetLatestInvoiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetLatestInvoiceData, GetLatestInvoiceVariables>;

interface GetGlobalAnalyticsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetGlobalAnalyticsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetGlobalAnalyticsData, undefined>;
  operationName: string;
}
export const getGlobalAnalyticsRef: GetGlobalAnalyticsRef;

export function getGlobalAnalytics(options?: ExecuteQueryOptions): QueryPromise<GetGlobalAnalyticsData, undefined>;
export function getGlobalAnalytics(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetGlobalAnalyticsData, undefined>;

