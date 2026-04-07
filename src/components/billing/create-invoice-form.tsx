'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { doc, collection } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking, WithId } from '@/firebase';
import { cn } from '@/lib/utils';
import { Patient } from '@/types/patient';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Veuillez sélectionner un patient.' }),
  totalAmount: z.coerce.number().positive({ message: 'Le montant total doit être positif.' }),
  dueDate: z.date({ required_error: 'La date d\'échéance est requise.' }),
  status: z.enum(['Pending', 'Paid', 'Partially Paid']),
});

export function CreateInvoiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );
  const { data: patients, isLoading: isLoadingPatients } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Pending',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore || !user) throw new Error("Services non initialisés");
      
      const newInvoiceId = `INV-${Date.now()}`;
      const invoiceDocRef = doc(firestore, 'invoices', newInvoiceId);
      
      const dataToSubmit = {
        ...values,
        id: newInvoiceId,
        invoiceDate: new Date().toISOString(),
        dueDate: values.dueDate.toISOString(),
        amountPaid: values.status === 'Paid' ? values.totalAmount : 0,
        balanceDue: values.status === 'Paid' ? 0 : values.totalAmount,
        generatedByUserId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(invoiceDocRef, dataToSubmit, {});

      toast({
        title: 'Facture créée avec succès',
        description: `La facture ${newInvoiceId} a été créée.`,
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de création",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error creating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingPatients) {
    return <div className="space-y-4 py-4"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez un patient" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients?.map((p: WithId<Omit<Patient, 'id'>>) => (
                    <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant Total (XOF)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date d'échéance</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisissez une date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Paid">Payée</SelectItem>
                  <SelectItem value="Partially Paid">Partiellement payée</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Création en cours...' : 'Créer la facture'}
        </Button>
      </form>
    </Form>
  );
}
