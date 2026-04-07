'use client';

import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/firebase/auth-provider';
import { ReactNode, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

interface RoleRedirectProps {
  children: ReactNode;
  to: string;
  allowedRoles: string[];
  redirectOnUnauthorized?: boolean; // If true, redirect if user role is NOT in allowedRoles
}

export default function RoleRedirect({ children, to, allowedRoles, redirectOnUnauthorized = false }: RoleRedirectProps) {
  const { profile, isProfileLoading } = useUserProfile();
  const router = useRouter();
  
  const userRole = profile?.roleName;
  const isAuthorized = userRole ? allowedRoles.includes(userRole) : false;

  useEffect(() => {
    if (isProfileLoading) {
      return; // Wait until profile is loaded
    }

    if (redirectOnUnauthorized && !isAuthorized) {
        router.replace(to);
    }
  }, [profile, isProfileLoading, router, to, redirectOnUnauthorized, isAuthorized]);

  if (isProfileLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
        </div>
    );
  }

  if(redirectOnUnauthorized && !isAuthorized) {
    // Also show skeleton while redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    );
  }

  // If not redirecting, or if authorized, render children
  return <>{children}</>;
}
