'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useFirestore, updateDocumentNonBlocking, WithId } from '@/firebase';
import { UserProfile } from './user-table-columns';


const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: z.string().min(1, { message: 'Le nom est requis.' }),
  role: z.enum(['doctor', 'receptionist', 'pharmacist', 'accountant', 'lab_staff', 'admin']),
});

interface EditUserFormProps {
    user: WithId<Omit<UserProfile, 'id'>>;
    setDialogOpen: (open: boolean) => void;
}

export function EditUserForm({ user, setDialogOpen }: EditUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const primaryFirestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.roleId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userDocRef = doc(primaryFirestore, 'users', user.id);
      updateDocumentNonBlocking(userDocRef, {
        firstName: values.firstName,
        lastName: values.lastName,
        roleId: values.role,
        updatedAt: new Date().toISOString(),
      });

      // Also update the role in user_roles collection
      if (values.role !== user.roleId) {
        const userRoleDocRef = doc(primaryFirestore, 'user_roles', user.id);
        updateDocumentNonBlocking(userRoleDocRef, {
            roleName: values.role,
        });
      }

      toast({
        title: 'Utilisateur mis à jour',
        description: `Le compte de ${values.firstName} ${values.lastName} a été mis à jour avec succès.`,
      });
      setDialogOpen(false);
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
      });
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
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
                    <SelectItem value="lab_staff">Personnel de laboratoire</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className='flex justify-end gap-2'>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
