'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './stock-table-columns';
import { Skeleton } from '../ui/skeleton';
import { HospitalDataService } from '@/lib/firestore-service';

export function StockList() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function loadInventory() {
      try {
        setIsLoading(true);
        const data = await HospitalDataService.getInventory();
        setInventory(data || []);
      } catch (e) {
        console.error("Error loading inventory:", e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadInventory();
  }, []);

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

  // Adapted inventory data for the columns
  const displayData = inventory.map(item => ({
    ...item,
    medicationName: item.name, // Mapping 'name' to the expected column key
    currentQuantity: item.currentStock, // Mapping 'currentStock' to the expected column key
    expirationDate: item.updatedAt, // Fallback for demo
  }));

  return (
    <DataTable columns={columns} data={displayData} />
  );
}
