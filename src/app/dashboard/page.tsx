import KpiCards from '@/components/dashboard/kpi-cards';
import RecentAdmissions from '@/components/dashboard/recent-admissions';
import RevenueChart from '@/components/dashboard/revenue-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exporter les données
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <KpiCards />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Aperçu des revenus</CardTitle>
              <CardDescription>
                Aperçu mensuel des revenus de l'hôpital.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <RevenueChart />
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Admissions Récentes</CardTitle>
              <CardDescription>
                Les 5 dernières admissions de la journée.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentAdmissions />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
