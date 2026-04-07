'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
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
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, WithId } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Patient } from '@/types/patient';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Veuillez sélectionner un patient.' }),
  symptoms: z.string().min(1, { message: 'Les symptômes sont requis.' }),
  diagnosis: z.string().min(1, { message: 'Le diagnostic est requis.' }),
  notes: z.string().optional(),
});

export function CreateConsultationForm() {
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
      symptoms: '',
      diagnosis: '',
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!user || !firestore) throw new Error("Vous devez être connecté.");
      
      const newConsultationId = uuidv4();
      const newConsultationDocRef = doc(firestore, 'consultations', newConsultationId);

      const newConsultation = {
        id: newConsultationId,
        ...values,
        consultationDateTime: new Date().toISOString(),
        consultingDoctorId: user.uid,
        status: 'Completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(newConsultationDocRef, newConsultation, {});

      toast({
        title: 'Consultation enregistrée',
        description: `La consultation pour le patient a été enregistrée avec succès.`,
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de création",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error creating consultation:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingPatients) {
    return <div className='py-4 space-y-4'>
      {[...Array(4)].map((_, i) => <Skeleton key={i} className='h-10 w-full' />)}
    </div>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients?.map((p: WithId<Omit<Patient, 'id'>>) => (
                      <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer la consultation'}
        </Button>
      </form>
    </Form>
  );
}
