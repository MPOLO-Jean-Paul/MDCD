'use client';

import Link from 'next/link';
import { Separator } from '../ui/separator';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Polyclinique MDCD. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/support" className="text-muted-foreground transition-colors hover:text-foreground">
                Support
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/settings" className="text-muted-foreground transition-colors hover:text-foreground">
                Paramètres
            </Link>
        </div>
      </div>
    </footer>
  );
}
