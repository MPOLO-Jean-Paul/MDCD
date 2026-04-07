'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking, WithId } from '@/firebase';
import { ConsultationWithPatient } from '@/types/consultation';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
    symptoms: z.string().min(1, { message: 'Les symptômes sont requis.' }),
    diagnosis: z.string().min(1, { message: 'Le diagnostic est requis.' }),
    notes: z.string().optional(),
    status: z.enum(['Completed', 'Follow-up Required', 'Draft']),
});

interface EditConsultationFormProps {
    consultation: WithId<Omit<ConsultationWithPatient, 'id'>>;
    setDialogOpen: (open: boolean) => void;
}

export function EditConsultationForm({ consultation, setDialogOpen }: EditConsultationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      notes: consultation.notes || '',
      status: consultation.status,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore not initialized");

      const consultationDocRef = doc(firestore, 'consultations', consultation.id);
      const dataToUpdate = {
        ...values,
        updatedAt: new Date().toISOString()
      };
      
      updateDocumentNonBlocking(consultationDocRef, dataToUpdate);

      toast({
        title: 'Consultation mise à jour',
        description: `La consultation de ${consultation.patientName} a été mise à jour.`,
      });
      setDialogOpen(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error updating consultation:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptômes</FormLabel>
              <FormControl><Textarea placeholder="Fièvre, toux, maux de tête..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnostic</FormLabel>
              <FormControl><Textarea placeholder="Grippe saisonnière..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes supplémentaires (Optionnel)</FormLabel>
              <FormControl><Textarea placeholder="Prescrire du repos, suivi dans 3 jours..." {...field} /></FormControl>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Draft">Brouillon</SelectItem>
                    <SelectItem value="Completed">Terminée</SelectItem>
                    <SelectItem value="Follow-up Required">Suivi requis</SelectItem>
                </SelectContent>
              </Select>
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
