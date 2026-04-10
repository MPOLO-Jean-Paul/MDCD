'use client';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Pill, 
  Package, 
  ArrowUpRight, 
  History, 
  Search,
  ShoppingCart
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PharmacyKpiCards } from '@/components/pharmacy/kpi-cards';
import { StockList } from '@/components/pharmacy/stock-list';
import { AddStockItemForm } from '@/components/pharmacy/add-stock-item-form';
import { AddMedicationForm } from '@/components/pharmacy/add-medication-form';
import { DeliverPrescriptionForm } from '@/components/pharmacy/deliver-prescription-form';
import { Input } from '@/components/ui/input';

export default function PharmacyPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Gestion Pharmaceutique</h2>
          <p className="text-muted-foreground text-sm mt-1">Dispensation, approvisionnement et inventaire critique</p>
        </div>
        
        <div className="flex gap-2">
            <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                <PlusCircle className="h-4 w-4" />
                Opérations
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>Centre d'Opérations Pharmaceutiques</DialogTitle>
                <DialogDescription>
                    Effectuez une dispensation ou gérez le catalogue de médicaments.
                </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="deliver" className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass-tabs">
                    <TabsTrigger value="deliver" className="gap-2"><ShoppingCart className="w-4 h-4" /> Délivrer</TabsTrigger>
                    <TabsTrigger value="add-stock" className="gap-2"><ArrowUpRight className="w-4 h-4" /> Stock</TabsTrigger>
                    <TabsTrigger value="define-medication" className="gap-2"><Pill className="w-4 h-4" /> Catalogue</TabsTrigger>
                </TabsList>
                <TabsContent value="deliver" className="mt-6">
                    <DeliverPrescriptionForm />
                </TabsContent>
                <TabsContent value="add-stock" className="mt-6">
                    <AddStockItemForm />
                </TabsContent>
                <TabsContent value="define-medication" className="mt-6">
                    <AddMedicationForm />
                </TabsContent>
                </Tabs>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        <PharmacyKpiCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="premium-card lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Inventaire Permanent
                        </CardTitle>
                        <CardDescription>
                            Suivi des stocks en temps réel synchronisé avec PostgreSQL
                        </CardDescription>
                    </div>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un produit..." className="pl-9 bg-muted/30" />
                    </div>
                </CardHeader>
                <CardContent>
                    <StockList />
                </CardContent>
            </Card>

            <Card className="premium-card lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <History className="w-4 h-4 text-primary" />
                        Mouvements Récents
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 border rounded-xl flex items-center justify-between text-sm">
                        <span className="font-medium">Paracétamol 500mg</span>
                        <Badge variant="destructive" className="h-5">-10</Badge>
                    </div>
                    <div className="p-3 border rounded-xl flex items-center justify-between text-sm">
                        <span className="font-medium">Amoxicilline 1g</span>
                        <Badge variant="secondary" className="h-5">+100</Badge>
                    </div>
                    <div className="p-3 border rounded-xl flex items-center justify-between text-sm">
                        <span className="font-medium">Sérum Physiologique</span>
                        <Badge variant="destructive" className="h-5">-5</Badge>
                    </div>
                    <Button variant="ghost" className="w-full text-xs text-muted-foreground mt-2">
                        Voir tout l'historique Postgres
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
