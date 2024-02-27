import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "RigoRiosH' homePage",
  description: 'Generated by love',
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h2>Hello again</h2>
        {children}
      </body>
    </html>
  )
}


// video 15, metatags



