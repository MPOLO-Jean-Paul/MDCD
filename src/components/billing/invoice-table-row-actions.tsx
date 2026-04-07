'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFirestore, deleteDocumentNonBlocking, WithId } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { InvoiceWithPatient } from '@/types/invoice';


interface InvoiceTableRowActionsProps {
  invoice: WithId<Omit<InvoiceWithPatient, 'id'>>;
}

export function InvoiceTableRowActions({ invoice }: InvoiceTableRowActionsProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!firestore) return;
        const invoiceDocRef = doc(firestore, 'invoices', invoice.id);
        deleteDocumentNonBlocking(invoiceDocRef);
        
        toast({
            title: 'Facture supprimée',
            description: `La facture ${invoice.id} a été supprimée.`,
        });
        setIsDeleteAlertOpen(false);
    }


  return (
    <>
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                <DropdownMenuItem>Enregistrer un paiement</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Alert */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr(e) ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement la facture.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
