'use client';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from 'lucide-react';

export default function RecentAdmissions() {
  const firestore = useFirestore();
  
  const admissionsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'admissions'), orderBy('createdAt', 'desc'), limit(5)) : null,
    [firestore]
  );
  
  const { data: admissions, isLoading } = useCollection<any>(admissionsQuery);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!admissions || admissions.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Aucune admission récente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {admissions.map((admission) => (
        <Link 
          key={admission.id} 
          href={`/patients/dossier?id=${admission.patientId}`}
          className="flex items-center gap-4 p-2 rounded-xl transition-colors hover:bg-muted/50 group"
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                </AvatarFallback>
            </Avatar>
            {admission.admissionType === 'Urgence' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
            )}
          </div>
          
          <div className="grid gap-1 flex-1 min-w-0">
            <p className="text-sm font-semibold leading-none truncate group-hover:text-primary transition-colors">
              {admission.patientId} {/* In a real app we would join with Patient Name */}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {admission.reasonForAdmission}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <Badge
              variant={
                admission.admissionType === 'Urgence'
                  ? 'destructive'
                  : admission.status === 'Observation'
                    ? 'secondary'
                    : 'outline'
              }
              className="text-[10px] h-5 px-1.5"
            >
              {admission.admissionType}
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-1">
              {admission.createdAt ? formatDistanceToNow(new Date(admission.createdAt), { addSuffix: true, locale: fr }) : ''}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
