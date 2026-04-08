'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '../billing/invoice-table-columns';
import { Skeleton } from '../ui/skeleton';
import { Invoice } from '@/types/invoice';
import { Patient } from '@/types/patient';


export function InvoicesToProcessList() {
  const firestore = useFirestore();

  const invoicesQuery = useMemoFirebase(
    () => firestore ? query(
        collection(firestore, 'invoices'), 
        where('status', 'in', ['Pending', 'Partially Paid', 'Disputed', 'Overdue']),
        orderBy('invoiceDate', 'desc')
    ) : null,
    [firestore]
  );
  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );

  const { data: invoices, isLoading: isLoadingInvoices, error: invoicesError } = useCollection<Omit<Invoice, 'id'>>(invoicesQuery);
  const { data: patients, isLoading: isLoadingPatients, error: patientsError } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);

  const isLoading = isLoadingInvoices || isLoadingPatients;
  const error = invoicesError || patientsError;
  
  const invoicesWithPatientName = useMemo(() => {
    if (!invoices || !patients) return [];
    const patientsMap = new Map(patients.map(p => [p.id, `${p.firstName} ${p.lastName}`]));
    return invoices.map(invoice => ({
        ...invoice,
        patientName: patientsMap.get(invoice.patientId) || 'Patient inconnu'
    }));
  }, [invoices, patients]);


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
    <DataTable columns={columns} data={invoicesWithPatientName} />
  );
}
