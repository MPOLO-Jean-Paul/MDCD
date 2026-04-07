import AuthRedirect from '@/components/auth/auth-redirect';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <AuthRedirect to="/dashboard" condition="isLoggedIn">
      <AuthRedirect to="/auth/login" condition="isLoggedOut">
        <div className="flex h-screen w-full items-center justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
        </div>
      </AuthRedirect>
    </AuthRedirect>
  );
}
