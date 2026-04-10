import { initializeFirebase } from '@/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  increment,
  runTransaction,
  Timestamp
} from 'firebase/firestore';

/**
 * Helper to get the Firebase services asynchronously.
 */
async function getServices() {
  return await initializeFirebase();
}

import { DataConnectService } from './dataconnect-service';

/**
 * HospitalDataService - Hybrid Implementation
 * Bridges Firestore (Real-time) and Data Connect (PostgreSQL).
 */
export const HospitalDataService = {
  // --- PATIENTS & DOSSIERS (SQL Backend) ---
  async syncPatientToManagement(patientData: any) {
    const { dataConnect } = await getServices();
    return DataConnectService.syncPatient(dataConnect, patientData);
  },

  async getPatientMedicalHistory(patientId: string) {
    const { dataConnect } = await getServices();
    return DataConnectService.getPatientMedicalHistory(dataConnect, patientId);
  },

  // --- FACTURATION (Finance - SQL Backend) ---
  async getInvoiceStatus(patientId: string) {
    const { dataConnect } = await getServices();
    return DataConnectService.fetchLatestInvoice(dataConnect, patientId);
  },

  async createInvoice(patientId: string, items: any[], total: number) {
    const { dataConnect } = await getServices();
    return DataConnectService.generateInvoice(dataConnect, patientId, items, total);
  },

  // --- STAFF & PROFILES (SQL Backend) ---
  async syncStaffProfile(staffData: any) {
    const { dataConnect } = await getServices();
    return DataConnectService.syncStaff(dataConnect, staffData);
  },

  // --- PHARMACY & STOCKS (SQL Backend) ---
  async getInventory() {
    const { dataConnect } = await getServices();
    return DataConnectService.fetchInventory(dataConnect);
  },

  async updateStock(itemId: string, quantityChange: number, reason: string, staffId: string) {
    const { dataConnect } = await getServices();
    // Fetch current item to get local count for the non-atomic update (or use transaction)
    const inventory = await DataConnectService.fetchInventory(dataConnect);
    const item = inventory.find(i => i.id === itemId);
    if (!item) throw new Error("Item not found");
    
    const newStock = item.currentStock + quantityChange;
    return DataConnectService.adjustStock(dataConnect, itemId, newStock, quantityChange, reason, staffId);
  },

  async addInventoryItem(item: any) {
    const { dataConnect } = await getServices();
    return DataConnectService.addNewInventoryItem(dataConnect, item);
  },

  async getLowStockItems() {
    const db = await getDB();
    const inventoryRef = collection(db, 'inventory');
    const snap = await getDocs(inventoryRef);
    // Firestore limited inequality query: we might need to filter client-side 
    // or use multiple inequality operators if we want complex logic.
    // Simplifying: get all and filter (for smaller inventories) or perform a simple inequality.
    return snap.docs
      .map(doc = \u003e ({ id: doc.id, ...doc.data() as any }))
      .filter(item = \u003e item.currentStock \u003c= item.reorderLevel);
  },

  // --- LABORATOIRE & ARCHIVES (SQL Backend) ---
  async archiveLabReport(report: any) {
    const { dataConnect } = await getServices();
    return DataConnectService.archiveResults(dataConnect, report.patientId, report.consultationId, report.results, report.notes);
  },

  // --- DASHBOARD ANALYTICS (SQL Backend) ---
  async getGlobalAnalytics() {
    const { dataConnect } = await getServices();
    return DataConnectService.fetchGlobalStats(dataConnect);
  }
};
