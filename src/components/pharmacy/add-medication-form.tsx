'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Le nom du médicament est requis.' }),
  description: z.string().min(1, { message: 'La description est requise.' }),
  unitOfMeasure: z.string().min(1, { message: 'L\'unité de mesure est requise.' }),
  unitPrice: z.coerce.number().positive({ message: 'Le prix doit être un nombre positif.' }),
  reorderLevel: z.coerce.number().int().nonnegative({ message: 'Le seuil doit être un nombre positif.' }),
  manufacturer: z.string().optional(),
  strength: z.string().optional(),
});

export function AddMedicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      unitOfMeasure: 'comprimé',
      unitPrice: 0,
      reorderLevel: 10,
      manufacturer: '',
      strength: ''
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore is not initialized");
      
      const newMedicationId = uuidv4();
      const medicationDocRef = doc(firestore, 'medications', newMedicationId);
      
      const dataToSubmit = {
        ...values,
        id: newMedicationId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(medicationDocRef, dataToSubmit, {});

      toast({
        title: 'Médicament créé avec succès',
        description: `Le médicament "${values.name}" a été ajouté au catalogue.`,
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de création",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error creating medication:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du médicament</FormLabel>
              <FormControl><Input placeholder="Paracétamol 500mg" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Antalgique et antipyrétique..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
            <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prix Unitaire (XOF)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="reorderLevel"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Seuil de Réappro.</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className='grid grid-cols-2 gap-4'>
            <FormField
            control={form.control}
            name="unitOfMeasure"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Unité</FormLabel>
                <FormControl><Input placeholder="comprimé, flacon..." {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl><Input placeholder="500mg, 10%" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabricant</FormLabel>
              <FormControl><Input placeholder="Labo X" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Création en cours...' : 'Créer le médicament'}
        </Button>
      </form>
    </Form>
  );
}
