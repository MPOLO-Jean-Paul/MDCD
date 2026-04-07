'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { ThemeSwitcher } from '@/components/settings/theme-switcher';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/i18n/provider';

  export default function SettingsPage() {
    const { t } = useLanguage();

    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{t('settingsPage.title')}</h2>
        </div>
        <div className="grid gap-6 mt-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settingsPage.display.title')}</CardTitle>
                    <CardDescription>
                        {t('settingsPage.display.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ThemeSwitcher />
                    <Separator />
                    <LanguageSwitcher />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('settingsPage.notifications.title')}</CardTitle>
                    <CardDescription>
                        {t('settingsPage.notifications.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t('settingsPage.notifications.unavailable')}</p>
                </CardContent>
            </Card>
        </div>
      </>
    );
  }
