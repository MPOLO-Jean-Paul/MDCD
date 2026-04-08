'use client';
import { AccountingTabs } from '@/components/accounting/accounting-tabs';
import { useLanguage } from '@/lib/i18n/provider';

export default function AccountingPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
       <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">{t('accountingPage.title')}</h2>
      </div>
      <AccountingTabs />
    </div>
  );
}
