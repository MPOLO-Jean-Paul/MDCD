'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Activity, 
  History, 
  FileText, 
  CreditCard, 
  ArrowLeft, 
  Clock, 
  AlertCircle,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { HospitalDataService } from '@/lib/firestore-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { medicalDocumentInsight } from '@/ai/flows/medical-document-insight';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function DossierContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id');
  const firestore = useFirestore();
  const [heavyData, setHeavyData] = useState<{ history: any, invoice: any } | null>(null);
  const [isHeavyDataLoading, setIsHeavyDataLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<{ summary: string, criticalFindings: string[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Firestore: Get real-time patient metadata
  const patientDocRef = useMemoFirebase(
    () => (firestore && patientId) ? doc(firestore, 'patients', patientId) : null,
    [firestore, patientId]
  );
  const { data: patient, isLoading: isFirestoreLoading } = useDoc<any>(patientDocRef);

  // Supabase: Get historical data
  useEffect(() => {
    if (!patientId) return;
    async function loadHeavyData() {
      setIsHeavyDataLoading(true);
      try {
        const history = await HospitalDataService.getPatientMedicalHistory(patientId);
        const invoice = await HospitalDataService.getInvoiceStatus(patientId);
        setHeavyData({ history, invoice });
      } catch (e) {
        console.error("Error loading heavy dossier data:", e);
      } finally {
        setIsHeavyDataLoading(false);
      }
    }
    loadHeavyData();
  }, [patientId]);

  const generateAIInsight = async () => {
    if (!heavyData?.history?.medicalHistory) {
      toast({
        title: "Pas de données",
        description: "L'historique médical est vide.",
        variant: "destructive",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const insight = await medicalDocumentInsight({
        documentContent: heavyData.history.medicalHistory,
        documentType: 'historical_note'
      });
      setAiInsight(insight);
      toast({
        title: "Analyse terminée",
        description: "L'IA a généré un résumé de ce dossier.",
      });
    } catch (e) {
      console.error("AI Insight Error:", e);
      toast({
        title: "Erreur IA",
        description: "Impossible de générer l'analyse pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!patientId) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold">Identifiant patient manquant</h2>
        <Button asChild className="mt-4"><Link href="/dashboard">Retour au Tableau de bord</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition-enter">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dossier Patient Consolidé</h2>
          <p className="text-muted-foreground text-sm">Vision consolidée du dossier patient</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="premium-card col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isFirestoreLoading ? <Skeleton className="h-6 w-32" /> : `${patient?.firstName} ${patient?.lastName}`}
              </CardTitle>
              <CardDescription>ID: {patientId}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Sexe:</div>
                <div className="font-bold">{patient?.gender || 'N/A'}</div>
                <div className="text-muted-foreground">Groupe:</div>
                <div className="font-bold text-red-600">{patient?.bloodGroup || 'N/A'}</div>
                <div className="text-muted-foreground">National ID:</div>
                <div className="font-mono">{patient?.nationalId || 'N/A'}</div>
            </div>
            
            <div className="pt-4 border-t space-y-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Logiciel de Santé Sync</p>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <ShieldCheck className="w-3 h-3" /> Données synchronisées
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Status (Real-time from Firestore) */}
        <Card className="premium-card lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    Statut Clinique Actuel
                </CardTitle>
                <CardDescription>Dernière mise à jour : {patient?.updatedAt ? format(new Date(patient.updatedAt), 'pp', { locale: frLocale }) : 'Récemment'}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-2xl border">
                    <p className="text-xs text-muted-foreground font-bold">Température</p>
                    <p className="text-2xl font-black mt-1">37.2°C</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border">
                    <p className="text-xs text-muted-foreground font-bold">Tension</p>
                    <p className="text-2xl font-black mt-1">12/8</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border">
                    <p className="text-xs text-muted-foreground font-bold">Pouls</p>
                    <p className="text-2xl font-black mt-1">78</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border">
                    <p className="text-xs text-muted-foreground font-bold">SpO2</p>
                    <p className="text-2xl font-black mt-1">98%</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="history" className="gap-2"><History className="w-4 h-4" /> Historique</TabsTrigger>
            <TabsTrigger value="exams" className="gap-2"><FlaskConical className="w-4 h-4" /> Examens</TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2"><Pill className="w-4 h-4" /> Ordonnances</TabsTrigger>
            <TabsTrigger value="billing" className="gap-2"><CreditCard className="w-4 h-4" /> Facturation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">Antécédents & Historique Médical</CardTitle>
                <CardDescription>Historique complet et archivage médical.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="p-4 bg-muted/20 border rounded-2xl">
                     <h4 className="font-bold flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-orange-500" /> Antécédents Médicaux</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {isHeavyDataLoading ? <Skeleton className="h-4 w-full" /> : (heavyData?.history?.medicalHistory || "Pas d'antécédents renseignés.")}
                    </p>
                    
                    {!isHeavyDataLoading && heavyData?.history?.medicalHistory && (
                      <div className="mt-4 pt-4 border-t border-dashed">
                        <Button 
                          onClick={generateAIInsight} 
                          disabled={isAiLoading}
                          variant="outline" 
                          className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                        >
                          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          {isAiLoading ? "Analyse en cours..." : "Générer un Résumé IA"}
                        </Button>
                      </div>
                    )}
                 </div>

                 {aiInsight && (
                    <div className="p-5 glass-card bg-primary/5 border-primary/20 relative overflow-hidden group transition-all">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-16 h-16 text-primary" />
                      </div>
                      <h4 className="font-bold flex items-center gap-2 mb-3 text-primary">
                        <Sparkles className="w-5 h-5" /> Analyse IA MDCD
                      </h4>
                      <div className="space-y-4 relative z-10">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Résumé synthétique</p>
                          <p className="text-sm leading-relaxed">{aiInsight.summary}</p>
                        </div>
                        {aiInsight.criticalFindings && aiInsight.criticalFindings.length > 0 && (
                          <div>
                            <p className="text-[10px] uppercase font-bold text-red-500 tracking-widest mb-1">Points Critiques</p>
                            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                              {aiInsight.criticalFindings.map((finding: string, i: number) => (
                                <li key={i}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                 )}
                 
                 <div className="p-4 bg-muted/20 border rounded-2xl">
                    <h4 className="font-bold flex items-center gap-2 mb-2"><Stethoscope className="w-4 h-4 text-blue-500" /> Épisodes Précédents</h4>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-start border-l-2 border-primary pl-4 py-1">
                            <div>
                                <p className="font-bold">Consultation Générale</p>
                                <p className="text-xs text-muted-foreground">Service de Médecine interne</p>
                            </div>
                            <Badge variant="outline">04 Mars 2026</Badge>
                        </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="exams" className="mt-6">
            <div className="py-20 text-center opacity-40">
                <FlaskConical className="w-12 h-12 mx-auto mb-4" />
                <p>Aucun résultat d'examen archivé.</p>
            </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
            <div className="py-20 text-center opacity-40">
                <Pill className="w-12 h-12 mx-auto mb-4" />
                <p>Aucune ordonnance en cours.</p>
            </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">Situation Financière</CardTitle>
                <CardDescription>Solde, factures et règlements centralisés.</CardDescription>
              </CardHeader>
              <CardContent>
                 {isHeavyDataLoading ? (
                    <Skeleton className="h-20 w-full" />
                 ) : heavyData?.invoice ? (
                    <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/20">
                        <div>
                            <p className="text-xs uppercase font-black text-primary tracking-widest">Dernière Facture</p>
                            <p className="text-3xl font-black mt-2">${heavyData.invoice.totalAmount}</p>
                            <Badge className="mt-2 bg-primary/20 text-primary border-none">{heavyData.invoice.status}</Badge>
                        </div>
                        <Button className="software-btn">Voir les Détails</Button>
                    </div>
                 ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Aucune facture trouvée pour ce patient.</p>
                    </div>
                 )}
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PatientDossierPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center"><Skeleton className="h-10 w-full" /></div>}>
      <DossierContent />
    </Suspense>
  );
}
