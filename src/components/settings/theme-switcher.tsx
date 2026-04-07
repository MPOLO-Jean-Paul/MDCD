'use client';

import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/lib/i18n/provider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
        <Label>{t('settingsPage.theme.title')}</Label>
        <p className="text-sm text-muted-foreground">
            {t('settingsPage.theme.description')}
        </p>
        <RadioGroup
            defaultValue={theme}
            onValueChange={setTheme}
            className="grid max-w-md grid-cols-3 gap-8 pt-2"
        >
            <Label className="relative cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <span className="flex items-center justify-center text-sm font-semibold">
                    {t('settingsPage.theme.light')}
                </span>
            </Label>
            <Label className="relative cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <span className="flex items-center justify-center text-sm font-semibold">
                    {t('settingsPage.theme.dark')}
                </span>
            </Label>
            <Label className="relative cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <span className="flex items-center justify-center text-sm font-semibold">
                    {t('settingsPage.theme.system')}
                </span>
            </Label>
        </RadioGroup>
    </div>
  );
}
