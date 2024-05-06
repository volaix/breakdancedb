import Header from "@/app/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="container text-gray-600 body-font relative w-full dark:text-gray-600 flex flex-col items-center w-xs">{children}</div>
    </div>
  );
}
