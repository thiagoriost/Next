import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
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
  const locale = DEFAULT_LOCALE;

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
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
