import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function SettingsPage() {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        </div>
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>
                    Gérez les paramètres de votre compte et de l'application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Les fonctionnalités de paramètres seront bientôt disponibles.</p>
            </CardContent>
        </Card>
      </>
    );
  }
