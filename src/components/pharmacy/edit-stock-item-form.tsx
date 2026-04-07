'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking, WithId, useUser } from '@/firebase';
import { StockItemWithMedication } from '@/types/medication';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  batchNumber: z.string().min(1, { message: 'Le numéro de lot est requis.' }),
  currentQuantity: z.coerce.number().int().nonnegative({ message: 'La quantité doit être un nombre positif.' }),
  expirationDate: z.date({ required_error: "Une date d'expiration est requise." }),
  location: z.string().optional(),
});

interface EditStockItemFormProps {
    item: WithId<Omit<StockItemWithMedication, 'id'>>;
    setDialogOpen: (open: boolean) => void;
}

export function EditStockItemForm({ item, setDialogOpen }: EditStockItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchNumber: item.batchNumber,
      currentQuantity: item.currentQuantity,
      expirationDate: new Date(item.expirationDate),
      location: item.location || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (!firestore || !user) throw new Error("Services non initialisés");
      const itemDocRef = doc(firestore, 'stock_items', item.id);
      
      const dataToUpdate = {
        ...values,
        expirationDate: values.expirationDate.toISOString(),
        lastUpdateUserId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      updateDocumentNonBlocking(itemDocRef, dataToUpdate);

      toast({
        title: 'Stock mis à jour',
        description: `Le lot ${values.batchNumber} a été mis à jour.`,
      });
      setDialogOpen(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error updating stock item:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="batchNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>N° de lot</FormLabel>
                <FormControl><Input placeholder="B12345" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="currentQuantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date d'expiration</FormLabel>
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
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emplacement</FormLabel>
              <FormControl><Input placeholder="Étagère A" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
