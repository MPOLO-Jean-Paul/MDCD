'use client'

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Patient } from '@/types/patient';
import { Consultation } from '@/types/consultation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Skeleton } from '../ui/skeleton';
import { Users, Stethoscope } from 'lucide-react';

interface PatientsByYear {
    [year: string]: Patient[];
}
interface PatientsByDiagnosis {
    [diagnosis: string]: Patient[];
}

export function ClinicalReportsTab() {
    const firestore = useFirestore();

    const patientsCollectionRef = useMemoFirebase(
      () => firestore ? collection(firestore, 'patients') : null,
      [firestore]
    );
    const consultationsCollectionRef = useMemoFirebase(
        () => firestore ? collection(firestore, 'consultations') : null,
        [firestore]
    );

    const { data: patients, isLoading: isLoadingPatients } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);
    const { data: consultations, isLoading: isLoadingConsultations } = useCollection<Omit<Consultation, 'id'>>(consultationsCollectionRef);
    
    const isLoading = isLoadingPatients || isLoadingConsultations;

    const clinicalData = useMemo(() => {
        if (!patients || !consultations) {
            return { byYear: {}, byDiagnosis: {} };
        }

        const patientsMap = new Map(patients.map(p => [p.id, p]));

        const byYear = patients.reduce((acc: PatientsByYear, patient) => {
            const year = new Date(patient.dateOfBirth).getFullYear().toString();
            if (!acc[year]) acc[year] = [];
            acc[year].push(patient);
            return acc;
        }, {});
        
        const byDiagnosis = consultations.reduce((acc: PatientsByDiagnosis, consult) => {
            const patient = patientsMap.get(consult.patientId);
            if (patient) {
                const diagnosis = consult.diagnosis || "Non spécifié";
                if (!acc[diagnosis]) acc[diagnosis] = [];
                // Avoid adding duplicate patients for the same diagnosis
                if (!acc[diagnosis].some(p => p.id === patient.id)) {
                    acc[diagnosis].push(patient);
                }
            }
            return acc;
        }, {});

        // Sort byYear keys (years) in descending order
        const sortedByYear = Object.keys(byYear)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .reduce((obj: PatientsByYear, key) => {
                obj[key] = byYear[key];
                return obj;
            }, {});

        return { byYear: sortedByYear, byDiagnosis };
    }, [patients, consultations]);

    if (isLoading) {
        return (
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Patients par Année de Naissance
                    </CardTitle>
                    <CardDescription>Classement des patients par leur année de naissance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {Object.entries(clinicalData.byYear).map(([year, patientList]) => (
                            <AccordionItem value={year} key={year}>
                                <AccordionTrigger>{year} ({patientList.length} patients)</AccordionTrigger>
                                <AccordionContent>
                                    <ul className='list-disc pl-4'>
                                        {patientList.map(p => <li key={p.id}>{p.firstName} {p.lastName}</li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Patients par Diagnostic
                    </CardTitle>
                    <CardDescription>Classement des patients par diagnostic médical.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {Object.entries(clinicalData.byDiagnosis).map(([diagnosis, patientList]) => (
                             <AccordionItem value={diagnosis} key={diagnosis}>
                                <AccordionTrigger>{diagnosis} ({patientList.length} patients)</AccordionTrigger>
                                <AccordionContent>
                                    <ul className='list-disc pl-4'>
                                        {patientList.map(p => <li key={p.id}>{p.firstName} {p.lastName}</li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
