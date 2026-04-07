'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useLanguage } from '@/lib/i18n/provider';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis.' }),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  monthlySubscriptionFee: z.coerce.number().nonnegative().optional(),
});

export function CreateProviderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      contactPhone: '',
      monthlySubscriptionFee: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore is not initialized");
      
      const newProviderId = uuidv4();
      const providerDocRef = doc(firestore, 'insurance_providers', newProviderId);
      
      const dataToSubmit = {
        ...values,
        id: newProviderId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(providerDocRef, dataToSubmit, {});

      toast({
        title: t('insurancePage.toasts.createSuccessTitle'),
        description: t('insurancePage.toasts.createSuccessDescription', { name: values.name }),
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('insurancePage.toasts.createErrorTitle'),
        description: error.message,
      });
      console.error("Error creating provider:", error);
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('common.saving') : t('insurancePage.form.submit')}
        </Button>
      </form>
    </Form>
  );
}
