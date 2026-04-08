'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { initializeApp, deleteApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useToast } from '@/hooks/use-toast';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: z.string().min(1, { message: 'Le nom est requis.' }),
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  role: z.enum(['doctor', 'receptionist', 'pharmacist', 'accountant', 'lab_staff', 'admin', 'cashier']),
});

export function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const primaryFirestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'doctor',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const secondaryAppName = `user-creation-${Date.now()}`;
    
    const secondaryApp = getApps().find(app => app.name === secondaryAppName) || initializeApp(firebaseConfig, secondaryAppName);
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, values.email, values.password);
      const user = userCredential.user;

      if (!primaryFirestore) {
        throw new Error("Firestore is not initialized");
      }

      const userDocRef = doc(primaryFirestore, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        username: values.email.split('@')[0],
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        roleId: values.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, {});

      const userRoleDocRef = doc(primaryFirestore, 'user_roles', user.uid);
      setDocumentNonBlocking(userRoleDocRef, {
        roleName: values.role,
      }, {});

      toast({
        title: 'Utilisateur créé avec succès',
        description: `Le compte pour ${values.firstName} ${values.lastName} a été créé.`,
      });
      form.reset();

    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de la création de l'utilisateur.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cette adresse e-mail est déjà utilisée.';
      }
      toast({
        variant: 'destructive',
        title: "Erreur de création",
        description: errorMessage,
      });
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
      await deleteApp(secondaryApp).catch(err => console.error("Error deleting secondary app:", err));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Alain" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input placeholder="a.dupont@mediflow.pro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mot de passe temporaire" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="doctor">Médecin</SelectItem>
                  <SelectItem value="receptionist">Réceptionniste</SelectItem>
                  <SelectItem value="pharmacist">Pharmacien</SelectItem>
                  <SelectItem value="accountant">Comptable</SelectItem>
                  <SelectItem value="cashier">Caissier</SelectItem>
                  <SelectItem value="lab_staff">Personnel de laboratoire</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Création en cours...' : 'Créer le compte'}
        </Button>
      </form>
    </Form>
  );
}

    