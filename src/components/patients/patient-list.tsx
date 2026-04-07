'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './patient-table-columns';
import { Skeleton } from '../ui/skeleton';
import { Patient } from '@/types/patient';
import { v4 as uuidv4 } from 'uuid';
import { WithId } from '@/firebase';

const mockPatients: WithId<Omit<Patient, 'id'>>[] = [
    {
      id: uuidv4(),
      firstName: 'Amina',
      lastName: 'Diallo',
      dateOfBirth: '1990-05-15T00:00:00.000Z',
      gender: 'Féminin',
      phone: '+221 77 123 45 67',
      email: 'amina.d@email.com',
      address: '123, Rue de Dakar',
      bloodGroup: 'O+',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      firstName: 'Moussa',
      lastName: 'Traoré',
      dateOfBirth: '1985-11-20T00:00:00.000Z',
      gender: 'Masculin',
      phone: '+221 77 987 65 43',
      email: 'm.traore@email.com',
      address: '456, Avenue de St-Louis',
      bloodGroup: 'A-',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      firstName: 'Ibrahim',
      lastName: 'Koné',
      dateOfBirth: '2001-01-30T00:00:00.000Z',
      gender: 'Masculin',
      phone: '+221 78 456 12 34',
      email: 'ib.kone@email.com',
      address: '789, Boulevard de Thiès',
      bloodGroup: 'B+',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      firstName: 'Fatou',
      lastName: 'Ndiaye',
      dateOfBirth: '1998-09-05T00:00:00.000Z',
      gender: 'Féminin',
      phone: '+221 76 555 88 99',
      email: 'fatou.ndiaye@email.com',
      address: '101, Corniche Ouest',
      bloodGroup: 'AB+',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  

export function PatientList() {
  const isLoading = false; // Simulating loaded state
  const error = null; // Simulating no error

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
    <DataTable columns={columns} data={mockPatients} />
  );
}
