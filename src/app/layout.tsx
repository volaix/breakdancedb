import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RenderHeader from './_components/Header'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'breakdanceDB',
  description: 'Access the moves you already know',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <RenderHeader />
          <div className="body-font relative flex w-full flex-col items-center text-gray-600 dark:text-gray-600">
            {children}
          </div>
        </Providers>
      </body>
      <footer className="border-t-foreground/10 flex w-full justify-center border-t p-8 text-center text-xs">
        <p>
          Made by{' '}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Mark David Teo
          </a>
        </p>
      </footer>
    </html>
  )
}
