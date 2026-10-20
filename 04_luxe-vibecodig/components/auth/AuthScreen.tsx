'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Provider } from '@supabase/supabase-js';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import {
  AUTH_REDIRECT_STORAGE_KEY,
  getSafeRedirectTarget,
} from '@/lib/auth-redirect';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

interface AuthScreenProps {
  mode: 'login' | 'signup';
  redirectTo?: string;
}

export default function AuthScreen({ mode, redirectTo = '/' }: AuthScreenProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isSignup = mode === 'signup';
  const safeRedirectTo = getSafeRedirectTarget(redirectTo);

  useEffect(() => {
    if (!authLoading && user) router.replace(safeRedirectTo);
  }, [authLoading, router, safeRedirectTo, user]);

  const startOAuth = async (provider: Extract<Provider, 'google' | 'facebook'>) => {
    setBusy(true);
    setError('');
    try {
      window.sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safeRedirectTo);
      const { error: authError } =
        await getSupabaseBrowserClient().auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      if (authError) throw authError;
    } catch (authError) {
      window.sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
      console.error(`[AuthScreen] ${provider} sign-in failed:`, authError);
      setError(authError instanceof Error ? authError.message : String(authError));
      setBusy(false);
    }
  };

  const sendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { error: authError } =
        await getSupabaseBrowserClient().auth.signInWithOtp({
          phone: phone.trim(),
          options: { shouldCreateUser: isSignup },
        });
      if (authError) throw authError;
      setCodeSent(true);
    } catch (authError) {
      console.error('[AuthScreen] Failed to send phone verification code:', authError);
      setError(authError instanceof Error ? authError.message : String(authError));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { error: authError } =
        await getSupabaseBrowserClient().auth.verifyOtp({
          phone: phone.trim(),
          token: code.trim(),
          type: 'sms',
        });
      if (authError) throw authError;
        router.replace(safeRedirectTo);
    } catch (authError) {
      console.error('[AuthScreen] Phone verification failed:', authError);
      setError(authError instanceof Error ? authError.message : String(authError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative z-10 w-full max-w-md">
      <header className="mb-10 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#006655] text-white shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)]">
          <span aria-hidden="true" className="material-symbols-outlined text-3xl">
            real_estate_agent
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#19322F] sm:text-3xl">
          {isSignup ? t.auth.signupTitle : t.auth.loginTitle}
        </h1>
        <p className="text-sm text-[#19322F]/60">{isSignup ? t.auth.signupSubtitle : t.auth.loginSubtitle}</p>
      </header>

      <section className="rounded-2xl border border-white/50 bg-white p-8 shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)] backdrop-blur-sm sm:p-10">
        <div className="space-y-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void startOAuth('google')}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-gray-100 bg-white p-3.5 font-medium text-[#19322F] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-5px_rgba(25,50,47,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 translate-y-full bg-[#D9ECC8]/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <svg aria-hidden="true" className="relative z-10 h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="relative z-10">{t.auth.continueWithGoogle}</span>
          </button>

         {/*  <button
            type="button"
            disabled={busy}
            onClick={() => void startOAuth('facebook')}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-gray-100 bg-white p-3.5 font-medium text-[#19322F] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-5px_rgba(25,50,47,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 translate-y-full bg-[#D9ECC8]/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <svg aria-hidden="true" className="relative z-10 h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.028 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.93-1.956 1.885v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.101 24 18.098 24 12.073Z" />
            </svg>
            <span className="relative z-10">{t.auth.continueWithFacebook}</span>
          </button> */}
        </div>

        <div className="my-6 flex items-center gap-4 text-xs text-[#19322F]/45">
          <span className="h-px flex-1 bg-[#19322F]/10" />
          <span>{t.auth.or}</span>
          <span className="h-px flex-1 bg-[#19322F]/10" />
        </div>
{/* 
        {codeSent ? (
          <form className="space-y-4" onSubmit={verifyCode}>
            <p aria-live="polite" className="text-center text-sm text-[#19322F]/70">
              {t.auth.codeSentMessage}{' '}
              <span className="font-medium text-[#19322F]">{phone.trim()}</span>
            </p>
            <label className="block text-sm font-medium text-[#19322F]" htmlFor="verification-code">
              {t.auth.verificationCode}
            </label>
            <input
              autoComplete="one-time-code"
              autoFocus
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-center tracking-[0.3em] text-[#19322F] outline-none transition focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
              id="verification-code"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value)}
              pattern="[0-9]{6}"
              placeholder={t.auth.verificationCodePlaceholder}
              required
              value={code}
            />
            <button
              className="w-full rounded-lg bg-[#006655] p-3.5 font-semibold text-white transition-colors hover:bg-[#004d40] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? t.auth.verifyingCode : t.auth.verifyCode}
            </button>
            <button
              className="w-full text-sm font-medium text-[#006655] transition-colors hover:text-[#004d40]"
              onClick={() => {
                setCodeSent(false);
                setCode('');
                setError('');
              }}
              type="button"
            >
              {t.auth.resendCode}
            </button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={sendCode}>
            <label className="block text-sm font-medium text-[#19322F]" htmlFor="phone-number">
              {t.auth.phoneLabel}
            </label>
            <input
              autoComplete="tel"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-[#19322F] outline-none transition placeholder:text-[#19322F]/35 focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
              id="phone-number"
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t.auth.phonePlaceholder}
              required
              type="tel"
              value={phone}
            />
            <p className="text-xs text-[#19322F]/50">{t.auth.phoneHint}</p>
            <button
              className="w-full rounded-lg border border-gray-100 bg-white p-3.5 font-medium text-[#19322F] transition-all hover:border-[#006655]/30 hover:bg-[#D9ECC8]/20 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? t.auth.sendingCode : t.auth.sendCode}
            </button>
          </form>
        )}
 */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <p className="mt-7 text-center text-sm text-[#19322F]/70">
          {isSignup ? t.auth.hasAccount : t.auth.noAccount}{' '}
          <Link
            className="font-semibold text-[#006655] transition-colors hover:text-[#004d40]"
            href={isSignup ? '/login' : '/signup'}
          >
            {isSignup ? t.auth.loginLink : t.auth.signupLink}
          </Link>
        </p>
      </section>

      <nav aria-label="Legal" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#19322F]/50">
          <li><a className="transition-colors hover:text-[#19322F]" href="#privacy">{t.auth.privacyPolicy}</a></li>
          <li><a className="transition-colors hover:text-[#19322F]" href="#terms">{t.auth.termsOfService}</a></li>
          <li><a className="transition-colors hover:text-[#19322F]" href="#help">{t.auth.helpCenter}</a></li>
        </ul>
      </nav>
    </main>
  );
}
