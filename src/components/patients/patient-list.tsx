'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './patient-table-columns';
import { Skeleton } from '../ui/skeleton';
import { Patient } from '@/types/patient';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export function PatientList() {
  const firestore = useFirestore();
  
  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );

  const { data: patients, isLoading, error } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Erreur lors du chargement des patients : {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={patients || []} />
  );
}
