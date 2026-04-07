'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DataTable } from '@/components/ui/data-table';
import { columns, Service } from './service-table-columns';
import { Skeleton } from '../ui/skeleton';
import type { UserProfile } from '../admin/user-table-columns';

export function ServiceList() {
  const firestore = useFirestore();
  
  const servicesCollectionRef = useMemoFirebase(
    () => collection(firestore, 'services'),
    [firestore]
  );

  const usersCollectionRef = useMemoFirebase(
    () => collection(firestore, 'users'),
    [firestore]
  );
  
  const { data: services, isLoading: isLoadingServices, error: servicesError } = useCollection<Omit<Service, 'id'>>(servicesCollectionRef);
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useCollection<Omit<UserProfile, 'id'>>(usersCollectionRef);

  const isLoading = isLoadingServices || isLoadingUsers;
  const error = servicesError || usersError;

  const servicesWithUserName = useMemo(() => {
    if (!services || !users) return [];
    const usersMap = new Map(users.map(u => [u.id, `${u.firstName} ${u.lastName}`]));
    return services.map(service => ({
      ...service,
      responsibleUserName: service.responsibleUserId ? usersMap.get(service.responsibleUserId) || 'N/A' : 'N/A'
    }));
  }, [services, users]);

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
    return <p className="text-destructive">Erreur lors du chargement des services : {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={servicesWithUserName || []} />
  );
}
    