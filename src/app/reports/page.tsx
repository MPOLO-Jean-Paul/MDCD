import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function ReportsPage() {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Rapports</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Rapports et statistiques</CardTitle>
            <CardDescription>
              Visualisez les rapports financiers et opérationnels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Les fonctionnalités de rapports seront bientôt disponibles ici.</p>
          </CardContent>
        </Card>
      </>
    );
  }
