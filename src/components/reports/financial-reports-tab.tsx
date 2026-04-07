'use client'

import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import FinancialKpiCards from '@/components/reports/financial-kpi-cards';
import RevenueByServiceChart from '@/components/reports/revenue-by-service-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InsuranceSummaryReport } from './insurance-summary-report';

export function FinancialReportsTab() {
  return (
    <>
        <div className='flex justify-end'>
            <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exporter les rapports
            </Button>
        </div>
        <FinancialKpiCards />
        <InsuranceSummaryReport />
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
    </>
  );
}
