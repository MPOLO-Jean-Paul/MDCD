import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail } from 'lucide-react';
  
export default function SupportPage() {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Support</h2>
        </div>
        <Card className="max-w-2xl mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="h-6 w-6" />
                    Centre d'aide
                </CardTitle>
                <CardDescription>
                    Besoin d'aide ? Contactez notre équipe de support.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Si vous rencontrez un problème technique ou si vous avez des questions sur l'utilisation de l'application, notre équipe est là pour vous aider.</p>
                <div className='flex items-center gap-4'>
                    <Button asChild>
                        <a href="mailto:support@mediflow.pro">
                            <Mail className="mr-2 h-4 w-4" />
                            Contacter par e-mail
                        </a>
                    </Button>
                </div>
                <div>
                    <h3 className='font-semibold'>Horaires de support</h3>
                    <p className='text-sm text-muted-foreground'>Lundi - Vendredi : 9h00 - 17h00</p>
                </div>
            </CardContent>
        </Card>
      </>
    );
}
