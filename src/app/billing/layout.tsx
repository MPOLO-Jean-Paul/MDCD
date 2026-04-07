import type { ReactNode } from 'react';
import RoleRedirect from '@/components/auth/role-redirect';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Nav } from '@/components/dashboard/nav';
import { Header } from '@/components/dashboard/header';
import AuthRedirect from '@/components/auth/auth-redirect';
import { Footer } from '@/components/dashboard/footer';

export default function BillingLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRedirect to="/auth/login" condition="isLoggedOut">
      <RoleRedirect to="/dashboard" allowedRoles={['admin', 'accountant', 'receptionist']} redirectOnUnauthorized>
        <SidebarProvider>
          <Sidebar>
            <Nav />
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </RoleRedirect>
    </AuthRedirect>
  );
}
