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
import { InsuranceProvider } from '@/types/insurance';
import { useLanguage } from '@/lib/i18n/provider';
import { EditProviderForm } from './edit-provider-form';

interface ProviderTableRowActionsProps {
  provider: WithId<Omit<InsuranceProvider, 'id'>>;
}

export function ProviderTableRowActions({ provider }: ProviderTableRowActionsProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditProviderDialogOpen, setIsEditProviderDialogOpen] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleDelete = async () => {
        if (!firestore) return;
        const providerDocRef = doc(firestore, 'insurance_providers', provider.id);
        deleteDocumentNonBlocking(providerDocRef);

        toast({
            title: t('insurancePage.toasts.deleteSuccessTitle'),
            description: t('insurancePage.toasts.deleteSuccessDescription', { name: provider.name }),
        });
        setIsDeleteAlertOpen(false);
    }

  return (
    <>
        <Dialog open={isEditProviderDialogOpen} onOpenChange={setIsEditProviderDialogOpen}>
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setIsEditProviderDialogOpen(true)}>
                            {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                            {t('common.delete')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete Alert */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('common.areYouSure')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('insurancePage.actions.deleteWarning')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t('common.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>{t('insurancePage.editDialogTitle')}</DialogTitle>
                <DialogDescription>
                    {t('insurancePage.editDialogDescription', { providerName: provider.name })}
                </DialogDescription>
                </DialogHeader>
                <EditProviderForm provider={provider} setDialogOpen={setIsEditProviderDialogOpen} />
            </DialogContent>
        </Dialog>
    </>
  );
}
