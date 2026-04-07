import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, ClipboardList, DollarSign, Users2 } from 'lucide-react';

const kpiData = [
  {
    title: "Chiffre d'affaires (Aujourd'hui)",
    value: "12,540,000 F",
    change: "+20.1% par rapport à hier",
    icon: DollarSign,
    color: 'text-green-500',
  },
  {
    title: "Admissions (Aujourd'hui)",
    value: "+32",
    change: "+5 depuis hier",
    icon: Users2,
    color: 'text-blue-500',
  },
  {
    title: "Taux d'occupation",
    value: "78%",
    change: "-2% par rapport à hier",
    icon: BedDouble,
    color: 'text-orange-500',
  },
  {
    title: 'Actes à facturer',
    value: '12',
    change: 'En attente de traitement',
    icon: ClipboardList,
    color: 'text-red-500',
  },
];

export default function KpiCards() {
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
