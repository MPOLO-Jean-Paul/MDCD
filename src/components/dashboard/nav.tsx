'use client';

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  BedDouble,
  FilePlus,
  Hospital,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldCheck,
  Users2,
  ClipboardList,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUserProfile } from '@/firebase/auth-provider';

// Define menu items for all roles
const allMenuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'doctor', 'receptionist', 'pharmacist', 'accountant', 'lab_staff'] },
  { href: '/admissions', label: 'Admissions', icon: BedDouble, roles: ['admin', 'receptionist', 'doctor'] },
  { href: '/patients', label: 'Patients', icon: Users2, roles: ['admin', 'receptionist', 'doctor'] },
  { href: '/billing', label: 'Facturation', icon: FilePlus, roles: ['admin', 'accountant'] },
  { href: '/pharmacy', label: 'Pharmacie', icon: Pill, roles: ['admin', 'pharmacist'] },
  { href: '/reports', label: 'Rapports', icon: BarChart3, roles: ['admin', 'accountant'] },
  { href: '/services', label: 'Services', icon: ClipboardList, roles: ['admin'] },
  { href: '/admin/users', label: 'Utilisateurs', icon: ShieldCheck, roles: ['admin'] },
];

export function Nav() {
  const pathname = usePathname();
  const { profile, isProfileLoading } = useUserProfile();

  const userRole = profile?.roleName;

  const menuItems = allMenuItems.filter(item => userRole && item.roles.includes(userRole));

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex h-10 w-full items-center justify-center p-2 group-data-[collapsible=icon]:justify-center">
          <Hospital className="size-8 text-sidebar-primary" />
          <span className="ml-2 text-lg font-bold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
            Polyclinique MDCD
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {isProfileLoading ? (
            <>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </>
          ) : (
            menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true) }
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Paramètres" isActive={pathname === '/settings'}>
              <Link href="/settings">
                <Settings />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
