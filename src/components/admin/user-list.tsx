'use client';

import { useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DataTable } from '@/components/ui/data-table';
import { columns, UserProfile } from './user-table-columns';
import { Skeleton } from '../ui/skeleton';

export function UserList() {
  const firestore = useFirestore();
  
  const usersCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'users') : null,
    [firestore]
  );
  
  const { data: users, isLoading, error } = useCollection<Omit<UserProfile, 'id'>>(usersCollectionRef);

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
    return <p className="text-destructive">Erreur lors du chargement des utilisateurs : {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={users || []} />
  );
}
