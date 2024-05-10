import Header from '@/app/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <div className="w-xs mt-20 flex flex-col items-center dark:text-gray-600">
        {children}
      </div>
    </div>
  )
}
