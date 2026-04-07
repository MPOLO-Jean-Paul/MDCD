import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Nav } from '@/components/dashboard/nav';
import { Header } from '@/components/dashboard/header';
import AuthRedirect from '@/components/auth/auth-redirect';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRedirect to="/auth/login" condition="isLoggedOut">
        <SidebarProvider>
          <Sidebar>
            <Nav />
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
    </AuthRedirect>
  );
}
