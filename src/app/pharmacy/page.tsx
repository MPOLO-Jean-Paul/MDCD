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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PharmacyKpiCards } from '@/components/pharmacy/kpi-cards';
import { StockList } from '@/components/pharmacy/stock-list';
import { AddStockItemForm } from '@/components/pharmacy/add-stock-item-form';
import { AddMedicationForm } from '@/components/pharmacy/add-medication-form';

export default function PharmacyPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestion de la Pharmacie</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Gérer les produits
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Gérer les produits de la pharmacie</DialogTitle>
              <DialogDescription>
                Ajoutez un nouvel article en stock ou définissez un nouveau type de médicament.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="add-stock" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add-stock">Ajouter au Stock</TabsTrigger>
                <TabsTrigger value="define-medication">Nouveau Médicament</TabsTrigger>
              </TabsList>
              <TabsContent value="add-stock">
                <AddStockItemForm />
              </TabsContent>
              <TabsContent value="define-medication">
                <AddMedicationForm />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        <PharmacyKpiCards />
        <Card>
            <CardHeader>
                <CardTitle>Inventaire des stocks</CardTitle>
                <CardDescription>
                    Suivez et gérez tous les articles en stock dans la pharmacie.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <StockList />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
