'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Users,
  Search,
  LayoutDashboard,
  Pill,
  Hospital,
  Stethoscope,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center justify-start px-3 py-1.5 text-sm font-medium transition-colors border rounded-md bg-muted/50 hover:bg-muted text-muted-foreground w-64 group"
      >
        <Search className="w-4 h-4 mr-2" />
        <span className="inline-flex">Recherche rapide...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList className="no-scrollbar">
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Tableau de Bord</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/patients'))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Dossiers Patients</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/pharmacy'))}>
              <Pill className="mr-2 h-4 w-4" />
              <span>Pharmacie & Stocks</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/laboratory'))}>
              <Stethoscope className="mr-2 h-4 w-4" />
              <span>Laboratoire</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions Rapides">
            <CommandItem onSelect={() => runCommand(() => router.push('/patients/new'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Ajouter un Patient</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/billing/new'))}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Créer une Facture</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Paramètres">
            <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres Système</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
