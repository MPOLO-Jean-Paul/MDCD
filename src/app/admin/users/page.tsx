import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function UserManagementPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Créer un utilisateur
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Créez, modifiez et gérez les comptes des membres du personnel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>La fonctionnalité de gestion des utilisateurs sera bientôt disponible ici.</p>
        </CardContent>
      </Card>
    </>
  );
}
