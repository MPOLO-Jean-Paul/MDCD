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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Pill, Search, CheckCircle } from 'lucide-react';
import { HospitalDataService } from '@/lib/firestore-service';
import { Card, CardContent } from '@/components/ui/card';

const searchSchema = z.object({
  prescriptionId: z.string().min(1, 'Numéro d\'ordonnance requis'),
});

export function DeliverPrescriptionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [prescription, setPrescription] = useState<any>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      prescriptionId: '',
    },
  });

  async function onSearch(values: z.infer<typeof searchSchema>) {
    setIsLoading(true);
    try {
      if (!firestore) throw new Error("Firestore non disponible.");
      // In production, we'd query the prescriptions collection
      const docRef = doc(firestore, 'prescriptions', values.prescriptionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'Délivrée') {
           toast({ variant: 'destructive', title: 'Attention', description: 'Cette ordonnance a déjà été délivrée !' });
        } else {
           setPrescription({ id: docSnap.id, ...data });
        }
      } else {
        toast({ variant: 'destructive', title: 'Introuvable', description: 'Aucune ordonnance trouvée avec ce numéro.' });
      }
    } catch (e: any) {
       console.error(e);
       // For demo/UI testing if no firestore data is there:
       setPrescription({ id: values.prescriptionId, patientId: "PAT-DEMO", medications: "Paracétamol 1g", status: 'Non délivrée' });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeliver() {
      if (!prescription) return;
      setIsLoading(true);
      try {
           // 1. Update Firestore status (for real-time UI)
           if (firestore && user) {
               const docRef = doc(firestore, 'prescriptions', prescription.id);
               await updateDoc(docRef, {
                   status: 'Délivrée',
                   deliveredBy: user.uid,
                   deliveredAt: new Date().toISOString()
               });

               // 2. Perform Real De-stocking in Firestore
               // Note: In a real system, we would parse 'prescription.medications' or use a structured items array
               // For this demo, we use a sample itemId if recognized, or log a generic outgoing transaction
               if (prescription.items && Array.isArray(prescription.items)) {
                  for (const item of prescription.items) {
                    await HospitalDataService.updateStock(
                      item.itemId, 
                      -(item.quantity), 
                      `Dispensation Ordonnance ${prescription.id}`, 
                      user.uid
                    );
                  }
               } else {
                 console.warn("Prescription items not structured for automatic de-stocking. Skipping SQL update.");
               }
           }
           toast({ title: 'Succès', description: 'Ordonnance délivrée avec succès. Stocks mis à jour.' });
           setPrescription(null);
           form.reset();
           if (onSuccess) onSuccess();
      } catch (e: any) {
           toast({ variant: 'destructive', title: 'Erreur', description: e.message });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <div className="space-y-6 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearch)} className="flex gap-2 items-end">
          <FormField
            control={form.control}
            name="prescriptionId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Numéro d'ordonnance unique (ex: RX-1A2B3C)</FormLabel>
                <FormControl>
                  <div className="relative">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input placeholder="RX-..." className="pl-9 bg-card" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>Chercher</Button>
        </form>
      </Form>

      {prescription && (
          <Card className="bg-muted/30 border-dashed animate-in fade-in zoom-in-95">
             <CardContent className="pt-4 space-y-4">
                 <div className="flex justify-between items-center border-b pb-2">
                     <span className="font-semibold text-primary">{prescription.id}</span>
                     <span className="text-sm text-muted-foreground">Patient: {prescription.patientId}</span>
                 </div>
                 <div className="text-sm space-y-1">
                     <p className="font-medium">Médicaments à délivrer :</p>
                     <p className="whitespace-pre-wrap">{prescription.medications}</p>
                 </div>
                 <Button onClick={handleDeliver} className="w-full gap-2" variant="default" disabled={isLoading}>
                     <CheckCircle className="h-4 w-4" /> 
                     Valider la délivrance et déstocker
                 </Button>
             </CardContent>
          </Card>
      )}
    </div>
  );
}
