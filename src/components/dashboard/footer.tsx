'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/provider';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto border-t bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex h-auto min-h-14 max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:py-0 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground md:text-left">
            {t('footer.copyright', {year: new Date().getFullYear()})}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium">
            <Link href="/support" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.support')}
            </Link>
            <Link href="/settings" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.settings')}
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.terms')}
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.privacy')}
            </Link>
        </div>
      </div>
    </footer>
  );
}
