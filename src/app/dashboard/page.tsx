'use client';

import { useEffect, useState } from 'react';
import KpiCards from '@/components/dashboard/kpi-cards';
import RecentAdmissions from '@/components/dashboard/recent-admissions';
import RevenueChart from '@/components/dashboard/revenue-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/firebase/auth-provider';
import { ReceptionistDashboard } from '@/components/dashboard/receptionist-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { HospitalDataService } from '@/lib/firestore-service';

import * as motion from 'framer-motion/client';
import { Landmark, TrendingUp, Users, ShieldCheck, RefreshCcw } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { profile, isProfileLoading } = useUserProfile();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      setIsSyncing(true);
      try {
        const data = await HospitalDataService.getGlobalAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error("Dashboard Analytics Sync Error:", e);
      } finally {
        setIsSyncing(false);
      }
    }
    loadAnalytics();
  }, []);

  if (isProfileLoading) {
    return (
      <div className='pt-6 space-y-4'>
        <Skeleton className='h-8 w-64' />
        <div className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        </div>
      </div>
    );
  }

  const isReceptionist = profile?.roleName === 'receptionist';

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">
            {isReceptionist ? 'Tableau de Réception' : 'Pilotage Médical'}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Ravi de vous revoir, {profile?.firstName}. Voici l'état des services.
          </p>
        </div>
      </div>

      <motion.div variants={item} className="space-y-4">
        {isReceptionist ? (
          <ReceptionistDashboard />
        ) : (
          <>
            <KpiCards />
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
              <motion.div variants={item} className="col-span-1 lg:col-span-4">
                <Card className="premium-card h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardDescription>Données temps réel consolidées</CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RevenueChart />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item} className="col-span-1 lg:col-span-3">
                <Card className="premium-card h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">Activité Récente</CardTitle>
                        <CardDescription>5 dernières admissions cliniques</CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RecentAdmissions />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Hybrid DB Showcase: Management Insights from Postgres */}
            <motion.div variants={item}>
                <Card className="premium-card border-l-4 border-l-primary overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Landmark className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Intelligence de Gestion
                        </CardTitle>
                        <CardDescription>
                            Analyses approfondies et reporting financier consolidé.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recettes Globales</p>
                                <p className="text-2xl font-bold mt-1">${analytics?.totalRevenue?.toLocaleString() || '0'}</p>
                                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Données stabilisées
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Restant à Percevoir</p>
                                <p className="text-2xl font-bold mt-1">${analytics?.pendingCollection?.toLocaleString() || '0'}</p>
                                <p className="text-xs text-orange-500 mt-2 font-medium">Factures impayées</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service de données</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-400 animate-spin' : 'bg-green-500'}`} />
                                    <span className="text-sm font-medium">
                                        {isSyncing ? 'Synchronisation...' : 'Connecté'}
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 uppercase">Base de données active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
