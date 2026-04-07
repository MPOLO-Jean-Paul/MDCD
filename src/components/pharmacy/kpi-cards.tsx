import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, PackageX, Siren, PackageCheck } from 'lucide-react';

// This is mock data for now. It should be replaced with real-time data from Firestore.
const kpiData = [
  {
    title: "Valeur Totale du Stock",
    value: "7,850,000 F",
    change: "Calculé sur 123 produits",
    icon: Archive,
  },
  {
    title: "Produits en Faible Stock",
    value: "8",
    change: "Sous le niveau de réapprovisionnement",
    icon: PackageX,
    color: 'text-orange-500',
  },
  {
    title: "Produits Proches de l'Expiration",
    value: "15",
    change: "Dans les 30 prochains jours",
    icon: Siren,
    color: 'text-red-500',
  },
  {
    title: 'Produits en Stock',
    value: '256',
    change: 'Lots uniques actifs',
    icon: PackageCheck,
  },
];

export function PharmacyKpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color || ''}`} />
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
