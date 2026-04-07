'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collection } from 'firebase/firestore';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Invoice } from '@/types/invoice';
import { Patient } from '@/types/patient';
import { InsuranceProvider } from '@/types/insurance';

interface MonthlySummary {
    providerId: string;
    providerName: string;
    patientCount: number;
    totalBilled: number;
    subscriptionFee?: number;
}

export function InsuranceSummaryReport() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const firestore = useFirestore();

    const collections = {
        invoices: useMemoFirebase(() => firestore ? collection(firestore, 'invoices') : null, [firestore]),
        patients: useMemoFirebase(() => firestore ? collection(firestore, 'patients') : null, [firestore]),
        providers: useMemoFirebase(() => firestore ? collection(firestore, 'insurance_providers') : null, [firestore]),
    };

    const { data: invoices, isLoading: loadingInvoices } = useCollection<Invoice>(collections.invoices);
    const { data: patients, isLoading: loadingPatients } = useCollection<Patient>(collections.patients);
    const { data: providers, isLoading: loadingProviders } = useCollection<InsuranceProvider>(collections.providers);

    const isLoading = loadingInvoices || loadingPatients || loadingProviders;

    const summaryData = useMemo((): MonthlySummary[] => {
        if (!invoices || !patients || !providers) return [];

        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);

        const monthlyInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.invoiceDate);
            return invDate >= start && invDate <= end;
        });

        const patientsMap = new Map(patients.map(p => [p.id, p]));
        
        const summaryByProvider = new Map<string, { patientIds: Set<string>, totalBilled: number }>();

        // Initialize for all providers
        providers.forEach(p => {
            summaryByProvider.set(p.id, { patientIds: new Set(), totalBilled: 0 });
        });
        // Special entry for private patients
        summaryByProvider.set('private', { patientIds: new Set(), totalBilled: 0 });


        for (const invoice of monthlyInvoices) {
            const patient = patientsMap.get(invoice.patientId);
            if (!patient) continue;

            const providerId = patient.insuranceProviderId || 'private';
            const summary = summaryByProvider.get(providerId);

            if (summary) {
                summary.patientIds.add(patient.id);
                summary.totalBilled += invoice.totalAmount;
            }
        }
        
        const result: MonthlySummary[] = [];
        const providersMap = new Map(providers.map(p => [p.id, p]));

        summaryByProvider.forEach((summary, providerId) => {
             if (providerId === 'private') {
                result.push({
                    providerId: 'private',
                    providerName: 'Particuliers',
                    patientCount: summary.patientIds.size,
                    totalBilled: summary.totalBilled,
                });
             } else {
                const provider = providersMap.get(providerId);
                if (provider) {
                    result.push({
                        providerId,
                        providerName: provider.name,
                        patientCount: summary.patientIds.size,
                        totalBilled: summary.totalBilled,
                        subscriptionFee: provider.monthlySubscriptionFee
                    });
                }
             }
        });

        return result.sort((a,b) => b.totalBilled - a.totalBilled);

    }, [invoices, patients, providers, selectedMonth]);

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
                            Analyse des revenus par assurance et pour les particuliers.
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
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {summaryData.length > 0 ? summaryData.map(summary => (
                            <div key={summary.providerId} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div>
                                    <p className="font-semibold">{summary.providerName}</p>
                                    <p className="text-sm text-muted-foreground">{summary.patientCount} patient(s)</p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-bold text-lg'>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(summary.totalBilled)}</p>
                                    {summary.subscriptionFee && (
                                        <p className="text-xs text-green-600">
                                            + {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.subscriptionFee)} (Abonnement)
                                        </p>
                                    )}
                                </div>
                            </div>
                        )) : <p className='text-muted-foreground text-center py-4'>Aucune donnée de facturation pour ce mois.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
