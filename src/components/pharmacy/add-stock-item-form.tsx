'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HospitalDataService } from '@/lib/firestore-service';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase, useUser, WithId } from '@/firebase';
import { Medication } from '@/types/medication';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  medicationId: z.string().min(1, { message: 'Veuillez sélectionner un médicament.' }),
  batchNumber: z.string().min(1, { message: 'Le numéro de lot est requis.' }),
  currentQuantity: z.coerce.number().int().positive({ message: 'La quantité doit être un nombre entier positif.' }),
  expirationDate: z.date({
    required_error: "Une date d'expiration est requise.",
  }),
  location: z.string().optional(),
});

export function AddStockItemForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoadingInv, setIsLoadingInv] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    async function loadInv() {
      try {
        const data = await HospitalDataService.getInventory();
        setInventory(data || []);
      } catch (e) {
        console.error("Error loading inventory items:", e);
      } finally {
        setIsLoadingInv(false);
      }
    }
    loadInv();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchNumber: '',
      currentQuantity: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!user) throw new Error("Utilisateur non authentifié.");
      
      // Update Stock via Firestore
      await HospitalDataService.updateStock(
        values.medicationId,
        values.currentQuantity,
        `Réapprovisionnement Lot ${values.batchNumber}`,
        user.uid
      );

      toast({
        title: 'Stock mis à jour',
        description: `Le lot ${values.batchNumber} de ${values.currentQuantity} unités a été ajouté au stock.`,
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur lors de la mise à jour",
        description: error.message || "Impossible de mettre à jour le stock.",
      });
      console.error("Error updating stock item:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingInv) {
    return <div className="space-y-4 py-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="medicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Médicament</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un médicament à stocker" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {inventory?.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.currentStock} en stock)
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Choisissez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
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
              <FormLabel>Emplacement de stockage</FormLabel>
              <FormControl><Input placeholder="Étagère A, Section 2" {...field} /></FormControl>
              <FormDescription>Optionnel. Permet de localiser facilement le produit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Ajout en cours...' : 'Ajouter au stock'}
        </Button>
      </form>
    </Form>
  );
}
