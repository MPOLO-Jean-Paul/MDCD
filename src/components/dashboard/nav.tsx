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
  Stethoscope,
  Landmark,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUserProfile } from '@/firebase/auth-provider';
import { useLanguage } from '@/lib/i18n/provider';

// Define menu items for all roles
const allMenuItems = [
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'receptionist', 'pharmacist', 'accountant', 'lab_staff'] },
  { href: '/admissions', labelKey: 'nav.admissions', icon: BedDouble, roles: ['admin', 'doctor'] },
  { href: '/patients', labelKey: 'nav.patients', icon: Users2, roles: ['admin', 'receptionist', 'doctor'] },
  { href: '/consultations', labelKey: 'nav.consultations', icon: Stethoscope, roles: ['admin', 'doctor'] },
  { href: '/billing', labelKey: 'nav.billing', icon: FilePlus, roles: ['admin', 'accountant'] },
  { href: '/insurance', labelKey: 'nav.insurance', icon: Landmark, roles: ['admin', 'accountant'] },
  { href: '/pharmacy', labelKey: 'nav.pharmacy', icon: Pill, roles: ['admin', 'pharmacist'] },
  { href: '/reports', labelKey: 'nav.reports', icon: BarChart3, roles: ['admin', 'accountant'] },
  { href: '/services', labelKey: 'nav.services', icon: ClipboardList, roles: ['admin'] },
  { href: '/admin/users', labelKey: 'nav.users', icon: ShieldCheck, roles: ['admin'] },
];

export function Nav() {
  const pathname = usePathname();
  const { profile, isProfileLoading } = useUserProfile();
  const { t } = useLanguage();

  const userRole = profile?.roleName;

  const menuItems = allMenuItems.filter(item => userRole && item.roles.includes(userRole));

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex h-10 w-full items-center justify-center p-2 group-data-[collapsible=icon]:justify-center">
          <Hospital className="size-8 text-sidebar-primary" />
          <span className="ml-2 text-lg font-bold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
            {t('nav.main')}
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
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </>
          ) : (
            menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.labelKey)}
                  isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true) }
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{t(item.labelKey)}</span>
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
                <SidebarMenuButton asChild tooltip={t('nav.settings')} isActive={pathname === '/settings'}>
                    <Link href="/settings">
                        <Settings />
                        <span>{t('nav.settings')}</span>
                    </Link>
                </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
