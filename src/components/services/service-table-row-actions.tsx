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
import { useFirestore, updateDocumentNonBlocking, deleteDocumentNonBlocking, WithId } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Service } from './service-table-columns';
import { EditServiceForm } from './edit-service-form';


interface ServiceTableRowActionsProps {
  service: WithId<Omit<Service, 'id'>>;
}

export function ServiceTableRowActions({ service }: ServiceTableRowActionsProps) {
    const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);

    const firestore = useFirestore();
    const { toast } = useToast();

    const handleToggleActive = async () => {
        const serviceDocRef = doc(firestore, 'services', service.id);
        const newStatus = !service.isActive;
        updateDocumentNonBlocking(serviceDocRef, { isActive: newStatus });
        toast({
            title: `Service ${newStatus ? 'activé' : 'désactivé'}`,
            description: `Le service ${service.name} a été mis à jour.`,
        });
        setIsDeactivateAlertOpen(false);
    };

    const handleDelete = async () => {
        const serviceDocRef = doc(firestore, 'services', service.id);
        deleteDocumentNonBlocking(serviceDocRef);
        toast({
            title: 'Service supprimé',
            description: `Le service ${service.name} a été supprimé.`,
        });
        setIsDeleteAlertOpen(false);
    }


  return (
    <>
        <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
            <AlertDialog open={isDeactivateAlertOpen} onOpenChange={setIsDeactivateAlertOpen}>
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
                        <DropdownMenuItem onClick={() => setIsEditServiceDialogOpen(true)}>
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsDeactivateAlertOpen(true)}>
                            {service.isActive ? 'Désactiver' : 'Activer'}
                        </DropdownMenuItem>
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
                                Cette action est irréversible. Elle supprimera définitivement le service de la base de données.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Deactivate Alert */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la {service.isActive ? 'désactivation' : 'réactivation'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Voulez-vous vraiment {service.isActive ? 'désactiver' : 'réactiver'} le service {service.name}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleActive}>{service.isActive ? 'Désactiver' : 'Activer'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Modifier le service</DialogTitle>
                <DialogDescription>
                    Mettez à jour les informations du service {service.name}.
                </DialogDescription>
                </DialogHeader>
                <EditServiceForm service={service} setDialogOpen={setIsEditServiceDialogOpen} />
            </DialogContent>
        </Dialog>
    </>
  );
}
    