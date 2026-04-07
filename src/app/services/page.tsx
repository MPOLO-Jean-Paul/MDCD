import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function ServicesPage() {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Gestion des services hospitaliers</CardTitle>
            <CardDescription>
              Ajoutez, modifiez ou supprimez des services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Les fonctionnalités de gestion des services seront bientôt disponibles ici.</p>
          </CardContent>
        </Card>
      </>
    );
  }
