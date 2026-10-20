import { Locale } from '@/lib/i18n';

interface LanguageFlagProps {
  locale: Locale;
  className?: string;
}

export default function LanguageFlag({
  locale,
  className = '',
}: LanguageFlagProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 36 24"
      className={`inline-block h-4 w-6 shrink-0 overflow-hidden rounded-sm border border-black/10 shadow-sm ${className}`}
    >
      {locale === 'es' ? (
        <>
          <path fill="#FCD116" d="M0 0h36v24H0z" />
          <path fill="#003893" d="M0 12h36v6H0z" />
          <path fill="#CE1126" d="M0 18h36v6H0z" />
        </>
      ) : (
        <>
          <path fill="#fff" d="M0 0h36v24H0z" />
          <path
            fill="#B22234"
            d="M0 0h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0z"
          />
          <path fill="#3C3B6E" d="M0 0h15.5v12.92H0z" />
          <g fill="#fff">
            <circle cx="2.1" cy="2" r=".55" />
            <circle cx="5.1" cy="2" r=".55" />
            <circle cx="8.1" cy="2" r=".55" />
            <circle cx="11.1" cy="2" r=".55" />
            <circle cx="14.1" cy="2" r=".55" />
            <circle cx="3.6" cy="4.2" r=".55" />
            <circle cx="6.6" cy="4.2" r=".55" />
            <circle cx="9.6" cy="4.2" r=".55" />
            <circle cx="12.6" cy="4.2" r=".55" />
            <circle cx="2.1" cy="6.4" r=".55" />
            <circle cx="5.1" cy="6.4" r=".55" />
            <circle cx="8.1" cy="6.4" r=".55" />
            <circle cx="11.1" cy="6.4" r=".55" />
            <circle cx="14.1" cy="6.4" r=".55" />
            <circle cx="3.6" cy="8.6" r=".55" />
            <circle cx="6.6" cy="8.6" r=".55" />
            <circle cx="9.6" cy="8.6" r=".55" />
            <circle cx="12.6" cy="8.6" r=".55" />
            <circle cx="2.1" cy="10.8" r=".55" />
            <circle cx="5.1" cy="10.8" r=".55" />
            <circle cx="8.1" cy="10.8" r=".55" />
            <circle cx="11.1" cy="10.8" r=".55" />
            <circle cx="14.1" cy="10.8" r=".55" />
          </g>
        </>
      )}
    </svg>
  );
}
