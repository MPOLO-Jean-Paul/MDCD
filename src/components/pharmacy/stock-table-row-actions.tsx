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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useFirestore, deleteDocumentNonBlocking, WithId } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { StockItemWithMedication } from '@/types/medication';
import { EditStockItemForm } from './edit-stock-item-form';


interface StockTableRowActionsProps {
  item: WithId<Omit<StockItemWithMedication, 'id'>>;
}

export function StockTableRowActions({ item }: StockTableRowActionsProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);

    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!firestore) return;
        const itemDocRef = doc(firestore, 'stock_items', item.id);
        deleteDocumentNonBlocking(itemDocRef);

        toast({
            title: 'Article supprimé du stock',
            description: `Le lot ${item.batchNumber} de ${item.medicationName} a été supprimé.`,
        });
        setIsDeleteAlertOpen(false);
    }

  return (
    <>
        <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
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
                    <DropdownMenuItem onClick={() => setIsEditItemDialogOpen(true)}>
                        Modifier
                    </DropdownMenuItem>
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
                            Cette action est irréversible. Elle supprimera définitivement cet article du stock.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Modifier l'article en stock</DialogTitle>
                <DialogDescription>
                    Mise à jour des informations pour le lot {item.batchNumber} de {item.medicationName}.
                </DialogDescription>
                </DialogHeader>
                <EditStockItemForm item={item} setDialogOpen={setIsEditItemDialogOpen} />
            </DialogContent>
        </Dialog>
    </>
  );
}
