'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@/firebase';

const formSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  newPassword: z.string().min(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' }),
});

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!user || !user.email) throw new Error("Utilisateur non authentifié.");

      const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);

      toast({
        title: 'Mot de passe mis à jour',
        description: 'Votre mot de passe a été changé avec succès.',
      });
      form.reset();

    } catch (error: any) {
      let description = "Une erreur est survenue.";
      if(error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "Le mot de passe actuel est incorrect."
      } else if (error.code === 'auth/weak-password') {
        description = "Le nouveau mot de passe est trop faible."
      }
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
        </Button>
      </form>
    </Form>
  );
}
