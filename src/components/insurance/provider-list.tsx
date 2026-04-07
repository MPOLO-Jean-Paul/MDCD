'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './provider-table-columns';
import { Skeleton } from '../ui/skeleton';
import { InsuranceProvider } from '@/types/insurance';

export function ProviderList() {
  const firestore = useFirestore();
  
  const providersCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'insurance_providers') : null,
    [firestore]
  );
  
  const { data: providers, isLoading, error } = useCollection<Omit<InsuranceProvider, 'id'>>(providersCollectionRef);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Erreur lors du chargement des assurances : {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={providers || []} />
  );
}
