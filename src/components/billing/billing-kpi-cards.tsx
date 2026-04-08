'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Clock, DollarSign, Percent } from 'lucide-react';

const kpiData = [
  {
    title: "Encaissé (Ce mois-ci)",
    value: "102,150,000 F",
    change: "+12.5% vs mois précédent",
    icon: DollarSign,
    color: 'text-green-500',
  },
  {
    title: "En attente de paiement",
    value: "18,230,000 F",
    change: "32 factures au total",
    icon: Clock,
    color: 'text-orange-500',
  },
  {
    title: "Factures en retard",
    value: "4,500,000 F",
    change: "11 factures > 30 jours",
    icon: Banknote,
    color: 'text-red-500',
  },
  {
    title: 'Taux de recouvrement',
    value: '88%',
    change: '+1.5% ce mois-ci',
    icon: Percent,
    color: 'text-blue-500'
  },
];

export function BillingKpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
