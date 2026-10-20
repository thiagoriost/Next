import { Suspense } from 'react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthScreen from '@/components/auth/AuthScreen';
import { getSafeRedirectTarget } from '@/lib/auth-redirect';

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <AuthPageShell>
      <AuthScreen mode="login" redirectTo={getSafeRedirectTarget(next)} />
    </AuthPageShell>
  );
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense
      fallback={
        <AuthPageShell>
          <p aria-live="polite" className="text-sm text-[#19322F]/70">
            Cargando…
          </p>
        </AuthPageShell>
      }
    >
      <LoginPageContent {...props} />
    </Suspense>
  );
}
