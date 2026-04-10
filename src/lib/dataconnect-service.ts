'use client';

import { 
  upsertStaff, 
  upsertPatient, 
  addInventoryItem, 
  updateStock, 
  logTransaction, 
  createInvoice, 
  archiveLabReport,
  getInventory,
  getPatientHistory,
  getLatestInvoice,
  getGlobalAnalytics,
  updateInvoiceStatus
} from '@/dataconnect-generated';
import { DataConnect } from 'firebase/data-connect';

/**
 * DataConnectService
 * Provides a clean API for interacting with the PostgreSQL database via Data Connect.
 * Each method requires a DataConnect instance (usually from useDataConnect()).
 */
export const DataConnectService = {
  // Staff
  async syncStaff(dc: DataConnect, staff: { id: string, firstName: string, lastName: string, role: string, email: string, specialty?: string, phone?: string }) {
    return upsertStaff(dc, staff);
  },

  // Patients
  async syncPatient(dc: DataConnect, patient: { id: string, firstName: string, lastName: string, nationalId?: string, gender?: string, bloodGroup?: string }) {
    return upsertPatient(dc, patient);
  },

  async getPatientMedicalHistory(dc: DataConnect, patientId: string) {
    const { data } = await getPatientHistory(dc, { patientId });
    return data.patientDetail;
  },

  // Inventory
  async fetchInventory(dc: DataConnect) {
    const { data } = await getInventory(dc);
    return data.inventoryItems;
  },

  async addNewInventoryItem(dc: DataConnect, item: { name: string, category: string, unitPrice: number, initialStock: number, reorderLevel: number }) {
    return addInventoryItem(dc, item);
  },

  async adjustStock(dc: DataConnect, itemId: string, newStock: number, change: number, reason: string, staffId?: string) {
    // 1. Update the current stock
    await updateStock(dc, { itemId, newStock });
    
    // 2. Log the transaction
    return logTransaction(dc, {
      itemId,
      type: change > 0 ? 'STOCK_IN' : 'STOCK_OUT',
      quantity: Math.abs(change),
      reason,
      staffId
    });
  },

  // Billing
  async generateInvoice(dc: DataConnect, data: { 
    patientId: string, 
    items: any[], 
    totalAmount: number,
    amountPatient: number,
    amountInsurance: number,
    reason: string
  }) {
    return createInvoice(dc, {
      patientId: data.patientId,
      items: JSON.stringify(data.items),
      totalAmount: data.totalAmount,
      amountPatient: data.amountPatient,
      amountInsurance: data.amountInsurance,
      reason: data.reason
    });
  },

  async validateInvoice(dc: DataConnect, id: string) {
    return await updateInvoiceStatus(dc, { id, status: 'PAID' });
  },

  async cancelInvoice(dc: DataConnect, id: string) {
    return await updateInvoiceStatus(dc, { id, status: 'CANCELLED' });
  },

  async fetchLatestInvoice(dc: DataConnect, patientId: string) {
    const { data } = await getLatestInvoice(dc, { patientId });
    return data.invoices[0];
  },

  // Lab
  async archiveResults(dc: DataConnect, patientId: string, consultationId: string, results: any, interpretations?: string) {
    return archiveLabReport(dc, {
      patientId,
      consultationId,
      testResults: JSON.stringify(results),
      interpretations
    });
  },

  // Analytics
  async fetchGlobalStats(dc: DataConnect) {
    const { data } = await getGlobalAnalytics(dc);
    
    // Group by month
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const revenueByMonth = Array(12).fill(0).map((_, i) => ({ month: months[i], revenue: 0 }));
    
    let totalRevenue = 0;
    let pendingCollection = 0;

    data.invoices.forEach(inv => {
      // In the context of hospital accounting: 
      // Revenue is what has been PAID. 
      // Pending is what is PENDING payment by patient or insurance.
      if (inv.status === 'PAID') {
        totalRevenue += inv.totalAmount;
      } else if (inv.status === 'PENDING') {
        pendingCollection += inv.totalAmount;
      }
      
      try {
        const date = new Date(inv.createdAt);
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          revenueByMonth[monthIndex].revenue += inv.status === 'PAID' ? inv.totalAmount : 0;
        }
      } catch (e) {
        console.warn("Invalid date in invoice:", inv.createdAt);
      }
    });
      
    return {
      totalRevenue,
      pendingCollection,
      recoveryRate: totalRevenue > 0 ? Math.round(((totalRevenue - pendingCollection) / totalRevenue) * 100) : 0,
      invoiceCount: data.invoices.length,
      revenueByMonth
    };
  }
};
