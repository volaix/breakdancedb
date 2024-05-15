import RenderHeader from '@/app/_components/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <RenderHeader />
      <div className="w-xs mt-20 flex flex-col items-center dark:text-gray-600">
        {children}
      </div>
    </div>
  )
}
