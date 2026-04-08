'use client';

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
import { BillingKpiCards } from '@/components/billing/billing-kpi-cards';
import { useLanguage } from '@/lib/i18n/provider';

export default function BillingPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">{t('billingPage.title')}</h2>
        <div className='flex items-center gap-2'>
            <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                {t('billingPage.exportList')}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                  <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('billingPage.createInvoice')}
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                      <DialogTitle>{t('billingPage.dialogTitle')}</DialogTitle>
                      <DialogDescription>
                          {t('billingPage.dialogDescription')}
                      </DialogDescription>
                  </DialogHeader>
                  <CreateInvoiceForm />
              </DialogContent>
            </Dialog>
        </div>
      </div>
      <BillingKpiCards />
      <Card>
        <CardHeader>
          <CardTitle>{t('billingPage.listTitle')}</CardTitle>
          <CardDescription>
            {t('billingPage.listDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <InvoiceList />
        </CardContent>
      </Card>
    </div>
  );
}
