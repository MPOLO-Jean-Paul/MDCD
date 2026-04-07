'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase, WithId } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { InsuranceProvider } from '@/types/insurance';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { useLanguage } from '@/lib/i18n/provider';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: z.string().min(1, { message: 'Le nom est requis.' }),
  dateOfBirth: z.date({ required_error: 'La date de naissance est requise.' }),
  gender: z.enum(['Masculin', 'Féminin', 'Autre']),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }).optional().or(z.literal('')),
  bloodGroup: z.string().optional(),
  insuranceProviderId: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  firstVisitReason: z.string().min(1, { message: 'Le motif de la visite est requis.' }),
});

export function CreatePatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { t } = useLanguage();

  const providersCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'insurance_providers') : null),
    [firestore]
  );
  const { data: insuranceProviders, isLoading: isLoadingProviders } = useCollection<Omit<InsuranceProvider, 'id'>>(providersCollectionRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'Masculin',
      firstVisitReason: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore not initialized");

      const newPatientId = 'MDCD' + uuidv4().substring(0, 6).toUpperCase();
      const newPatientDocRef = doc(firestore, 'patients', newPatientId);

      const dataToSave = { ...values };
      if (dataToSave.insuranceProviderId === 'none') {
        dataToSave.insuranceProviderId = '';
      }

      const newPatient = {
        id: newPatientId,
        ...dataToSave,
        dateOfBirth: values.dateOfBirth.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setDocumentNonBlocking(newPatientDocRef, newPatient, {});
      
      toast({
        title: t('patientsPage.toasts.createSuccessTitle'),
        description: t('patientsPage.toasts.createSuccessDescription', { patientName: `${values.firstName} ${values.lastName}` }),
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('patientsPage.toasts.createErrorTitle'),
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error creating patient:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  if(isLoadingProviders) {
      return <div className="space-y-4 py-4"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patientsPage.form.lastName')}</FormLabel>
              <FormControl><Input placeholder="Diallo" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patientsPage.form.firstName')}</FormLabel>
              <FormControl><Input placeholder="Amina" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('patientsPage.form.dob')}</FormLabel>
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
                        <span>{t('common.chooseDate')}</span>
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
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patientsPage.form.gender')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Masculin">{t('patientsPage.form.genders.male')}</SelectItem>
                  <SelectItem value="Féminin">{t('patientsPage.form.genders.female')}</SelectItem>
                  <SelectItem value="Autre">{t('patientsPage.form.genders.other')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patientsPage.form.phone')}</FormLabel>
              <FormControl><Input placeholder="+221 77 123 45 67" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patientsPage.form.email')}</FormLabel>
              <FormControl><Input placeholder="patient@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t('patientsPage.form.address')}</FormLabel>
              <FormControl><Input placeholder="123, Rue de Dakar" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="firstVisitReason"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>{t('patientsPage.form.firstVisitReason')}</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder={t('admissionsPage.form.reasonPlaceholder')}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patientsPage.form.bloodGroup')}</FormLabel>
              <FormControl><Input placeholder="A+" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="insuranceProviderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('nav.insurance')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une assurance (ou 'Aucune')" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">{t('common.none')} (Particulier)</SelectItem>
                  {insuranceProviders?.map((provider: WithId<Omit<InsuranceProvider, 'id'>>) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
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
          name="insurancePolicyNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° de Police d'Assurance</FormLabel>
              <FormControl><Input placeholder="POL123456789" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? t('patientsPage.form.submitting') : t('patientsPage.form.submit')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
