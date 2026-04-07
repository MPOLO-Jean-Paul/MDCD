'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WithId } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { StockItemWithMedication } from '@/types/medication';
import { StockTableRowActions } from './stock-table-row-actions';
import { differenceInDays, isBefore, addDays } from 'date-fns';

type Status = 'En Stock' | 'Stock Faible' | 'Péremption Proche' | 'Périmé';

const statusVariants: Record<Status, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'En Stock': 'default',
    'Stock Faible': 'secondary',
    'Péremption Proche': 'destructive',
    'Périmé': 'destructive',
};

export const columns: ColumnDef<WithId<Omit<StockItemWithMedication, 'id'>>>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={ table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
        accessorKey: 'medicationName',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Médicament
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'batchNumber',
        header: 'N° de Lot',
    },
    {
        accessorKey: 'currentQuantity',
        header: 'Quantité',
    },
    {
        accessorKey: 'expirationDate',
        header: 'Date de Péremption',
        cell: ({ row }) => {
            const date = new Date(row.getValue('expirationDate'));
            const daysUntilExpiry = differenceInDays(date, new Date());
            const isExpired = isBefore(date, new Date());
            
            let colorClass = '';
            if (isExpired) {
                colorClass = 'text-destructive font-bold';
            } else if (daysUntilExpiry <= 30) {
                colorClass = 'text-red-600 font-semibold';
            } else if (daysUntilExpiry <= 90) {
                colorClass = 'text-orange-500';
            }
            
            return <div className={colorClass}>{date.toLocaleDateString('fr-FR')}</div>;
        }
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const item = row.original;
            let status: Status = 'En Stock';
            
            const expiration = new Date(item.expirationDate);
            if (isBefore(expiration, new Date())) {
                status = 'Périmé';
            } else if (isBefore(expiration, addDays(new Date(), 30))) {
                status = 'Péremption Proche';
            } else if (item.currentQuantity <= item.reorderLevel) {
                status = 'Stock Faible';
            }

            return <Badge variant={statusVariants[status]}>{status}</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <StockTableRowActions item={row.original} />,
    },
];
