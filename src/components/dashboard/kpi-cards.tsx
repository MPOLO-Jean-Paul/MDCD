'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, ClipboardList, DollarSign, Users2, Activity, ArrowUpRight } from 'lucide-react';
import { HospitalDataService } from '@/lib/firestore-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function KpiCards() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await HospitalDataService.getGlobalAnalytics();
        setStats(data);
      } catch (e) {
        console.error("Failed to load dashboard stats:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const kpis = [
    {
      title: "Revenus (Global)",
      value: stats ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.totalRevenue) : "0 F",
      change: stats ? `Taux de recouvrement: ${stats.recoveryRate || 0}%` : "Calcul en cours...",
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: "Inscriptions",
      value: stats ? `+${stats.invoiceCount || 0}` : "0",
      change: "Activité cumulée",
      icon: Users2,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: "Recouvrement Attendu",
      value: stats ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.pendingCollection) : "0 F",
      change: "Factures impayées",
      icon: ClipboardList,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: "Santé Système",
      value: "Stable",
      change: "Cloud & SQL Actif",
      icon: Activity,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10'
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="premium-card overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-xl ${kpi.bgColor} transition-transform group-hover:scale-110`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <div className="text-2xl font-black flex items-baseline gap-2">
                {kpi.value}
                <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <p className="text-[10px] font-bold text-muted-foreground mt-1">{kpi.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
