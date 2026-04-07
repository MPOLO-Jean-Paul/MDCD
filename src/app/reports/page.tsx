import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReportsTab } from "@/components/reports/financial-reports-tab";
import { ClinicalReportsTab } from "@/components/reports/clinical-reports-tab";

export default function ReportsPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Rapports Financiers et Opérationnels</h2>
      </div>
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Rapports Financiers</TabsTrigger>
          <TabsTrigger value="clinical">Rapports Cliniques</TabsTrigger>
        </TabsList>
        <TabsContent value="financial" className="space-y-4">
            <FinancialReportsTab />
        </TabsContent>
        <TabsContent value="clinical" className="space-y-4">
            <ClinicalReportsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
