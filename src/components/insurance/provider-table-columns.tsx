'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WithId } from '@/firebase';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { InsuranceProvider } from '@/types/insurance';
import { ProviderTableRowActions } from './provider-table-row-actions';
import { useLanguage } from '@/lib/i18n/provider';

export const columns: ColumnDef<WithId<Omit<InsuranceProvider, 'id'>>>[] = [
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
        accessorKey: 'name',
        header: ({ column }) => {
            const { t } = useLanguage();
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t('insurancePage.table.name')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
    },
    {
        accessorKey: 'contactPerson',
        header: 'Personne à contacter',
    },
    {
        accessorKey: 'contactPhone',
        header: 'Téléphone',
    },
    {
        accessorKey: 'monthlySubscriptionFee',
        header: 'Abonnement Mensuel',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('monthlySubscriptionFee'))
            if (isNaN(amount) || amount === 0) {
                return <div className="text-muted-foreground">-</div>
            }
            const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <ProviderTableRowActions provider={row.original} />,
    },
];
