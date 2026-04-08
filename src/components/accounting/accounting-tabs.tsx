'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoicesToProcessList } from "./invoices-to-process-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "@/lib/i18n/provider";
import { AccountingStatsTab } from "./accounting-stats-tab";

export function AccountingTabs() {
    const { t } = useLanguage();
    return (
        <Tabs defaultValue="invoices" className="space-y-4">
            <TabsList>
                <TabsTrigger value="invoices">{t('accountingPage.tabs.invoicesToProcess')}</TabsTrigger>
                <TabsTrigger value="stats">{t('accountingPage.tabs.stats')}</TabsTrigger>
                <TabsTrigger value="claims">{t('accountingPage.tabs.claims')}</TabsTrigger>
                <TabsTrigger value="disputes">{t('accountingPage.tabs.disputes')}</TabsTrigger>
            </TabsList>
            <TabsContent value="invoices" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('accountingPage.invoices.title')}</CardTitle>
                        <CardDescription>
                            {t('accountingPage.invoices.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InvoicesToProcessList />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="stats" className="space-y-4">
                <AccountingStatsTab />
            </TabsContent>
            <TabsContent value="claims" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('accountingPage.claims.title')}</CardTitle>
                        <CardDescription>
                            {t('accountingPage.claims.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('common.soon')}</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="disputes" className="space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('accountingPage.disputes.title')}</CardTitle>
                        <CardDescription>
                             {t('accountingPage.disputes.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('common.soon')}</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
