'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, updateDocumentNonBlocking, setDocumentNonBlocking, WithId } from '@/firebase';
import { InvoiceWithPatient } from '@/types/invoice';
import { useLanguage } from '@/lib/i18n/provider';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Le montant doit être positif.' }),
  paymentMethod: z.enum(['Cash', 'Mobile Money', 'Credit Card', 'Insurance Claim']),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

interface RecordPaymentFormProps {
    invoice: WithId<Omit<InvoiceWithPatient, 'id'>>;
    setDialogOpen: (open: boolean) => void;
}

export function RecordPaymentForm({ invoice, setDialogOpen }: RecordPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: invoice.balanceDue,
      paymentMethod: 'Cash',
      transactionId: '',
      notes: ''
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (!firestore || !user) throw new Error("Services non initialisés");
        
        // 1. Create Payment Document
        const newPaymentId = uuidv4();
        const paymentDocRef = doc(firestore, 'payments', newPaymentId);
        const paymentData = {
            id: newPaymentId,
            invoiceId: invoice.id,
            patientId: invoice.patientId,
            paymentDate: new Date().toISOString(),
            amount: values.amount,
            paymentMethod: values.paymentMethod,
            transactionId: values.transactionId || '',
            receivedByUserId: user.uid,
            status: 'Completed',
            notes: values.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setDocumentNonBlocking(paymentDocRef, paymentData, {});

        // 2. Update Invoice Document
        const invoiceDocRef = doc(firestore, 'invoices', invoice.id);
        const newAmountPaid = (invoice.amountPaid || 0) + values.amount;
        const newBalanceDue = invoice.totalAmount - newAmountPaid;
        const newStatus = newBalanceDue <= 0 ? 'Paid' : 'Partially Paid';
        
        const invoiceUpdateData = {
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            status: newStatus,
            updatedAt: new Date().toISOString(),
        };
        updateDocumentNonBlocking(invoiceDocRef, invoiceUpdateData);

        toast({
            title: t('billingPage.toasts.paymentSuccessTitle'),
            description: t('billingPage.toasts.paymentSuccessDescription', { invoiceId: invoice.id }),
        });
        setDialogOpen(false);

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: t('billingPage.toasts.paymentErrorTitle'),
            description: error.message,
        });
        console.error("Error recording payment:", error);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('billingPage.paymentDialog.amount')}</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('billingPage.paymentDialog.method')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder={t('billingPage.paymentDialog.selectMethod')} /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Cash">{t('billingPage.paymentDialog.methods.cash')}</SelectItem>
                  <SelectItem value="Credit Card">{t('billingPage.paymentDialog.methods.card')}</SelectItem>
                  <SelectItem value="Mobile Money">{t('billingPage.paymentDialog.methods.mobile')}</SelectItem>
                  <SelectItem value="Insurance Claim">{t('billingPage.paymentDialog.methods.insurance')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('billingPage.paymentDialog.transactionId')} ({t('common.optional')})</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('billingPage.paymentDialog.notes')} ({t('common.optional')})</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? t('billingPage.paymentDialog.submitting') : t('billingPage.paymentDialog.submit')}
            </Button>
        </div>
      </form>
    </Form>
  );
}

    