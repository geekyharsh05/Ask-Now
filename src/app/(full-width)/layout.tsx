import { HeroHeader } from "@/components/landing/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeroHeader />
      {children}
    </>
  );
}
