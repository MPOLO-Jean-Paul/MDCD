import { UpsertStaffData, UpsertStaffVariables, UpsertPatientData, UpsertPatientVariables, AddInventoryItemData, AddInventoryItemVariables, UpdateStockData, UpdateStockVariables, LogTransactionData, LogTransactionVariables, CreateInvoiceData, CreateInvoiceVariables, UpdateInvoiceStatusData, UpdateInvoiceStatusVariables, ArchiveLabReportData, ArchiveLabReportVariables, GetInventoryData, GetPatientHistoryData, GetPatientHistoryVariables, GetLatestInvoiceData, GetLatestInvoiceVariables, GetGlobalAnalyticsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertStaff(options?: useDataConnectMutationOptions<UpsertStaffData, FirebaseError, UpsertStaffVariables>): UseDataConnectMutationResult<UpsertStaffData, UpsertStaffVariables>;
export function useUpsertStaff(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertStaffData, FirebaseError, UpsertStaffVariables>): UseDataConnectMutationResult<UpsertStaffData, UpsertStaffVariables>;

export function useUpsertPatient(options?: useDataConnectMutationOptions<UpsertPatientData, FirebaseError, UpsertPatientVariables>): UseDataConnectMutationResult<UpsertPatientData, UpsertPatientVariables>;
export function useUpsertPatient(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertPatientData, FirebaseError, UpsertPatientVariables>): UseDataConnectMutationResult<UpsertPatientData, UpsertPatientVariables>;

export function useAddInventoryItem(options?: useDataConnectMutationOptions<AddInventoryItemData, FirebaseError, AddInventoryItemVariables>): UseDataConnectMutationResult<AddInventoryItemData, AddInventoryItemVariables>;
export function useAddInventoryItem(dc: DataConnect, options?: useDataConnectMutationOptions<AddInventoryItemData, FirebaseError, AddInventoryItemVariables>): UseDataConnectMutationResult<AddInventoryItemData, AddInventoryItemVariables>;

export function useUpdateStock(options?: useDataConnectMutationOptions<UpdateStockData, FirebaseError, UpdateStockVariables>): UseDataConnectMutationResult<UpdateStockData, UpdateStockVariables>;
export function useUpdateStock(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStockData, FirebaseError, UpdateStockVariables>): UseDataConnectMutationResult<UpdateStockData, UpdateStockVariables>;

export function useLogTransaction(options?: useDataConnectMutationOptions<LogTransactionData, FirebaseError, LogTransactionVariables>): UseDataConnectMutationResult<LogTransactionData, LogTransactionVariables>;
export function useLogTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<LogTransactionData, FirebaseError, LogTransactionVariables>): UseDataConnectMutationResult<LogTransactionData, LogTransactionVariables>;

export function useCreateInvoice(options?: useDataConnectMutationOptions<CreateInvoiceData, FirebaseError, CreateInvoiceVariables>): UseDataConnectMutationResult<CreateInvoiceData, CreateInvoiceVariables>;
export function useCreateInvoice(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInvoiceData, FirebaseError, CreateInvoiceVariables>): UseDataConnectMutationResult<CreateInvoiceData, CreateInvoiceVariables>;

export function useUpdateInvoiceStatus(options?: useDataConnectMutationOptions<UpdateInvoiceStatusData, FirebaseError, UpdateInvoiceStatusVariables>): UseDataConnectMutationResult<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
export function useUpdateInvoiceStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateInvoiceStatusData, FirebaseError, UpdateInvoiceStatusVariables>): UseDataConnectMutationResult<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

export function useArchiveLabReport(options?: useDataConnectMutationOptions<ArchiveLabReportData, FirebaseError, ArchiveLabReportVariables>): UseDataConnectMutationResult<ArchiveLabReportData, ArchiveLabReportVariables>;
export function useArchiveLabReport(dc: DataConnect, options?: useDataConnectMutationOptions<ArchiveLabReportData, FirebaseError, ArchiveLabReportVariables>): UseDataConnectMutationResult<ArchiveLabReportData, ArchiveLabReportVariables>;

export function useGetInventory(options?: useDataConnectQueryOptions<GetInventoryData>): UseDataConnectQueryResult<GetInventoryData, undefined>;
export function useGetInventory(dc: DataConnect, options?: useDataConnectQueryOptions<GetInventoryData>): UseDataConnectQueryResult<GetInventoryData, undefined>;

export function useGetPatientHistory(vars: GetPatientHistoryVariables, options?: useDataConnectQueryOptions<GetPatientHistoryData>): UseDataConnectQueryResult<GetPatientHistoryData, GetPatientHistoryVariables>;
export function useGetPatientHistory(dc: DataConnect, vars: GetPatientHistoryVariables, options?: useDataConnectQueryOptions<GetPatientHistoryData>): UseDataConnectQueryResult<GetPatientHistoryData, GetPatientHistoryVariables>;

export function useGetLatestInvoice(vars: GetLatestInvoiceVariables, options?: useDataConnectQueryOptions<GetLatestInvoiceData>): UseDataConnectQueryResult<GetLatestInvoiceData, GetLatestInvoiceVariables>;
export function useGetLatestInvoice(dc: DataConnect, vars: GetLatestInvoiceVariables, options?: useDataConnectQueryOptions<GetLatestInvoiceData>): UseDataConnectQueryResult<GetLatestInvoiceData, GetLatestInvoiceVariables>;

export function useGetGlobalAnalytics(options?: useDataConnectQueryOptions<GetGlobalAnalyticsData>): UseDataConnectQueryResult<GetGlobalAnalyticsData, undefined>;
export function useGetGlobalAnalytics(dc: DataConnect, options?: useDataConnectQueryOptions<GetGlobalAnalyticsData>): UseDataConnectQueryResult<GetGlobalAnalyticsData, undefined>;
