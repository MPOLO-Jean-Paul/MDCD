'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, doc } from 'firebase/firestore';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking, WithId, useCollection, useMemoFirebase } from '@/firebase';
import { Service } from '@/types/service';
import { UserProfile } from '../admin/user-table-columns';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
    name: z.string().min(1, { message: 'Le nom du service est requis.' }),
    description: z.string().min(1, { message: 'La description est requise.' }),
    category: z.string().min(1, { message: 'La catégorie est requise.' }),
    unitPrice: z.coerce.number().positive({ message: 'Le prix doit être un nombre positif.' }),
    responsibleUserId: z.string().optional(),
});

interface EditServiceFormProps {
    service: WithId<Omit<Service, 'id'>>;
    setDialogOpen: (open: boolean) => void;
}

export function EditServiceForm({ service, setDialogOpen }: EditServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const primaryFirestore = useFirestore();
  const { toast } = useToast();

  const usersCollectionRef = useMemoFirebase(
    () => collection(primaryFirestore, 'users'),
    [primaryFirestore]
  );
  
  const { data: users, isLoading: isLoadingUsers } = useCollection<Omit<UserProfile, 'id'>>(usersCollectionRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
      category: service.category,
      unitPrice: service.unitPrice,
      responsibleUserId: service.responsibleUserId || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const serviceDocRef = doc(primaryFirestore, 'services', service.id);
      updateDocumentNonBlocking(serviceDocRef, {
        ...values,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Service mis à jour',
        description: `Le service "${values.name}" a été mis à jour avec succès.`,
      });
      setDialogOpen(false);
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue.",
      });
      console.error("Error updating service:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingUsers) {
    return <div className="space-y-4 py-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-20" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
    </div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du service</FormLabel>
              <FormControl>
                <Input placeholder="Consultation générale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description détaillée du service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Input placeholder="Médical, Chirurgical, Laboratoire..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix Unitaire (XOF)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsibleUserId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable du service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un responsable" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {users?.map((user: WithId<Omit<UserProfile, 'id'>>) => (
                      <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.roleId})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionnel. Le membre du personnel en charge de ce service.
              </FormDescription>
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
    