'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useAuth, updateDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/firebase/auth-provider';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: z.string().min(1, { message: 'Le nom est requis.' }),
  email: z.string().email(),
});

export function UpdateProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { profile, isProfileLoading } = useUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
    },
  });

  useEffect(() => {
    if (profile) {
        form.reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
        })
    }
  }, [profile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!firestore || !auth.currentUser) throw new Error("Utilisateur non authentifié ou services indisponibles.");

      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      
      const dataToUpdate = {
        firstName: values.firstName,
        lastName: values.lastName,
        updatedAt: new Date().toISOString(),
      };
      updateDocumentNonBlocking(userDocRef, dataToUpdate);
      
      await updateProfile(auth.currentUser, {
        displayName: `${values.firstName} ${values.lastName}`
      });

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès.',
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (isProfileLoading) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10" />
            <Skeleton className="h-10 w-48" />
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
                <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem><FormLabel>Adresse e-mail</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </Button>
      </form>
    </Form>
  );
}
