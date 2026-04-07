import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const admissions = [
  {
    id: 1,
    name: 'Amina Diallo',
    email: 'amina.d@example.com',
    time: 'Il y a 15 min',
    status: 'Urgence',
    avatar: PlaceHolderImages.find(img => img.id === 'patient1')?.imageUrl || 'https://picsum.photos/seed/patient1/40/40',
    avatarHint: 'woman african'
  },
  {
    id: 2,
    name: 'Moussa Traoré',
    email: 'm.traore@example.com',
    time: 'Il y a 30 min',
    status: 'Programmé',
    avatar: PlaceHolderImages.find(img => img.id === 'patient2')?.imageUrl || 'https://picsum.photos/seed/patient2/40/40',
    avatarHint: 'man african'
  },
  {
    id: 3,
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@example.com',
    time: 'Il y a 1 heure',
    status: 'Urgence',
    avatar: PlaceHolderImages.find(img => img.id === 'patient3')?.imageUrl || 'https://picsum.photos/seed/patient3/40/40',
    avatarHint: 'woman'
  },
  {
    id: 4,
    name: 'Ibrahim Koné',
    email: 'ib.kone@example.com',
    time: 'Il y a 2 heures',
    status: 'Observation',
    avatar: PlaceHolderImages.find(img => img.id === 'patient4')?.imageUrl || 'https://picsum.photos/seed/patient4/40/40',
    avatarHint: 'man'
  },
  {
    id: 5,
    name: 'Mariam Cissoko',
    email: 'mcissoko@example.com',
    time: 'Il y a 4 heures',
    status: 'Programmé',
    avatar: PlaceHolderImages.find(img => img.id === 'patient5')?.imageUrl || 'https://picsum.photos/seed/patient5/40/40',
    avatarHint: 'woman african young'
  },
];

export default function RecentAdmissions() {
  return (
    <div className="space-y-4">
      {admissions.map((admission) => (
        <div key={admission.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={admission.avatar} alt={admission.name} data-ai-hint={admission.avatarHint} />
            <AvatarFallback>{admission.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{admission.name}</p>
            <p className="text-sm text-muted-foreground">{admission.email}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge
              variant={
                admission.status === 'Urgence'
                  ? 'destructive'
                  : admission.status === 'Observation'
                    ? 'secondary'
                    : 'default'
              }
              className={`text-xs ${admission.status === 'Programmé' ? 'bg-primary/20 text-primary border-primary/20' : ''}`}
            >
              {admission.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{admission.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
