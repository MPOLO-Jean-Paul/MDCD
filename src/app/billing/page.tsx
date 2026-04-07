import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoiceList } from '@/components/billing/invoice-list';
import { CreateInvoiceForm } from '@/components/billing/create-invoice-form';

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
            <Dialog>
              <DialogTrigger asChild>
                  <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Créer une facture
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                      <DialogTitle>Créer une nouvelle facture</DialogTitle>
                      <DialogDescription>
                          Générez une nouvelle facture pour un patient.
                      </DialogDescription>
                  </DialogHeader>
                  <CreateInvoiceForm />
              </DialogContent>
            </Dialog>
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
