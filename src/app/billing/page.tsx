import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function BillingPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Facturation</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestion de la facturation</CardTitle>
          <CardDescription>
            Créez et gérez les factures des patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Les fonctionnalités de facturation seront bientôt disponibles ici.</p>
        </CardContent>
      </Card>
    </>
  );
}
