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
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useFirestore, updateDocumentNonBlocking, deleteDocumentNonBlocking, WithId } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from './user-table-columns';
import { EditUserForm } from './edit-user-form';


interface UserTableRowActionsProps {
  user: WithId<Omit<UserProfile, 'id'>>;
}

export function UserTableRowActions({ user }: UserTableRowActionsProps) {
    const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

    const firestore = useFirestore();
    const { toast } = useToast();

    const handleToggleActive = async () => {
        const userDocRef = doc(firestore, 'users', user.id);
        const newStatus = !user.isActive;
        updateDocumentNonBlocking(userDocRef, { isActive: newStatus });
        toast({
            title: `Utilisateur ${newStatus ? 'activé' : 'désactivé'}`,
            description: `Le compte de ${user.firstName} ${user.lastName} a été mis à jour.`,
        });
        setIsDeactivateAlertOpen(false);
    };

    const handleDelete = async () => {
        const userDocRef = doc(firestore, 'users', user.id);
        const userRoleDocRef = doc(firestore, 'user_roles', user.id);

        deleteDocumentNonBlocking(userDocRef);
        deleteDocumentNonBlocking(userRoleDocRef);

        // Note: This does not delete the user from Firebase Auth.
        // A backend function is required for that.

        toast({
            title: 'Utilisateur supprimé',
            description: `Le compte de ${user.firstName} ${user.lastName} a été supprimé de la base de données.`,
        });
        setIsDeleteAlertOpen(false);
    }


  return (
    <>
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
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
                        <DropdownMenuItem onClick={() => setIsEditUserDialogOpen(true)}>
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsDeactivateAlertOpen(true)}>
                            {user.isActive ? 'Désactiver' : 'Activer'}
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
                                Cette action est irréversible. Elle supprimera définitivement les données de l'utilisateur de Firestore, mais ne supprimera pas son compte d'authentification.
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
                        <AlertDialogTitle>Confirmer la {user.isActive ? 'désactivation' : 'réactivation'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Voulez-vous vraiment {user.isActive ? 'désactiver' : 'réactiver'} le compte de {user.firstName} {user.lastName}?
                            L'utilisateur ne pourra {user.isActive ? 'plus' : ''} se connecter.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleActive}>{user.isActive ? 'Désactiver' : 'Activer'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Modifier l'utilisateur</DialogTitle>
                <DialogDescription>
                    Mettez à jour les informations de {user.firstName} {user.lastName}.
                </DialogDescription>
                </DialogHeader>
                <EditUserForm user={user} setDialogOpen={setIsEditUserDialogOpen} />
            </DialogContent>
        </Dialog>
    </>
  );
}
