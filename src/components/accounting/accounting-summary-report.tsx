'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Invoice } from '@/types/invoice';
import { Patient } from '@/types/patient';

interface MonthlySummary {
    category: 'Insured' | 'Private';
    patientCount: number;
    totalBilled: number;
}

export function AccountingSummaryReport() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const firestore = useFirestore();

    const collections = {
        invoices: useMemoFirebase(() => firestore ? collection(firestore, 'invoices') : null, [firestore]),
        patients: useMemoFirebase(() => firestore ? collection(firestore, 'patients') : null, [firestore]),
    };

    const { data: invoices, isLoading: loadingInvoices } = useCollection<Omit<Invoice, 'id'>>(collections.invoices);
    const { data: patients, isLoading: loadingPatients } = useCollection<Omit<Patient, 'id'>>(collections.patients);

    const isLoading = loadingInvoices || loadingPatients;

    const summaryData = useMemo((): MonthlySummary[] => {
        if (!invoices || !patients) return [];

        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);

        const monthlyInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.invoiceDate);
            return invDate >= start && invDate <= end;
        });

        const patientsMap = new Map(patients.map(p => [p.id, p]));
        
        const summary: Record<'Insured' | 'Private', { patientIds: Set<string>, totalBilled: number }> = {
            Insured: { patientIds: new Set(), totalBilled: 0 },
            Private: { patientIds: new Set(), totalBilled: 0 },
        };

        for (const invoice of monthlyInvoices) {
            const patient = patientsMap.get(invoice.patientId);
            if (!patient) continue;

            const category = patient.insuranceProviderId ? 'Insured' : 'Private';
            
            summary[category].patientIds.add(patient.id);
            summary[category].totalBilled += invoice.totalAmount;
        }
        
        return [
            {
                category: 'Insured',
                patientCount: summary.Insured.patientIds.size,
                totalBilled: summary.Insured.totalBilled,
            },
            {
                category: 'Private',
                patientCount: summary.Private.patientIds.size,
                totalBilled: summary.Private.totalBilled,
            }
        ];

    }, [invoices, patients, selectedMonth]);

    const monthOptions = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => {
            const date = subMonths(new Date(), i);
            return {
                value: date.toISOString(),
                label: format(date, "MMMM yyyy", { locale: fr })
            };
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <CardTitle>Rapport de Facturation Mensuel</CardTitle>
                        <CardDescription>
                            Montant total facturé pour les patients assurés et les particuliers.
                        </CardDescription>
                    </div>
                     <Select
                        value={selectedMonth.toISOString()}
                        onValueChange={(value) => setSelectedMonth(new Date(value))}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] mt-2 sm:mt-0">
                            <SelectValue placeholder="Sélectionnez un mois" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {summaryData.map(summary => (
                            <div key={summary.category} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div>
                                    <p className="font-semibold">{summary.category === 'Insured' ? 'Patients Assurés' : 'Patients Particuliers'}</p>
                                    <p className="text-sm text-muted-foreground">{summary.patientCount} patient(s) unique(s)</p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-bold text-lg'>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(summary.totalBilled)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

    