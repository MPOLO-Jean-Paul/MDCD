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
import { useUser } from '@/firebase';

// Using mock data for patients for now
const mockPatients = [
    { id: 'PAT-001', name: 'Amina Diallo' },
    { id: 'PAT-002', name: 'Moussa Traoré' },
    { id: 'PAT-003', name: 'Ibrahim Koné' },
    { id: 'PAT-004', name: 'Fatou Ndiaye' },
];


const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Veuillez sélectionner un patient.' }),
  admissionType: z.enum(['Rendez-vous', 'Urgence', 'Hospitalisation']),
  reasonForAdmission: z.string().min(1, { message: 'Le motif est requis.' }),
});

export function CreateAdmissionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

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
      if (!user) throw new Error("Vous devez être connecté.");
      
      const newAdmissionId = uuidv4();
      const newAdmission = {
        id: newAdmissionId,
        ...values,
        admissionDateTime: new Date().toISOString(),
        status: 'Pending',
        admittingUserId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Submitting new admission:", newAdmission);
      // Here you would call a function to save the data to Firestore
      // e.g., setDocumentNonBlocking(doc(firestore, 'admissions', newAdmissionId), newAdmission, {});

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
                  {mockPatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                          {p.name}
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
