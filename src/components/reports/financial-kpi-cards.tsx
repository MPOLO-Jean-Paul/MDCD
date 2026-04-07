import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Receipt, ShieldCheck, Banknote } from 'lucide-react';

const kpiData = [
  {
    title: "Chiffre d'affaires (Total)",
    value: "152,450,000 F",
    change: "+15.2% ce mois-ci",
    icon: DollarSign,
  },
  {
    title: "Factures impayées",
    value: "18,230,000 F",
    change: "32 factures en retard",
    icon: Receipt,
  },
  {
    title: "Taux de recouvrement",
    value: "88%",
    change: "+1.5% par rapport au mois dernier",
    icon: Banknote,
  },
  {
    title: 'Remboursements assurances',
    value: '45,780,000 F',
    change: 'En attente de conciliation',
    icon: ShieldCheck,
  },
];

export default function FinancialKpiCards() {
  return (
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
  );
}
