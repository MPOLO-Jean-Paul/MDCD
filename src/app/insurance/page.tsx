'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from '@/lib/i18n/provider';
import { ProviderList } from '@/components/insurance/provider-list';
import { CreateProviderForm } from '@/components/insurance/create-provider-form';

export default function InsurancePage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">{t('insurancePage.title')}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('insurancePage.addProvider')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('insurancePage.dialogTitle')}</DialogTitle>
              <DialogDescription>
                {t('insurancePage.dialogDescription')}
              </DialogDescription>
            </DialogHeader>
            <CreateProviderForm />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('insurancePage.listTitle')}</CardTitle>
          <CardDescription>
            {t('insurancePage.listDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderList />
        </CardContent>
      </Card>
    </>
  );
}
