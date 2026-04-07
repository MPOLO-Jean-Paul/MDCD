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
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { AdmissionWithPatient } from '@/types/admission';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  admissionType: z.enum(['Rendez-vous', 'Urgence', 'Hospitalisation']),
  reasonForAdmission: z.string().min(1, { message: 'Le motif est requis.' }),
  status: z.enum(['Pending', 'Admitted', 'Discharged', 'Completed', 'Canceled']),
});

interface EditAdmissionFormProps {
    admission: AdmissionWithPatient;
    setDialogOpen: (open: boolean) => void;
}

export function EditAdmissionForm({ admission, setDialogOpen }: EditAdmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admissionType: admission.admissionType,
      reasonForAdmission: admission.reasonForAdmission,
      status: admission.status,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore not initialized");

      const admissionDocRef = doc(firestore, 'admissions', admission.id);
      const dataToUpdate = {
        ...values,
        updatedAt: new Date().toISOString()
      };
      
      updateDocumentNonBlocking(admissionDocRef, dataToUpdate);

      toast({
        title: 'Admission mise à jour',
        description: `L'admission de ${admission.patientName} a été mise à jour.`,
      });
      setDialogOpen(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error updating admission:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                    <SelectItem value="Pending">En attente</SelectItem>
                    <SelectItem value="Admitted">Admis</SelectItem>
                    <SelectItem value="Discharged">Sorti</SelectItem>
                    <SelectItem value="Completed">Terminé</SelectItem>
                    <SelectItem value="Canceled">Annulé</SelectItem>
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
