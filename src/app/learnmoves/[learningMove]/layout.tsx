import Header from "@/app/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="dark:text-gray-600 flex flex-col items-center w-xs">{children}</div>
    </div>
  );
}
