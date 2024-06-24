import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RenderHeader from './_components/Header'
import './globals.css'

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
        <RenderHeader />
        <div className="body-font relative flex w-full flex-col items-center text-gray-600 dark:text-gray-600">
          {children}
        </div>
      </body>
    </html>
  )
}
