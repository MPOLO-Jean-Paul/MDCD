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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, WithId } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Patient } from '@/types/patient';
import { Skeleton } from '../ui/skeleton';
import { Stethoscope, HeartPulse, FileText, FlaskConical, Pill } from 'lucide-react';

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Veuillez sélectionner un patient.' }),
  vitals: z.object({
    bloodPressure: z.string().optional(),
    temperature: z.string().optional(),
    weight: z.string().optional(),
  }),
  anamnesis: z.string().min(1, 'L\'anamnèse est requise.'),
  physicalExam: z.string().optional(),
  diagnosis: z.string().min(1, 'Le diagnostic est requis.'),
  notes: z.string().optional(),
  prescriptions: z.string().optional(),
  labRequests: z.string().optional(),
});

export function CreateConsultationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const patientsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'patients') : null,
    [firestore]
  );
  // Pour "Aide à la décision : Historique", on devrait récupérer les consultations précédentes du patient.
  // Ce serait idéal de le faire en sélectionnant le patient.
  
  const { data: patients, isLoading: isLoadingPatients } = useCollection<Omit<Patient, 'id'>>(patientsCollectionRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      vitals: { bloodPressure: '', temperature: '', weight: '' },
      anamnesis: '',
      physicalExam: '',
      diagnosis: '',
      notes: '',
      prescriptions: '',
      labRequests: '',
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
        status: 'Terminée',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // SILENT SYNC: We fire the saves and immediately provide success feedback.
      // Firestore handles the actual network sync in the background.
      setDocumentNonBlocking(newConsultationDocRef, newConsultation, {});

      // S'il y a des demandes de labo, générer automatiquement une commande Labo (Module 3 partiel)
      if (values.labRequests && values.labRequests.trim() !== '') {
         const labRequestId = "LAB-" + uuidv4().substring(0, 8).toUpperCase();
         const labDocRef = doc(firestore, 'lab_requests', labRequestId);
         setDocumentNonBlocking(labDocRef, {
            id: labRequestId,
            consultationId: newConsultationId,
            patientId: values.patientId,
            details: values.labRequests,
            status: 'En attente de paiement', // Workflow connecté (Validation financière)
            doctorId: user.uid,
            createdAt: new Date().toISOString(),
         }, {});
      }

      // S'il y a des ordonnances, générer une e-prescription (Module 5 partiel)
      if (values.prescriptions && values.prescriptions.trim() !== '') {
         const rxId = "RX-" + uuidv4().substring(0, 8).toUpperCase();
         const rxDocRef = doc(firestore, 'prescriptions', rxId);
         setDocumentNonBlocking(rxDocRef, {
            id: rxId,
            consultationId: newConsultationId,
            patientId: values.patientId,
            medications: values.prescriptions,
            status: 'Non délivrée', // Pharmacie & Stocks (Délivrance sécurisée)
            doctorId: user.uid,
            createdAt: new Date().toISOString(),
         }, {});
      }

      toast({
        title: 'Consultation enregistrée',
        description: `La consultation est synchronisée en arrière-plan.`,
      });
      
      form.reset();
      setIsLoading(false); // Snap back to ready state immediately
      if (onSuccess) onSuccess();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
      });
      setIsLoading(false);
    }
  }

  if (isLoadingPatients) {
    return (
      <div className='py-4 space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-40 w-full' />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
        
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Sélectionnez un patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients?.map((p: WithId<Omit<Patient, 'id'>>) => (
                      <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName} (ID: {p.id})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs defaultValue="clinical" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clinical"><Stethoscope className="w-4 h-4 mr-2" />Clinique</TabsTrigger>
            <TabsTrigger value="vitals"><HeartPulse className="w-4 h-4 mr-2" />Constantes</TabsTrigger>
            <TabsTrigger value="orders"><FileText className="w-4 h-4 mr-2" />Prescriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clinical" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="anamnesis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anamnèse (Histoire de la maladie)</FormLabel>
                  <FormControl><Textarea className="bg-card min-h-[80px]" placeholder="Plaintes principales et historique..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physicalExam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Examen Physique</FormLabel>
                  <FormControl><Textarea className="bg-card min-h-[80px]" placeholder="Résultats de l'examen clinique..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnostic Validé / Présumé</FormLabel>
                  <FormControl><Textarea className="bg-card" placeholder="Diagnostic médical clair..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="vitals" className="mt-4">
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-4 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vitals.bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tension Artérielle (mmHg)</FormLabel>
                      <FormControl><Input placeholder="120/80" {...field} className="bg-card" /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vitals.temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Température (°C)</FormLabel>
                      <FormControl><Input placeholder="37.2" {...field} className="bg-card" /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vitals.weight"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Poids (kg)</FormLabel>
                      <FormControl><Input placeholder="75" {...field} className="bg-card" /></FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prescriptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Pill className="w-4 h-4 text-primary" /> Ordonnance Médicale (e-Prescription)</FormLabel>
                    <FormControl><Textarea className="bg-card min-h-[120px]" placeholder="1. Paracétamol 1g 3x/j..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="labRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-primary" /> Demandes d'Examens (Labo/Imagerie)</FormLabel>
                    <FormControl><Textarea className="bg-card min-h-[120px]" placeholder="1. Hémogramme complet&#10;2. Frottis sanguin..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-2 flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading} className="shadow-md">
            {isLoading ? 'Enregistrement...' : 'Clôturer la Consultation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
