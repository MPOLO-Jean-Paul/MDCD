'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './admission-table-columns';
import { Skeleton } from '../ui/skeleton';
import { AdmissionWithPatient } from '@/types/admission';
import { v4 as uuidv4 } from 'uuid';

const mockAdmissions: AdmissionWithPatient[] = [
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    patientName: 'Amina Diallo',
    patientGender: 'Féminin',
    patientDOB: '1990-05-15',
    admissionDateTime: new Date('2024-07-22T10:30:00').toISOString(),
    admissionType: 'Rendez-vous',
    reasonForAdmission: 'Consultation de suivi',
    status: 'Completed',
    admittingUserId: 'user-rec-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    patientId: 'PAT-002',
    patientName: 'Moussa Traoré',
    patientGender: 'Masculin',
    patientDOB: '1985-11-20',
    admissionDateTime: new Date('2024-07-22T09:00:00').toISOString(),
    admissionType: 'Urgence',
    reasonForAdmission: 'Douleurs abdominales aiguës',
    status: 'Admitted',
    admittingUserId: 'user-rec-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    patientId: 'PAT-003',
    patientName: 'Ibrahim Koné',
    patientGender: 'Masculin',
    patientDOB: '2001-01-30',
    admissionDateTime: new Date('2024-07-21T14:00:00').toISOString(),
    admissionType: 'Hospitalisation',
    reasonForAdmission: 'Chirurgie programmée du genou',
    status: 'Admitted',
    bedId: 'BED-101A',
    admittingUserId: 'user-rec-02',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    patientId: 'PAT-004',
    patientName: 'Fatou Ndiaye',
    patientGender: 'Féminin',
    patientDOB: '1998-09-05',
    admissionDateTime: new Date('2024-07-22T11:00:00').toISOString(),
    admissionType: 'Rendez-vous',
    reasonForAdmission: 'Contrôle prénatal',
    status: 'Pending',
    admittingUserId: 'user-rec-02',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


export function AdmissionList() {
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
    return <p className="text-destructive">Erreur lors du chargement des admissions: {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={mockAdmissions} />
  );
}
