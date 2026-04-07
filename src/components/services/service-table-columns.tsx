'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WithId } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { ServiceTableRowActions } from './service-table-row-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { ServiceWithUser } from '@/types/service';

export const columns: ColumnDef<WithId<Omit<ServiceWithUser, 'id'>>>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
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
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Nom du service
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
    },
    {
        accessorKey: 'category',
        header: 'Catégorie',
    },
    {
        accessorKey: 'unitPrice',
        header: 'Prix Unitaire',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('unitPrice'))
            const formatted = new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'XOF',
            }).format(amount)
       
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: 'responsibleUserName',
        header: 'Responsable',
    },
    {
        accessorKey: 'isActive',
        header: 'Statut',
        cell: ({ row }) => {
            const isActive = row.getValue('isActive');
            return <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? 'Actif' : 'Inactif'}</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <ServiceTableRowActions service={row.original} />,
    },
];
    