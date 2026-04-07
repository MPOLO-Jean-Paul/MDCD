'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './patient-table-columns';
import { Skeleton } from '../ui/skeleton';
import { Patient, PatientWithInsurance } from '@/types/patient';
import { InsuranceProvider } from '@/types/insurance';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collection } from 'firebase/firestore';

export function PatientList() {
  const firestore = useFirestore();
  
  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );
  const providersCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'insurance_providers') : null,
    [firestore]
  );

  const { data: patients, isLoading: isLoadingPatients, error: patientsError } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);
  const { data: insuranceProviders, isLoading: isLoadingProviders, error: providersError } = useCollection<Omit<InsuranceProvider, 'id'>>(providersCollectionRef);

  const isLoading = isLoadingPatients || isLoadingProviders;
  const error = patientsError || providersError;

  const patientWithInsuranceData: WithId<PatientWithInsurance>[] = useMemo(() => {
    if (!patients || !insuranceProviders) return [];
    
    const providersMap = new Map(insuranceProviders.map(p => [p.id, p.name]));

    return patients.map(patient => {
      const providerName = patient.insuranceProviderId 
        ? providersMap.get(patient.insuranceProviderId) 
        : undefined;
      
      return {
        ...patient,
        insuranceProviderName: providerName || 'Particulier'
      };
    });
  }, [patients, insuranceProviders]);


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
    <DataTable columns={columns} data={patientWithInsuranceData} />
  );
}
