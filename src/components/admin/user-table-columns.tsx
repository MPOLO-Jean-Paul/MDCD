'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WithId } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { UserTableRowActions } from './user-table-row-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: 'doctor' | 'receptionist' | 'pharmacist' | 'accountant' | 'lab_staff' | 'admin' | 'cashier';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const roleTranslations: Record<UserProfile['roleId'], string> = {
    admin: 'Administrateur',
    doctor: 'Médecin',
    receptionist: 'Réceptionniste',
    pharmacist: 'Pharmacien',
    accountant: 'Comptable',
    cashier: 'Caissier',
    lab_staff: 'Personnel de laboratoire',
};

export const columns: ColumnDef<WithId<Omit<UserProfile, 'id'>>>[] = [
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
        accessorKey: 'firstName',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Nom
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original;
            return <div>{user.firstName} {user.lastName}</div>;
        }
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'roleId',
        header: 'Rôle',
        cell: ({ row }) => {
            const role = row.getValue('roleId') as UserProfile['roleId'];
            return <div>{roleTranslations[role] || role}</div>;
        }
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
        cell: ({ row }) => <UserTableRowActions user={row.original} />,
    },
];

    