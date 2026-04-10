import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Centralized Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Hospital Data Service (PostgreSQL/Supabase)
 * DEPRECATED/INACTIVE: The application currently uses '@/lib/firestore-service' 
 * as the primary data store for all tables.
 */
export const HospitalDataService = {
  // --- PATIENTS & DOSSIERS (Management) ---
  async syncPatientToManagement(patientData: any) {
    const { data, error } = await supabase
      .from('PatientDetail')
      .upsert({
        id: patientData.id, // Keep IDs synced between Firestore/Postgres
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        nationalId: patientData.nationalId,
        gender: patientData.gender,
        bloodGroup: patientData.bloodGroup,
        updatedAt: new Date().toISOString()
      })
      .select();
    if (error) console.error('Supabase Sync Error:', error);
    return data;
  },

  async getPatientMedicalHistory(patientId: string) {
    const { data, error } = await supabase
      .from('PatientDetail')
      .select('medicalHistory, familyHistory, allergies')
      .eq('id', patientId)
      .single();
    if (error) return null;
    return data;
  },

  // --- FACTURATION (Finance) ---
  async getInvoiceStatus(patientId: string) {
    const { data, error } = await supabase
      .from('Invoice')
      .select('*')
      .eq('patientId', patientId)
      .order('createdAt', { ascending: false })
      .limit(1);
    if (error) return null;
    return data?.[0] || null;
  },

  async createInvoice(patientId: string, items: any[], total: number) {
    const { data, error } = await supabase
      .from('Invoice')
      .insert({
        patientId,
        items,
        totalAmount: total,
        status: 'UNPAID',
        createdAt: new Date().toISOString()
      })
      .select();
    if (error) throw error;
    return data?.[0];
  },

  // --- STAFF & PROFILES ---
  async syncStaffProfile(staffData: any) {
    const { data, error } = await supabase
      .from('Staff')
      .upsert({
        id: staffData.id,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        role: staffData.role,
        specialty: staffData.specialty || '',
        updatedAt: new Date().toISOString()
      });
    if (error) console.error('Staff Sync Error:', error);
    return data;
  },

  // --- PHARMACY & STOCKS ---
  async getInventory() {
    const { data, error } = await supabase
      .from('InventoryItem')
      .select('*')
      .order('name', { ascending: true });
    if (error) return [];
    return data;
  },

  async updateStock(itemId: string, quantityChange: number, reason: string, staffId: string) {
    // 1. Get current stock
    const { data: item } = await supabase.from('InventoryItem').select('currentStock').eq('id', itemId).single();
    if (!item) return null;

    const newStock = (item.currentStock || 0) + quantityChange;

    // 2. Update Item
    await supabase.from('InventoryItem').update({ currentStock: newStock, updatedAt: new Date().toISOString() }).eq('id', itemId);

    // 3. Log Transaction
    await supabase.from('InventoryTransaction').insert({
      itemId,
      type: quantityChange > 0 ? 'IN' : 'OUT',
      quantity: Math.abs(quantityChange),
      reason,
      staffId,
      performedAt: new Date().toISOString()
    });

    return newStock;
  },

  async addInventoryItem(item: any) {
    const { data, error } = await supabase
      .from('InventoryItem')
      .insert({
        name: item.name,
        description: item.description,
        category: item.category,
        unitPrice: item.unitPrice,
        reorderLevel: item.reorderLevel || 10,
        currentStock: item.initialStock || 0,
        createdAt: new Date().toISOString()
      })
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async getLowStockItems() {
    // This is better done with a Postgres view or a specific query
    const { data, error } = await supabase
      .from('InventoryItem')
      .select('*');
    if (error) return [];
    return data.filter((item: any) => item.currentStock <= item.reorderLevel);
  },

  // --- LABORATOIRE & ARCHIVES ---
  async archiveLabReport(report: any) {
    const { data, error } = await supabase
      .from('LabReportArchive')
      .insert({
        patientId: report.patientId,
        consultationId: report.consultationId,
        testResults: report.results,
        interpretations: report.notes,
        archivedAt: new Date().toISOString()
      });
    if (error) console.error('Archiving Error:', error);
    return data;
  },

  // --- DASHBOARD ANALYTICS (Heavy Duty) ---
  async getGlobalAnalytics() {
    const { data: invoices } = await supabase.from('Invoice').select('totalAmount, status');
    
    const totalRevenue = invoices?.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0) || 0;
    const pendingCollection = invoices?.filter(i => i.status === 'UNPAID')
      .reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0) || 0;

    return {
      totalRevenue,
      pendingCollection,
      recoveryRate: totalRevenue > 0 ? Math.round(((totalRevenue - pendingCollection) / totalRevenue) * 100) : 0
    };
  }
};
