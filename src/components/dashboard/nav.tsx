'use client';

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  BedDouble,
  ClipboardPlus,
  Hospital,
  LayoutDashboard,
  Pill,
  Settings,
  Users2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    href: '/',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
  },
  {
    href: '/admissions',
    label: 'Admissions',
    icon: BedDouble,
  },
  {
    href: '/patients',
    label: 'Patients',
    icon: Users2,
  },
  {
    href: '/billing',
    label: 'Facturation',
    icon: ClipboardPlus,
  },
  {
    href: '/pharmacy',
    label: 'Pharmacie',
    icon: Pill,
  },
  {
    href: '/reports',
    label: 'Rapports',
    icon: BarChart3,
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex h-10 w-full items-center justify-center p-2 group-data-[collapsible=icon]:justify-center">
          <Hospital className="size-8 text-sidebar-primary" />
          <span className="ml-2 text-lg font-bold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
            MediFlow Pro
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={pathname === item.href}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <SidebarMenuButton tooltip="Paramètres" isActive={pathname === '/settings'}>
                <Settings />
                <span>Paramètres</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
