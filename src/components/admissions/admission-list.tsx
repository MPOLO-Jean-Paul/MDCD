'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './admission-table-columns';
import { Skeleton } from '../ui/skeleton';
import { Admission, AdmissionWithPatient } from '@/types/admission';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Patient } from '@/types/patient';

export function AdmissionList() {
  const firestore = useFirestore();

  const admissionsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'admissions'), orderBy('admissionDateTime', 'desc')) : null,
    [firestore]
  );
  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );

  const { data: admissions, isLoading: isLoadingAdmissions, error: admissionsError } = useCollection<Omit<Admission, 'id'>>(admissionsQuery);
  const { data: patients, isLoading: isLoadingPatients, error: patientsError } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);

  const isLoading = isLoadingAdmissions || isLoadingPatients;
  const error = admissionsError || patientsError;
  
  const admissionsWithPatientData = useMemo(() => {
    if (!admissions || !patients) return [];
    const patientsMap = new Map(patients.map(p => [p.id, p]));
    return admissions.map(admission => {
      const patient = patientsMap.get(admission.patientId);
      return {
          ...admission,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu',
          patientGender: patient?.gender,
          patientDOB: patient?.dateOfBirth,
      }
    });
  }, [admissions, patients]);

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
    <DataTable columns={columns} data={admissionsWithPatientData} />
  );
}
