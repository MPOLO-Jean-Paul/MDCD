import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { InvoiceList } from '@/components/billing/invoice-list';

export default function BillingPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Facturation</h2>
        <div className='flex items-center gap-2'>
            <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Exporter la liste
            </Button>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer une facture
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des factures</CardTitle>
          <CardDescription>
            Créez, suivez et gérez les factures des patients et des assurances.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <InvoiceList />
        </CardContent>
      </Card>
    </>
  );
}
