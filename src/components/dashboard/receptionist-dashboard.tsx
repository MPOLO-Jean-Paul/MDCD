'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users2, Cake } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';
import { ScrollArea } from '../ui/scroll-area';

interface PatientsByYear {
    [year: string]: number;
}

export function ReceptionistDashboard() {
    const firestore = useFirestore();
    const patientsCollectionRef = useMemoFirebase(
        () => firestore ? collection(firestore, 'patients') : null,
        [firestore]
    );
    const { data: patients, isLoading, error } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);

    const dashboardStats = useMemo(() => {
        if (!patients) return { total: 0, byYear: {} };
        
        const byYear = patients.reduce((acc: PatientsByYear, patient) => {
            const year = new Date(patient.dateOfBirth).getFullYear().toString();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        const sortedYears = Object.entries(byYear).sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA));

        return {
            total: patients.length,
            byYear: Object.fromEntries(sortedYears),
        };
    }, [patients]);


    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-72 lg:col-span-2" />
            </div>
        )
    }

    if (error) {
        return <p className="text-destructive">Erreur de chargement des données du tableau de bord: {error.message}</p>
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nombre total de patients</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.total}</div>
              <p className="text-xs text-muted-foreground">Patients enregistrés dans le système</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cake className="h-5 w-5" />
                Patients par année de naissance
              </CardTitle>
              <CardDescription>
                Distribution des patients enregistrés par leur année de naissance.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                        {Object.entries(dashboardStats.byYear).length > 0 ? (
                             Object.entries(dashboardStats.byYear).map(([year, count]) => (
                                <div key={year} className="flex items-center">
                                    <div className="font-medium">{year}</div>
                                    <div className="ml-auto text-muted-foreground">{count} patient(s)</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">Aucun patient trouvé.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
          </Card>
        </div>
    )
}
