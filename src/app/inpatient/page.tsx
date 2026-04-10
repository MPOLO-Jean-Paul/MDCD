'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BedDouble, 
  Wallet, 
  UserCheck, 
  AlertCircle, 
  TrendingUp, 
  Building2, 
  User,
  MoreVertical,
  LogOut,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BEDS_DATA = [
  { id: '101A', service: 'Médecine Interne', status: 'Occupé', patientId: 'PAT-4F58X', patientName: 'Amina Diallo', admissionDate: '2026-04-05', deposit: 500, dailyRate: 150 },
  { id: '101B', service: 'Médecine Interne', status: 'Libre', patientId: null, patientName: null, admissionDate: null, deposit: 0, dailyRate: 150 },
  { id: '102A', service: 'Médecine Interne', status: 'Occupé', patientId: 'PAT-3D12R', patientName: 'Moussa Traoré', admissionDate: '2026-04-07', deposit: 300, dailyRate: 150 },
  { id: '205A', service: 'Maternité', status: 'Occupé', patientId: 'PAT-9U21K', patientName: 'Fatou Ndiaye', admissionDate: '2026-04-01', deposit: 1000, dailyRate: 200 },
  { id: '205B', service: 'Maternité', status: 'Libre', patientId: null, patientName: null, admissionDate: null, deposit: 0, dailyRate: 200 },
  { id: '301A', service: 'Pédiatrie', status: 'Nettoyage', patientId: null, patientName: null, admissionDate: null, deposit: 0, dailyRate: 100 },
  { id: '302A', service: 'Pédiatrie', status: 'Libre', patientId: null, patientName: null, admissionDate: null, deposit: 0, dailyRate: 100 },
  { id: '401A', service: 'Chirurgie', status: 'Occupé', patientId: 'PAT-7H88Z', patientName: 'Ibrahim Koné', admissionDate: '2026-04-06', deposit: 800, dailyRate: 250 },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  'Occupé':    { label: 'Occupé',    bg: 'bg-destructive/10',    text: 'text-destructive',    icon: UserCheck },
  'Libre':     { label: 'Disponible', bg: 'bg-green-500/10',      text: 'text-green-600',      icon: Plus },
  'Nettoyage': { label: 'Hygiène',    bg: 'bg-orange-500/10',      text: 'text-orange-600',     icon: AlertCircle },
};

export default function InpatientPage() {
  const { toast } = useToast();
  const [beds, setBeds] = useState(BEDS_DATA);
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleAddDeposit = (bedId: string) => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Montant invalide', description: 'Veuillez saisir un montant positif.' });
      return;
    }
    setBeds(beds.map(b => b.id === bedId ? { ...b, deposit: b.deposit + amount } : b));
    setDepositAmount('');
    toast({ title: '✅ Acompte enregistré', description: `$${amount.toFixed(2)} ajouté au dossier du patient.` });
    setSelectedBed(null);
  };

  const calculateBilling = (admissionStr: string | null, rate: number, deposit: number) => {
    if (!admissionStr) return { nights: 0, total: 0, balance: 0 };
    const diffTime = Math.abs(new Date().getTime() - new Date(admissionStr).getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const total = nights * rate;
    return { nights, total, balance: total - deposit };
  };

  const occupiedBeds = beds.filter(b => b.status === 'Occupé').length;
  const freeBeds = beds.filter(b => b.status === 'Libre').length;
  const occupancyRate = Math.round((occupiedBeds / beds.length) * 100);

  const services = [...new Set(beds.map(b => b.service))];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Hospitalisation & Lits</h2>
          <p className="text-muted-foreground text-sm mt-1">Surveillance hôtelière et gestion des séjours longs</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
                <Building2 className="w-4 h-4" /> Configurer Services
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/20">
                <BedDouble className="w-4 h-4" /> Admission Lit
            </Button>
        </div>
      </div>

      {/* KPI Row with premium styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="premium-card bg-primary/5 border-primary/10">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taux d'occupation</p>
              <h3 className="text-3xl font-bold mt-1">{occupancyRate}%</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="premium-card">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lits Occupés</p>
              <h3 className="text-3xl font-bold mt-1 text-destructive">{occupiedBeds} <span className="text-lg font-normal text-muted-foreground">/ {beds.length}</span></h3>
            </div>
            <div className="p-3 bg-destructive/10 rounded-2xl">
              <BedDouble className="w-6 h-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
              <h3 className="text-3xl font-bold mt-1 text-green-600">{freeBeds}</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-2xl">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] glass-tabs">
          <TabsTrigger value="map" className="gap-2"><BedDouble className="w-4 h-4" /> Cartographie</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><Wallet className="w-4 h-4" /> Suivi Financier</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-8">
          {services.map(service => (
            <div key={service} className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="text-lg font-bold tracking-tight">{service}</h3>
                <Badge variant="outline" className="ml-auto text-xs font-normal">
                    {beds.filter(b => b.service === service && b.status === 'Libre').length} lits dispos
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {beds.filter(b => b.service === service).map(bed => {
                  const config = statusConfig[bed.status] || statusConfig['Libre'];
                  const Icon = config.icon;
                  return (
                    <motion.div
                        key={bed.id}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Card className={`premium-card h-full transition-all border-l-4 ${bed.status === 'Occupé' ? 'border-l-destructive shadow-lg shadow-destructive/5' : ''}`}>
                             <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base font-bold">Lit {bed.id}</CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                             </CardHeader>
                             <CardContent className="space-y-3">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                                  <Icon className="w-3 h-3" />
                                  {config.label}
                                </div>
                                {bed.patientId ? (
                                  <Link href={`/patients/dossier?id=${bed.patientId}`} className="block group">
                                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{bed.patientName}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{bed.patientId}</p>
                                  </Link>
                                ) : (
                                  <div className="pt-2">
                                    <Button variant="ghost" size="sm" className="w-full text-[10px] h-7 border-dashed border-2 hover:bg-green-500/5">
                                        Assigner Patient
                                    </Button>
                                  </div>
                                )}
                             </CardContent>
                        </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {beds.filter(b => b.status === 'Occupé').map(bed => {
              const { nights, total, balance } = calculateBilling(bed.admissionDate, bed.dailyRate, bed.deposit);
              const isAtRisk = balance > 0 && balance > bed.deposit;
              return (
                <Card key={bed.id} className={`premium-card overflow-hidden ${isAtRisk ? 'border-destructive/30 bg-destructive/[0.02]' : ''}`}>
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="text-xl font-bold flex items-center gap-2">
                                    {bed.patientName}
                                    <Badge variant="outline" className="text-[10px]">{bed.id}</Badge>
                                </h4>
                                <p className="text-sm text-muted-foreground">Admis le {bed.admissionDate} • {bed.service}</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/patients/dossier?id=${bed.patientId}`}>Dossier <ArrowUpRight className="ml-1 w-3 h-3" /></Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-[10px] uppercase text-muted-foreground font-bold">Durée</p>
                                <p className="text-sm font-bold mt-1 text-primary">{nights} nuits</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-[10px] uppercase text-muted-foreground font-bold">Tarif Journalier</p>
                                <p className="text-sm font-bold mt-1">${bed.dailyRate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:w-1/2 bg-muted/20 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl border">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Encouru</p>
                                <p className="text-2xl font-black">${total.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Acomptes</p>
                                <p className="text-lg font-bold text-green-600">-${bed.deposit.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Solde Restant</p>
                                <p className={`text-xl font-bold ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    {balance > 0 ? `$${balance.toFixed(2)}` : 'SÉJOUR COUVERT'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {selectedBed === bed.id ? (
                                    <div className="flex gap-1 animate-in slide-in-from-right-2">
                                        <Input 
                                            type="number" 
                                            className="w-24 h-9 bg-background" 
                                            placeholder="$..." 
                                            value={depositAmount} 
                                            onChange={e => setDepositAmount(e.target.value)}
                                        />
                                        <Button size="sm" onClick={() => handleAddDeposit(bed.id)}>Ok</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setSelectedBed(null)}>x</Button>
                                    </div>
                                ) : (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => setSelectedBed(bed.id)}>Acompte</Button>
                                        <Button size="sm" className="gap-2"><LogOut className="w-4 h-4" /> Sortie</Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isAtRisk && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold rounded-lg uppercase tracking-tight"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                Risque Financier Élevé : Le patient a consommé son acompte.
                            </motion.div>
                        )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
        </svg>
    )
}
