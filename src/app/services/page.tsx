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
import { CreateServiceForm } from '@/components/services/create-service-form';
import { ServiceList } from '@/components/services/service-list';

export default function ServicesPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des services</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau service</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour créer un nouveau service hospitalier.
              </DialogDescription>
            </DialogHeader>
            <CreateServiceForm />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des services</CardTitle>
          <CardDescription>
            Créez, modifiez et gérez les services offerts par la polyclinique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceList />
        </CardContent>
      </Card>
    </>
  );
}
    