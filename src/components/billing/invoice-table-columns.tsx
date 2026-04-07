'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WithId } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { InvoiceWithPatient } from '@/types/invoice';

const statusTranslations: Record<InvoiceWithPatient['status'], string> = {
    Pending: 'En attente',
    Paid: 'Payée',
    'Partially Paid': 'Partiellement payée',
    Overdue: 'En retard',
    Cancelled: 'Annulée',
};

const statusVariants: Record<InvoiceWithPatient['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Paid: 'default',
    'Partially Paid': 'secondary',
    Pending: 'outline',
    Overdue: 'destructive',
    Cancelled: 'destructive',
};

export const columns: ColumnDef<WithId<Omit<InvoiceWithPatient, 'id'>>>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'N° Facture',
        cell: ({ row }) => <div className="font-mono text-xs">...{row.original.id.slice(-6)}</div>
    },
    {
        accessorKey: 'patientName',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Patient
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'invoiceDate',
        header: 'Date de facturation',
        cell: ({ row }) => new Date(row.getValue('invoiceDate')).toLocaleDateString('fr-FR')
    },
    {
        accessorKey: 'totalAmount',
        header: 'Montant Total',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('totalAmount'))
            const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: 'balanceDue',
        header: 'Solde Dû',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('balanceDue'))
            const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
            return <div className="font-medium text-destructive">{formatted}</div>
        }
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const status = row.getValue('status') as InvoiceWithPatient['status'];
            return <Badge variant={statusVariants[status]}>{statusTranslations[status] || status}</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        ),
    },
];
