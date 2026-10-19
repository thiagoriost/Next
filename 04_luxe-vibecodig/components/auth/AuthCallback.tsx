'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers/I18nProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AuthCallback() {
  const router = useRouter();
  const { t } = useI18n();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    void getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) throw error;
        if (!data.session) throw new Error('The authentication callback returned no session.');
        router.replace('/');
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('[AuthCallback] Failed to complete OAuth sign-in:', error);
        setHasError(true);
      });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="relative z-10 text-center">
      {hasError ? (
        <>
          <p className="mb-5 text-sm text-red-700" role="alert">
            {t.auth.callbackError}
          </p>
          <Link className="font-semibold text-[#006655] hover:text-[#004d40]" href="/login">
            {t.auth.backToLogin}
          </Link>
        </>
      ) : (
        <p aria-live="polite" className="text-sm text-[#19322F]/70">
          {t.auth.callbackLoading}
        </p>
      )}
    </main>
  );
}
