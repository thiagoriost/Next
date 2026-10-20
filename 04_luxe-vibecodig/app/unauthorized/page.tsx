'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers/I18nProvider';

export default function UnauthorizedPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="max-w-lg rounded-3xl border border-[#dce8e5] bg-white p-10 text-center shadow-[0_20px_60px_-30px_rgba(25,50,47,0.3)]">
        <span aria-hidden="true" className="material-symbols-outlined text-5xl text-[#006655]">
          lock
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">{t.unauthorized.title}</h1>
        <p className="mt-3 leading-7 text-[#5C706D]">
          {t.unauthorized.description}
        </p>
        <Link
          className="mt-7 inline-flex rounded-xl bg-[#006655] px-5 py-3 font-semibold text-white transition hover:bg-[#005544]"
          href="/"
        >
          {t.unauthorized.backToSite}
        </Link>
      </section>
    </main>
  );
}
