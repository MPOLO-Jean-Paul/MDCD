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
import { InvoiceWithPatient } from '@/types/invoice';
import { RecordPaymentForm } from './record-payment-form';
import { useUserProfile } from '@/firebase/auth-provider';
import { useLanguage } from '@/lib/i18n/provider';


interface InvoiceTableRowActionsProps {
  invoice: WithId<Omit<InvoiceWithPatient, 'id'>>;
}

export function InvoiceTableRowActions({ invoice }: InvoiceTableRowActionsProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();
    const { profile } = useUserProfile();
    const { t } = useLanguage();

    const canRecordPayment = profile?.roleName === 'cashier' || profile?.roleName === 'admin' || profile?.roleName === 'accountant';

    const handleDelete = async () => {
        if (!firestore) return;
        const invoiceDocRef = doc(firestore, 'invoices', invoice.id);
        deleteDocumentNonBlocking(invoiceDocRef);
        
        toast({
            title: t('billingPage.toasts.deleteSuccessTitle'),
            description: t('billingPage.toasts.deleteSuccessDescription', { invoiceId: invoice.id }),
        });
        setIsDeleteAlertOpen(false);
    }


  return (
    <>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
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
                    <DropdownMenuItem>{t('billingPage.actions.viewDetails')}</DropdownMenuItem>
                    {canRecordPayment && (
                        <DropdownMenuItem onClick={() => setIsPaymentDialogOpen(true)}>
                            {t('billingPage.actions.recordPayment')}
                        </DropdownMenuItem>
                    )}
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
                            {t('billingPage.actions.deleteWarning')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t('common.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Record Payment Dialog */}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('billingPage.paymentDialog.title')}</DialogTitle>
                    <DialogDescription>
                        {t('billingPage.paymentDialog.description', { invoiceId: invoice.id, patientName: invoice.patientName || 'N/A' })}
                    </DialogDescription>
                </DialogHeader>
                <RecordPaymentForm invoice={invoice} setDialogOpen={setIsPaymentDialogOpen}/>
            </DialogContent>
        </Dialog>
    </>
  );
}

    