'use client';

import Link from 'next/link';
import { Separator } from '../ui/separator';
import { useLanguage } from '@/lib/i18n/provider';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto border-t bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
            {t('footer.copyright', {year: new Date().getFullYear()})}
        </p>
        <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/support" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.support')}
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/settings" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.settings')}
            </Link>
        </div>
      </div>
    </footer>
  );
}
