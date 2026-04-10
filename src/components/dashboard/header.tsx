'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth, useUser } from '@/firebase';
import { useUserProfile } from '@/firebase/auth-provider';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, CreditCard, LifeBuoy, LogOut, Search, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '../ui/scroll-area';
import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/provider';
import { CommandPalette } from '@/components/ui/command-palette';

// Mock data for notifications
const adminNotifications = [
  { id: 1, title: "Nouvelle admission", description: "Patient Moussa Traoré admis en urgence.", time: "Il y a 5 min", read: false },
  { id: 2, title: "Stock faible", description: "Le stock de Paracétamol est bas.", time: "Il y a 30 min", read: false },
  { id: 3, title: "Rapport financier prêt", description: "Le rapport mensuel de mai 2024 est disponible.", time: "Il y a 2 heures", read: true },
  { id: 4, title: "Mise à jour du système", description: "Maintenance prévue ce soir à 23h.", time: "Il y a 1 jour", read: true },
];

const receptionistNotifications = [
  { id: 1, title: "Nouveau patient enregistré", description: "Dossier pour Awa Gueye créé.", time: "Il y a 3 min", read: false },
  { id: 2, title: "Rapport de labo reçu", description: "Les résultats pour le patient Omar Sy sont prêts pour archivage.", time: "Il y a 15 min", read: false },
  { id: 3, title: "Transfert demandé", description: "Le Dr. Diallo demande le transfert du dossier de M. Ba.", time: "Il y a 1 heure", read: true },
];

const defaultNotifications = [
    { id: 1, title: "Bienvenue !", description: "Aucune notification pour le moment.", time: "maintenant", read: true },
];

export function Header() {
  const auth = useAuth();
  const { user } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();
  const { t } = useLanguage();

  const initialNotifications = useMemo(() => {
    if (!profile) return defaultNotifications;
    switch (profile.roleName) {
        case 'admin':
            return adminNotifications;
        case 'receptionist':
            return receptionistNotifications;
        default:
            return defaultNotifications;
    }
  }, [profile]);

  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/auth/login');
  };
  
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const userInitials = profile?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U';

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1 md:grow-0">
        <CommandPalette />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadNotifications}
                </span>
              )}
              <span className="sr-only">{t('header.notifications.open')}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
                <div className="p-4">
                  <h4 className="font-medium leading-none">{t('header.notifications.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('header.notifications.unread', {count: unreadNotifications})}
                  </p>
                </div>
                <ScrollArea className="h-[300px]">
                    <div className="grid gap-1 p-2">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href="#"
                        className="group grid grid-cols-[25px_1fr] items-start gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                        onClick={() => handleNotificationClick(notification.id)}
                        data-read={notification.read}
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 group-data-[read=true]:hidden" />
                        <div className="grid gap-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </Link>
                    ))}
                    </div>
                </ScrollArea>
                <div className="border-t p-2">
                    <Button size="sm" variant="link" className="w-full" onClick={markAllAsRead}>{t('header.notifications.markAllAsRead')}</Button>
                </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatar?.imageUrl} alt="Avatar" data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (user?.displayName || 'Utilisateur')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2" />
                  <span>{t('header.userMenu.profile')}</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">
                  <CreditCard className="mr-2" />
                  <span>{t('header.userMenu.billing')}</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2" />
                  <span>{t('header.userMenu.settings')}</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/support">
                  <LifeBuoy className="mr-2" />
                  <span>{t('header.userMenu.support')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2" />
              <span>{t('header.userMenu.logout')}</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
