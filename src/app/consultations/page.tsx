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
import { ConsultationList } from '@/components/consultations/consultation-list';
import { CreateConsultationForm } from '@/components/consultations/create-consultation-form';

export default function ConsultationPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Consultations</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Nouvelle Consultation Médicale</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour enregistrer une nouvelle consultation.
              </DialogDescription>
            </DialogHeader>
            <CreateConsultationForm />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Consultations Récentes</CardTitle>
          <CardDescription>
            Liste des dernières consultations médicales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultationList />
        </CardContent>
      </Card>
    </>
  );
}
