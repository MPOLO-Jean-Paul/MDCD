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
  FormDescription,
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, WithId } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Patient } from '@/types/patient';
import { Skeleton } from '../ui/skeleton';
import { Activity, ShieldCheck, WalletCards, UserPlus, CreditCard } from 'lucide-react';
import { HospitalDataService } from '@/lib/firestore-service';

const formSchema = z.object({
  patientMode: z.enum(['existing', 'new']),
  patientId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  
  admissionType: z.enum(['Rendez-vous', 'Urgence', 'Contrôle']),
  reasonForAdmission: z.string().min(1, { message: 'Le motif est requis.' }),
  
  coverageType: z.enum(['Privé', 'Assuré']),
  insuranceProviderId: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),

  initialFee: z.coerce.number().min(0),
  paymentMethod: z.enum(['Cash', 'Carte', 'Mobile Money', 'À facturer']),
}).superRefine((data, ctx) => {
  if (data.patientMode === 'existing' && (!data.patientId || data.patientId === '')) {
    ctx.addIssue({ code: 'custom', path: ['patientId'], message: 'Sélectionnez un patient existant.' });
  }
  if (data.patientMode === 'new') {
    if (!data.firstName) ctx.addIssue({ code: 'custom', path: ['firstName'], message: 'Prénom requis.' });
    if (!data.lastName) ctx.addIssue({ code: 'custom', path: ['lastName'], message: 'Nom requis.' });
  }
  if (data.coverageType === 'Assuré' && !data.insuranceProviderId) {
    ctx.addIssue({ code: 'custom', path: ['insuranceProviderId'], message: 'L\'assurance est requise.' });
  }
});

export function CreateAdmissionForm({ onSuccess }: { onSuccess?: () => void }) {
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
      patientMode: 'existing',
      patientId: '',
      firstName: '',
      lastName: '',
      phone: '',
      admissionType: 'Rendez-vous',
      reasonForAdmission: '',
      coverageType: 'Privé',
      initialFee: 0,
      paymentMethod: 'À facturer',
    },
  });

  const patientMode = form.watch('patientMode');
  const coverageType = form.watch('coverageType');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!user || !firestore) throw new Error("Vous devez être connecté.");
      
      let finalPatientId = values.patientId;

      // 1. Enrôlement rapide (Fast Enrollment)
      if (values.patientMode === 'new') {
        finalPatientId = "PAT-" + uuidv4().substring(0, 8).toUpperCase();
        const newPatientRef = doc(firestore, 'patients', finalPatientId);
        const newPatient = {
          id: finalPatientId,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          dateOfBirth: '',
          gender: 'Autre',
          insuranceProviderId: values.insuranceProviderId,
          insurancePolicyNumber: values.insurancePolicyNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDocumentNonBlocking(newPatientRef, newPatient, {});
      }

      // 2. Création de l'admission (Admission creation)
      const newAdmissionId = uuidv4();
      const newAdmissionDocRef = doc(firestore, 'admissions', newAdmissionId);

      const newAdmission = {
        id: newAdmissionId,
        patientId: finalPatientId,
        patientMode: values.patientMode,
        admissionType: values.admissionType,
        reasonForAdmission: values.reasonForAdmission,
        coverageType: values.coverageType,
        insuranceProviderId: values.insuranceProviderId,
        insurancePolicyNumber: values.insurancePolicyNumber,
        initialFee: values.initialFee,
        paymentMethod: values.paymentMethod,
        admissionDateTime: new Date().toISOString(),
        status: 'En attente', // Pending triage/consultation
        admittingUserId: user.uid,
        createdAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // 3. Sync: Push to management collection
      try {
        await HospitalDataService.syncPatientToManagement({
          id: finalPatientId,
          firstName: values.firstName || (values.patientMode === 'existing' ? patients?.find(p => p.id === values.patientId)?.firstName : ''),
          lastName: values.lastName || (values.patientMode === 'existing' ? patients?.find(p => p.id === values.patientId)?.lastName : ''),
          nationalId: values.patientId, // Using patientId as reference
          gender: 'Autre',
          bloodGroup: ''
        });
      } catch (syncError) {
        console.warn("Sync delayed or failed.", syncError);
      }

      toast({
        title: 'Admission enregistrée',
        description: `Le dossier a été enregistré avec succès.`,
      });
      
      form.reset();
      setIsLoading(false);
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
        
        {/* Section 1: Identification */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary font-medium">
            <UserPlus className="w-5 h-5" />
            <h3>Identification du Patient</h3>
          </div>
          <Tabs 
            value={patientMode} 
            onValueChange={(val) => form.setValue('patientMode', val as 'existing' | 'new')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="existing">Patient Existant</TabsTrigger>
              <TabsTrigger value="new">Enrôlement Rapide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="mt-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rechercher le patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Sélectionnez..." />
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
            </TabsContent>
            
            <TabsContent value="new" className="mt-4">
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-4 grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl><Input placeholder="John" {...field} className="bg-card" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl><Input placeholder="Doe" {...field} className="bg-card" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl><Input placeholder="+243..." {...field} className="bg-card" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        {/* Section 2: Triage */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary font-medium">
            <Activity className="w-5 h-5" />
            <h3>Triage & Motif</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="admissionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rendez-vous">Rendez-vous</SelectItem>
                      <SelectItem value="Urgence">Urgence</SelectItem>
                      <SelectItem value="Contrôle">Contrôle</SelectItem>
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
                  <FormLabel>Motif Principal</FormLabel>
                  <FormControl><Input placeholder="Fièvre, suivi..." {...field} className="bg-card" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Section 3: Droits & Caisse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary font-medium">
              <ShieldCheck className="w-5 h-5" />
              <h3>Couverture (Droits)</h3>
            </div>
            <FormField
              control={form.control}
              name="coverageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Privé">Privé (Paiement direct)</SelectItem>
                      <SelectItem value="Assuré">Assuré (Tiers payant)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {coverageType === 'Assuré' && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                <FormField
                  control={form.control}
                  name="insuranceProviderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assureur</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-card">
                            <SelectValue placeholder="Mutuelle..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AS-001">Assurance A</SelectItem>
                          <SelectItem value="AS-002">Mutuelle Santé B</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insurancePolicyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° Police</FormLabel>
                      <FormControl><Input placeholder="123456" {...field} className="bg-card" /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary font-medium">
              <WalletCards className="w-5 h-5" />
              <h3>Caisse (Encaissement Initial)</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="initialFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frais (Ticket Modérateur)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input type="number" step="0.01" className="pl-7 bg-card" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Mode..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Carte">Carte</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        <SelectItem value="À facturer">À facturer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading} className="gap-2 shadow-md">
            <CreditCard className="w-5 h-5" />
            {isLoading ? 'Traitement...' : 'Valider l\'Admission'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
