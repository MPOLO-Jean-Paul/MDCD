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
  admissionType: z.enum(['Rendez-vous', 'Urgence', 'Hospitalisation']),
  reasonForAdmission: z.string().min(1, { message: 'Le motif est requis.' }),
});

export function CreateAdmissionForm() {
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
      admissionType: 'Rendez-vous',
      reasonForAdmission: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!user || !firestore) throw new Error("Vous devez être connecté.");
      
      const newAdmissionId = uuidv4();
      const newAdmissionDocRef = doc(firestore, 'admissions', newAdmissionId);

      const newAdmission = {
        id: newAdmissionId,
        ...values,
        admissionDateTime: new Date().toISOString(),
        status: 'Pending',
        admittingUserId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(newAdmissionDocRef, newAdmission, {});

      toast({
        title: 'Admission créée avec succès',
        description: `L'admission pour le patient a été enregistrée.`,
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de création",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error creating admission:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingPatients) {
    return <div className='py-4 space-y-4'>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-20 w-full' />
      <Skeleton className='h-10 w-full' />
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
          name="admissionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'admission</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Rendez-vous">Rendez-vous</SelectItem>
                  <SelectItem value="Urgence">Urgence</SelectItem>
                  <SelectItem value="Hospitalisation">Hospitalisation</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForAdmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif d'admission</FormLabel>
              <FormControl><Textarea placeholder="Décrivez la raison de la visite..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer l\'admission'}
        </Button>
      </form>
    </Form>
  );
}
