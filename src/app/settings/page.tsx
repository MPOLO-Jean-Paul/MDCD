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
  
  export default function SettingsPage() {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        </div>
        <div className="grid gap-6 mt-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Affichage</CardTitle>
                    <CardDescription>
                        Personnalisez l'apparence de l'application.
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
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                    Gérez vos préférences de notification.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Les paramètres de notification seront bientôt disponibles.</p>
                </CardContent>
            </Card>
        </div>
      </>
    );
  }
