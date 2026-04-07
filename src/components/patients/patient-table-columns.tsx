'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Patient } from '@/types/patient';
import { PatientTableRowActions } from './patient-table-row-actions';
import { WithId } from '@/firebase';
import { differenceInYears } from 'date-fns';

export const columns: ColumnDef<WithId<Omit<Patient, 'id'>>>[] = [
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
        accessorKey: 'lastName',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nom complet
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const patient = row.original;
            return <div>{patient.lastName} {patient.firstName}</div>;
        },
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Âge',
        cell: ({ row }) => {
            const dob = new Date(row.getValue('dateOfBirth'));
            const age = differenceInYears(new Date(), dob);
            return <span>{age} ans</span>;
        }
    },
    {
        accessorKey: 'gender',
        header: 'Sexe',
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'phone',
        header: 'Téléphone',
    },
    {
        accessorKey: 'address',
        header: 'Adresse',
    },
    {
        id: 'actions',
        cell: ({ row }) => <PatientTableRowActions patient={row.original} />,
    },
];
