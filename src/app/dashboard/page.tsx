'use client';

import KpiCards from '@/components/dashboard/kpi-cards';
import RecentAdmissions from '@/components/dashboard/recent-admissions';
import RevenueChart from '@/components/dashboard/revenue-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/firebase/auth-provider';
import { ReceptionistDashboard } from '@/components/dashboard/receptionist-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { profile, isProfileLoading } = useUserProfile();

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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                <Skeleton className="h-80 col-span-1 lg:col-span-4" />
                <Skeleton className="h-80 col-span-1 lg:col-span-3" />
            </div>
        </div>
      </div>
    );
  }

  const isReceptionist = profile?.roleName === 'receptionist';

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {isReceptionist ? 'Tableau de Bord - Réception' : 'Tableau de Bord'}
        </h2>
      </div>

      <div className="space-y-4 mt-4">
        {isReceptionist ? (
          <ReceptionistDashboard />
        ) : (
          <>
            <KpiCards />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Aperçu des revenus</CardTitle>
                  <CardDescription>
                    Aperçu mensuel des revenus de l'hôpital.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <RevenueChart />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Admissions Récentes</CardTitle>
                  <CardDescription>
                    Les 5 dernières admissions de la journée.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentAdmissions />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
