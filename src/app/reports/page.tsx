import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import FinancialKpiCards from '@/components/reports/financial-kpi-cards';
import RevenueByServiceChart from '@/components/reports/revenue-by-service-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Rapports Financiers et Opérationnels</h2>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Exporter les rapports
        </Button>
      </div>
      <div className="space-y-4">
        <FinancialKpiCards />
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d'affaires par service</CardTitle>
            <CardDescription>
              Analyse détaillée des revenus générés par chaque catégorie de service.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueByServiceChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
