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
import { AdmissionList } from '@/components/admissions/admission-list';
import { CreateAdmissionForm } from '@/components/admissions/create-admission-form';

export default function AdmissionPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Admissions</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle admission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une admission</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle admission pour un patient.
              </DialogDescription>
            </DialogHeader>
            <CreateAdmissionForm />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Admissions récentes</CardTitle>
          <CardDescription>
            Liste des dernières admissions, urgences et rendez-vous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdmissionList />
        </CardContent>
      </Card>
    </>
  );
}
