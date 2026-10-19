import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "@/lib/i18n";
import { I18nProvider } from "@/components/providers/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Properties | LuxeEstate",
  description:
    "Curated luxury real estate properties for the discerning eye. Discover exclusive houses, apartments, penthouses, and villas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale: Locale = DEFAULT_LOCALE;
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieVal && (SUPPORTED_LOCALES as readonly string[]).includes(cookieVal)) {
      locale = cookieVal as Locale;
    }
  } catch {
    // Fallback if rendered outside request context
  }

  return (
    <html lang={locale} className="light" style={{ colorScheme: 'light' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#EEF6F6] text-[#19322F] antialiased selection:bg-[#006655] selection:text-white">
        <I18nProvider initialLocale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
