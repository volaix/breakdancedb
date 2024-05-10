import RenderHeader from '@/app/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <RenderHeader />
      <div className="body-font w-xs container relative flex w-full flex-col items-center text-gray-600 dark:text-gray-600">
        {children}
      </div>
    </div>
  )
}
