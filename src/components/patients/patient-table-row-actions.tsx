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
import { useToast } from '@/hooks/use-toast';
import { Patient } from '@/types/patient';
import { EditPatientForm } from './edit-patient-form';
import { WithId, useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';


interface PatientTableRowActionsProps {
  patient: WithId<Omit<Patient, 'id'>>;
}

export function PatientTableRowActions({ patient }: PatientTableRowActionsProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const firestore = useFirestore();

    const { toast } = useToast();

    const handleDelete = async () => {
        if (!firestore) return;
        const patientDocRef = doc(firestore, 'patients', patient.id);
        deleteDocumentNonBlocking(patientDocRef);
        toast({
            title: 'Patient supprimé',
            description: `Le dossier de ${patient.firstName} ${patient.lastName} a été supprimé.`,
        });
        setIsDeleteAlertOpen(false);
    }


  return (
    <>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>Voir le dossier</DropdownMenuItem>
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
                            Cette action est irréversible. Elle supprimera définitivement le dossier du patient et toutes les données associées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                <DialogTitle>Modifier le dossier patient</DialogTitle>
                <DialogDescription>
                    Mettez à jour les informations pour {patient.firstName} {patient.lastName}.
                </DialogDescription>
                </DialogHeader>
                <EditPatientForm patient={patient} setDialogOpen={setIsEditDialogOpen} />
            </DialogContent>
        </Dialog>
    </>
  );
}
