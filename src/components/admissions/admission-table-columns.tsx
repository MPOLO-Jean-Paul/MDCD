'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { AdmissionWithPatient } from '@/types/admission';
import { AdmissionTableRowActions } from './admission-table-row-actions';

const admissionTypeTranslations: Record<AdmissionWithPatient['admissionType'], string> = {
    'Rendez-vous': 'Rendez-vous',
    'Urgence': 'Urgence',
    'Hospitalisation': 'Hospitalisation',
};

const admissionStatusTranslations: Record<AdmissionWithPatient['status'], string> = {
    Pending: 'En attente',
    Admitted: 'Admis',
    Discharged: 'Sorti',
    Completed: 'Terminé',
    Canceled: 'Annulé',
};

const admissionStatusVariants: Record<AdmissionWithPatient['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Admitted: 'default',
    Pending: 'secondary',
    Completed: 'outline',
    Discharged: 'outline',
    Canceled: 'destructive',
};

export const columns: ColumnDef<AdmissionWithPatient>[] = [
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
        accessorKey: 'patientName',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Patient
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'admissionDateTime',
        header: 'Date d\'admission',
        cell: ({ row }) => {
            const date = new Date(row.getValue('admissionDateTime'));
            return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
        }
    },
    {
        accessorKey: 'admissionType',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('admissionType') as AdmissionWithPatient['admissionType'];
            return <span>{admissionTypeTranslations[type] || type}</span>;
        }
    },
    {
        accessorKey: 'reasonForAdmission',
        header: 'Motif',
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const status = row.getValue('status') as AdmissionWithPatient['status'];
            return <Badge variant={admissionStatusVariants[status]}>{admissionStatusTranslations[status] || status}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <AdmissionTableRowActions admission={row.original} />,
    },
];
