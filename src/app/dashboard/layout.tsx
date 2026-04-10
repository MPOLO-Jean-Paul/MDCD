import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Nav } from '@/components/dashboard/nav';
import { Header } from '@/components/dashboard/header';
import AuthRedirect from '@/components/auth/auth-redirect';
import { Footer } from '@/components/dashboard/footer';
import { MotionPage } from '@/components/providers/motion-page';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRedirect to="/auth/login" condition="isLoggedOut">
        <SidebarProvider>
          <Sidebar>
            <Nav />
          </Sidebar>
          <SidebarInset className="bg-background/95 backdrop-blur-sm">
            <Header />
            <MotionPage className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              {children}
            </MotionPage>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
    </AuthRedirect>
  );
}
