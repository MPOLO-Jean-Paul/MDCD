'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/provider';

export default function SupportPage() {
    const { t } = useLanguage();

    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{t('supportPage.title')}</h2>
        </div>
        <Card className="max-w-2xl mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="h-6 w-6" />
                    {t('supportPage.helpCenter')}
                </CardTitle>
                <CardDescription>
                    {t('supportPage.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>{t('supportPage.body')}</p>
                <div className='flex items-center gap-4'>
                    <Button asChild>
                        <a href="mailto:support@mediflow.pro">
                            <Mail className="mr-2 h-4 w-4" />
                            {t('supportPage.contactByEmail')}
                        </a>
                    </Button>
                </div>
                <div>
                    <h3 className='font-semibold'>{t('supportPage.supportHours')}</h3>
                    <p className='text-sm text-muted-foreground'>{t('supportPage.hours')}</p>
                </div>
            </CardContent>
        </Card>
      </>
    );
}
