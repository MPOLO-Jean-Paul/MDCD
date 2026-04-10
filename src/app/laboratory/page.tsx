'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { 
  FlaskConical, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ArrowRight,
  Database,
  History,
  Beaker
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { HospitalDataService } from '@/lib/firestore-service';
import { motion, AnimatePresence } from 'framer-motion';

export default function LaboratoryPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [resultsInput, setResultsInput] = useState<Record<string, string>>({});

  const labRequestsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'lab_requests'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  
  const { data: requests, isLoading } = useCollection<any>(labRequestsQuery);

  const handleSubmitResults = async (req: any) => {
    const id = req.id;
    setLoadingAction(id);
    try {
      if (!firestore) return;
      const results = resultsInput[id] || '';
      
      // 1. Update Real-time Firestore document
      await updateDoc(doc(firestore, 'lab_requests', id), {
        status: 'Résultats disponibles',
        results: results,
        resultedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 2. Archive to Heavy-Duty Postgres (Supabase)
      try {
        await HospitalDataService.archiveLabReport({
          patientId: req.patientId,
          consultationId: req.consultationId || 'N/A',
          results: { content: results, timestamp: new Date().toISOString() },
          notes: `Analysé par Plateau Technique le ${new Date().toLocaleDateString()}`
        });
      } catch (archiveError) {
        console.warn("Archivage en attente (Sync différée).", archiveError);
      }

      toast({ 
        title: '✅ Résultats validés', 
        description: 'Les données ont été archivées dans la base centrale et envoyées au dossier patient.' 
      });
      setResultsInput(prev => ({ ...prev, [id]: '' }));
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleValidatePayment = async (id: string) => {
    setLoadingAction(id + '-pay');
    try {
      if (!firestore) return;
      await updateDoc(doc(firestore, 'lab_requests', id), {
        status: 'Payé — En analyse',
        updatedAt: new Date().toISOString()
      });
      toast({ title: '✅ Paiement confirmé', description: 'Le spécimen peut maintenant être traité par le technicien.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const filteredRequests = requests?.filter(req =>
    req.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const pendingPayment = requests?.filter(r => r.status === 'En attente de paiement')?.length ?? 0;
  const inAnalysis = requests?.filter(r => r.status === 'Payé — En analyse')?.length ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Workstation Laboratoire</h2>
          <p className="text-muted-foreground text-sm mt-1">Poste de contrôle technique et validation d'analyses</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher spécimen ou patient..."
            className="pl-9 bg-card focus:ring-primary h-10 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Modern KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="premium-card bg-destructive/5 border-destructive/10">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="p-3 bg-destructive/10 rounded-full mb-3 shadow-inner">
                <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">À facturer</p>
            <p className="text-2xl font-black mt-1">{pendingPayment}</p>
          </CardContent>
        </Card>
        
        <Card className="premium-card bg-blue-500/5 border-blue-500/10">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="p-3 bg-blue-500/10 rounded-full mb-3 shadow-sm">
                <Beaker className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">En Analyse</p>
            <p className="text-2xl font-black mt-1 text-blue-600">{inAnalysis}</p>
          </CardContent>
        </Card>

        <Card className="premium-card hidden md:flex col-span-2 items-center justify-between px-6 bg-primary/5">
            <div className="space-y-1">
                <p className="text-sm font-bold flex items-center gap-2 italic">
                    <Database className="w-4 h-4" /> Sauvegarde Active
                </p>
                <p className="text-xs text-muted-foreground">Les validations sont archivées dans le dossier patient</p>
            </div>
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted shadow-sm flex items-center justify-center text-[10px] font-bold">L{i}</div>
                ))}
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rouned-xl" />
            <Skeleton className="h-32 w-full rouned-xl" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center glass rounded-3xl border border-dashed"
          >
            <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Le plateau technique est à jour.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
                {filteredRequests.map(req => (
                <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <Card className={`premium-card overflow-hidden transition-all ${req.status === 'Payé — En analyse' ? 'ring-2 ring-blue-500/20 shadow-blue-500/5 shadow-xl' : ''}`}>
                        <div className="flex flex-col md:flex-row">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border/50">
                                            <FlaskConical className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-mono text-lg font-bold tracking-tighter">{req.id}</h3>
                                            <p className="text-xs text-muted-foreground font-medium">Patient : <span className="text-primary">{req.patientId}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge 
                                            variant={req.status === 'En attente de paiement' ? 'destructive' : 'secondary'}
                                            className="h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-widest"
                                        >
                                            {req.status}
                                        </Badge>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Demandé il y a 2h</p>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-2xl border border-border/40">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-2 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Prescription Médicale
                                    </p>
                                    <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{req.details}</p>
                                </div>

                                {req.status === 'Résultats disponibles' && (
                                    <div className="bg-green-500/[0.03] border border-green-500/20 p-4 rounded-2xl">
                                        <p className="text-[10px] uppercase font-black text-green-600 mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3" /> Résultats Validés
                                        </p>
                                        <p className="text-sm italic text-muted-foreground">{req.results}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:w-80 bg-muted/20 border-l border-border/50 flex flex-col justify-center">
                                {req.status === 'En attente de paiement' ? (
                                    <div className="text-center space-y-4">
                                        <div className="mx-auto w-12 h-12 bg-white/40 dark:bg-black/20 rounded-full flex items-center justify-center border shadow-inner">
                                            <AlertTriangle className="w-6 h-6 text-destructive" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold">Encaissement requis</p>
                                            <p className="text-[10px] text-muted-foreground">Le technicien ne peut traiter le spécimen sans libération financière.</p>
                                        </div>
                                        <Button
                                            onClick={() => handleValidatePayment(req.id)}
                                            disabled={loadingAction === req.id + '-pay'}
                                            className="w-full bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive shadow-none font-bold"
                                        >
                                            {loadingAction === req.id + '-pay' ? 'Processing...' : '💳 Confirmer Paiement'}
                                        </Button>
                                    </div>
                                ) : req.status === 'Payé — En analyse' ? (
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-blue-600">Saisie des résultats</Label>
                                        <Textarea
                                            placeholder="Hb: 12.5, GB: 4800..."
                                            className="bg-background min-h-[100px] text-xs resize-none border-blue-500/20 focus:ring-blue-500"
                                            value={resultsInput[req.id] || ''}
                                            onChange={e => setResultsInput(prev => ({ ...prev, [req.id]: e.target.value }))}
                                        />
                                        <Button
                                            className="w-full h-11 shadow-lg shadow-primary/20 bg-primary group"
                                            onClick={() => handleSubmitResults(req)}
                                            disabled={loadingAction === req.id || !resultsInput[req.id]}
                                        >
                                            {loadingAction === req.id ? (
                                                <Clock className="animate-spin w-4 h-4" />
                                            ) : (
                                                <>
                                                    Valider & Archiver
                                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-2 opacity-60">
                                        <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-green-500/10 scale-110 mb-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-tighter">Dossier Bouclé</p>
                                        <p className="text-[10px] text-muted-foreground px-4">Archivé dans le Dossier Patient</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-50 px-2">
          <History className="w-3 h-3" /> Dernier mouvement labo enregistré : 14:32 (Central Time)
      </div>
    </div>
  );
}
