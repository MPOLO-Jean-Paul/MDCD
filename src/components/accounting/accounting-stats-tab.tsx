'use client';

import { DollarSign, Receipt, ShieldCheck, Banknote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AccountingSummaryReport } from './accounting-summary-report';

const kpiData = [
    {
      title: "Paiements Reçus (Aujourd'hui)",
      value: "1,450,000 F",
      change: "+5.2% vs hier",
      icon: DollarSign,
    },
    {
      title: "Factures Traitées",
      value: "22",
      change: "Sur 35 factures en attente",
      icon: Receipt,
    },
    {
      title: "Réclamations Assurances",
      value: "5",
      change: "Soumises aujourd'hui",
      icon: ShieldCheck,
    },
    {
      title: 'Litiges en Cours',
      value: '2',
      change: '1 nouveau litige cette semaine',
      icon: Banknote,
    },
  ];

export function AccountingStatsTab() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi, index) => (
                    <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </CardContent>
                    </Card>
                ))}
            </div>
            <AccountingSummaryReport />
             <Card>
                <CardHeader>
                    <CardTitle>Statistiques de paiement par service</CardTitle>
                    <CardDescription>
                        Cette fonctionnalité sera bientôt disponible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Les graphiques de statistiques apparaîtront ici.</p>
                </CardContent>
            </Card>
        </div>
    )
}
