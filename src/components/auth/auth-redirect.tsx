'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { ReactNode, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

interface AuthRedirectProps {
  children: ReactNode;
  to: string;
  condition: 'isLoggedIn' | 'isLoggedOut';
}

export default function AuthRedirect({ children, to, condition }: AuthRedirectProps) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is determined
    }

    const isLoggedIn = !!user;
    if (condition === 'isLoggedIn' && isLoggedIn) {
      router.replace(to);
    } else if (condition === 'isLoggedOut' && !isLoggedIn) {
      router.replace(to);
    }
  }, [user, isUserLoading, router, to, condition]);

  // Determine what to render
  const isLoggedIn = !!user;
  const shouldRedirect = 
    (condition === 'isLoggedIn' && isLoggedIn) || 
    (condition === 'isLoggedOut' && !isLoggedIn);

  if (isUserLoading || shouldRedirect) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
        </div>
    );
  }

  return <>{children}</>;
}
