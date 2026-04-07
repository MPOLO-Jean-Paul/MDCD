'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking, WithId } from '@/firebase';
import { useLanguage } from '@/lib/i18n/provider';
import { InsuranceProvider } from '@/types/insurance';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis.' }),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  monthlySubscriptionFee: z.coerce.number().nonnegative().optional(),
});

interface EditProviderFormProps {
    provider: WithId<Omit<InsuranceProvider, 'id'>>;
    setDialogOpen: (open: boolean) => void;
}

export function EditProviderForm({ provider, setDialogOpen }: EditProviderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: provider.name,
      contactPerson: provider.contactPerson || '',
      contactPhone: provider.contactPhone || '',
      monthlySubscriptionFee: provider.monthlySubscriptionFee || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore is not initialized");
      
      const providerDocRef = doc(firestore, 'insurance_providers', provider.id);
      const dataToUpdate = {
        ...values,
        updatedAt: new Date().toISOString(),
      };

      updateDocumentNonBlocking(providerDocRef, dataToUpdate);

      toast({
        title: t('insurancePage.toasts.updateSuccessTitle'),
        description: t('insurancePage.toasts.updateSuccessDescription', { name: values.name }),
      });
      setDialogOpen(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('insurancePage.toasts.updateErrorTitle'),
        description: error.message,
      });
      console.error("Error updating provider:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('insurancePage.form.name')}</FormLabel>
              <FormControl><Input placeholder={t('insurancePage.form.namePlaceholder')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('insurancePage.form.contactPerson')}</FormLabel>
              <FormControl><Input placeholder={t('insurancePage.form.contactPersonPlaceholder')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('insurancePage.form.contactPhone')}</FormLabel>
              <FormControl><Input placeholder={t('insurancePage.form.contactPhonePlaceholder')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlySubscriptionFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('insurancePage.form.monthlyFee')}</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.saving') : t('common.save')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
