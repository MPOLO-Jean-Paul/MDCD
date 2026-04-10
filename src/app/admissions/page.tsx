'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Activity, Users, Clock, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdmissionList } from '@/components/admissions/admission-list';
import { CreateAdmissionForm } from '@/components/admissions/create-admission-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function AdmissionPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const firestore = useFirestore();

  const admissionsRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'admissions'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: admissions } = useCollection<any>(admissionsRef);

  const urgences = admissions?.filter(a => a.admissionType === 'Urgence')?.length ?? 0;
  const enAttente = admissions?.filter(a => a.status === 'En attente')?.length ?? 0;
  const aujourdhui = admissions?.filter(a => {
    if (!a.admissionDateTime) return false;
    const d = new Date(a.admissionDateTime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  })?.length ?? 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Accueil & Admissions</h2>
          <p className="text-muted-foreground text-sm mt-1">Gestion des flux patients — Portail d'entrée</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <PlusCircle className="h-4 w-4" />
              Nouvelle Admission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvel Enrôlement Patient</DialogTitle>
              <DialogDescription>
                Renseignez les informations d'admission, de triage et d'encaissement initial.
              </DialogDescription>
            </DialogHeader>
            <CreateAdmissionForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <Card className="premium-card">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Admissions du jour</p>
              <p className="text-2xl font-bold">{aujourdhui}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-l-4 border-l-destructive">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Urgences actives</p>
              <p className="text-2xl font-bold text-destructive">{urgences}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-l-4 border-l-yellow-500">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">En attente de consultation</p>
              <p className="text-2xl font-bold">{enAttente}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle>File des Admissions</CardTitle>
              <CardDescription>Toutes les admissions, urgences et rendez-vous en temps réel</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdmissionList />
        </CardContent>
      </Card>
    </>
  );
}
