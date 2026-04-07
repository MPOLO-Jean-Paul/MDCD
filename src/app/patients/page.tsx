import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreatePatientForm } from '@/components/patients/create-patient-form';
import { PatientList } from '@/components/patients/patient-list';

export default function PatientManagementPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des patients</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Enregistrer un nouveau patient</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire ci-dessous pour ajouter un nouveau patient au système.
              </DialogDescription>
            </DialogHeader>
            <CreatePatientForm />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des patients</CardTitle>
          <CardDescription>
            Recherchez, consultez et gérez les dossiers des patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientList />
        </CardContent>
      </Card>
    </>
  );
}
