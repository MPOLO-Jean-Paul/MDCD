'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n/provider';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label>{t('settingsPage.language.title')}</Label>
      <p className="text-sm text-muted-foreground">
        {t('settingsPage.language.description')}
      </p>
      <Select value={locale} onValueChange={(value) => setLocale(value as 'fr' | 'en')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('settingsPage.language.title')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
