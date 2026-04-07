'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './invoice-table-columns';
import { Skeleton } from '../ui/skeleton';
import { InvoiceWithPatient } from '@/types/invoice';

// Using mock data for demonstration as backend collections might be empty
const mockInvoices: InvoiceWithPatient[] = [
    {
        id: 'INV-2024001',
        patientId: 'PAT-001',
        patientName: 'Amina Diallo',
        invoiceDate: new Date('2024-07-20').toISOString(),
        dueDate: new Date('2024-08-20').toISOString(),
        totalAmount: 75000,
        amountPaid: 75000,
        balanceDue: 0,
        status: 'Paid',
        generatedByUserId: 'admin-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'INV-2024002',
        patientId: 'PAT-002',
        patientName: 'Moussa Traoré',
        invoiceDate: new Date('2024-07-18').toISOString(),
        dueDate: new Date('2024-08-18').toISOString(),
        totalAmount: 150000,
        amountPaid: 50000,
        balanceDue: 100000,
        status: 'Partially Paid',
        generatedByUserId: 'admin-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'INV-2024003',
        patientId: 'PAT-003',
        patientName: 'Ibrahim Koné',
        invoiceDate: new Date('2024-06-15').toISOString(),
        dueDate: new Date('2024-07-15').toISOString(),
        totalAmount: 25000,
        amountPaid: 0,
        balanceDue: 25000,
        status: 'Overdue',
        generatedByUserId: 'admin-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'INV-2024004',
        patientId: 'PAT-004',
        patientName: 'Fatou Ndiaye',
        invoiceDate: new Date('2024-07-21').toISOString(),
        dueDate: new Date('2024-08-21').toISOString(),
        totalAmount: 45000,
        amountPaid: 0,
        balanceDue: 45000,
        status: 'Pending',
        generatedByUserId: 'admin-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
]


export function InvoiceList() {
  // The Firebase hooks are kept for future integration, but we use mock data for now.
  const isLoading = false; // Simulating loaded state
  const error = null; // Simulating no error

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Erreur lors du chargement des factures: {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={mockInvoices} />
  );
}
