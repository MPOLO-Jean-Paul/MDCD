import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpdateProfileForm } from '@/components/profile/update-profile-form';
import { ChangePasswordForm } from '@/components/profile/change-password-form';

export default function ProfilePage() {
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
            </div>
            <Tabs defaultValue="profile" className="w-full max-w-2xl mt-4">
                <TabsList>
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="password">Mot de passe</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du profil</CardTitle>
                            <CardDescription>
                                Mettez à jour vos informations personnelles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdateProfileForm />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Changer le mot de passe</CardTitle>
                            <CardDescription>
                                Assurez-vous d'utiliser un mot de passe long et aléatoire pour garantir la sécurité de votre compte.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}
