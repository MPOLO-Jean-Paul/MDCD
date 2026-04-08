'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { ConsultationWithPatient } from '@/types/consultation';
import { ConsultationTableRowActions } from './consultation-table-row-actions';

const statusTranslations: Record<ConsultationWithPatient['status'], string> = {
    'Completed': 'Terminée',
    'Follow-up Required': 'Suivi requis',
    'Draft': 'Brouillon',
};

const statusVariants: Record<ConsultationWithPatient['status'], 'default' | 'secondary' | 'outline'> = {
    'Completed': 'default',
    'Follow-up Required': 'secondary',
    'Draft': 'outline',
};

export const columns: ColumnDef<ConsultationWithPatient>[] = [
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
        accessorKey: 'consultationDateTime',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('consultationDateTime'));
            return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
        }
    },
    {
        accessorKey: 'patientName',
        header: 'Patient',
    },
    {
        accessorKey: 'diagnosis',
        header: 'Diagnostic',
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const status = row.getValue('status') as ConsultationWithPatient['status'];
            return <Badge variant={statusVariants[status]}>{statusTranslations[status] || status}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <ConsultationTableRowActions consultation={row.original} />,
    },
];
