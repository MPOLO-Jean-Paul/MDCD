'use client';

import Link from 'next/link';
import { Separator } from '../ui/separator';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
