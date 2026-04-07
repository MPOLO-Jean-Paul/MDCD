'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './consultation-table-columns';
import { Skeleton } from '../ui/skeleton';
import { Consultation } from '@/types/consultation';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Patient } from '@/types/patient';
import { useUserProfile } from '@/firebase/auth-provider';

export function ConsultationList() {
  const firestore = useFirestore();
  const { profile } = useUserProfile();

  const consultationsQuery = useMemoFirebase(
    () => {
      if (!firestore || !profile) return null;
      // Admins see all, doctors see only their own
      if (profile.roleName === 'admin') {
        return query(collection(firestore, 'consultations'), orderBy('consultationDateTime', 'desc'));
      }
      return query(collection(firestore, 'consultations'), where('consultingDoctorId', '==', profile.id), orderBy('consultationDateTime', 'desc'));
    },
    [firestore, profile]
  );
  
  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );

  const { data: consultations, isLoading: isLoadingConsultations, error: consultationsError } = useCollection<Omit<Consultation, 'id'>>(consultationsQuery);
  const { data: patients, isLoading: isLoadingPatients, error: patientsError } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);
  
  const isLoading = isLoadingConsultations || isLoadingPatients;
  const error = consultationsError || patientsError;
  
  const consultationsWithPatientData = useMemo(() => {
    if (!consultations || !patients) return [];
    const patientsMap = new Map(patients.map(p => [p.id, p]));
    return consultations.map(consultation => {
      const patient = patientsMap.get(consultation.patientId);
      return {
          ...consultation,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu',
      }
    });
  }, [consultations, patients]);

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
    return <p className="text-destructive">Erreur lors du chargement des consultations: {error.message}</p>;
  }

  return (
    <DataTable columns={columns} data={consultationsWithPatientData} />
  );
}
