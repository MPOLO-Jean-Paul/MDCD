'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './stock-table-columns';
import { Skeleton } from '../ui/skeleton';
import { StockItem, Medication } from '@/types/medication';

export function StockList() {
  const firestore = useFirestore();
  
  const stockItemsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'stock_items') : null,
    [firestore]
  );
  const medicationsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'medications') : null,
    [firestore]
  );
  
  const { data: stockItems, isLoading: isLoadingStock, error: stockError } = useCollection<Omit<StockItem, 'id'>>(stockItemsCollectionRef);
  const { data: medications, isLoading: isLoadingMedications, error: medError } = useCollection<Omit<Medication, 'id'>>(medicationsCollectionRef);

  const isLoading = isLoadingStock || isLoadingMedications;
  const error = stockError || medError;

  const stockWithMedicationName = useMemo(() => {
    if (!stockItems || !medications) return [];
    const medicationsMap = new Map(medications.map(m => [m.id, { name: m.name, reorderLevel: m.reorderLevel, unitPrice: m.unitPrice }]));
    return stockItems.map(item => ({
      ...item,
      medicationName: medicationsMap.get(item.medicationId)?.name || 'Médicament inconnu',
      reorderLevel: medicationsMap.get(item.medicationId)?.reorderLevel || 0,
      unitPrice: medicationsMap.get(item.medicationId)?.unitPrice || 0,
    }));
  }, [stockItems, medications]);

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
    return <p className="text-destructive">Erreur lors du chargement des stocks : {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={stockWithMedicationName || []} />
  );
}
