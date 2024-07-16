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
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} flex min-h-screen flex-col justify-between`}
        >
          <Providers>
            <RenderHeader />
            <div className="body-font relative mb-10 flex w-full flex-col items-center text-gray-600 dark:text-gray-600">
              {children}
            </div>
            <footer className="border-t-foreground/10 flex max-h-16 w-full justify-center border-t p-4 text-center text-xs">
              <p>
                By{' '}
                <a
                  href="https://github.com/volaix"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Mark
                </a>
              </p>
            </footer>
          </Providers>
        </body>
      </html>
    </>
  )
}
