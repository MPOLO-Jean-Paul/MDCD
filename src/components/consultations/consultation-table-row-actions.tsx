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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { ConsultationWithPatient } from '@/types/consultation';
import { EditConsultationForm } from './edit-consultation-form';

interface ConsultationTableRowActionsProps {
  consultation: ConsultationWithPatient;
}

export function ConsultationTableRowActions({ consultation }: ConsultationTableRowActionsProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { toast } = useToast();

  return (
    <>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Prescrire des médicaments</DropdownMenuItem>
                <DropdownMenuItem>Demander un examen</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                <DialogTitle>Modifier la consultation</DialogTitle>
                <DialogDescription>
                    Mise à jour du dossier de consultation pour {consultation.patientName}.
                </DialogDescription>
                </DialogHeader>
                <EditConsultationForm consultation={consultation} setDialogOpen={setIsEditDialogOpen} />
            </DialogContent>
        </Dialog>
    </>
  );
}
