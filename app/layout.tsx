import type { Metadata } from "next";
import "@/app/globals.css";
import { TanstackProvider } from "@/components/tanstack/tanstack-provider";

export const metadata: Metadata = {
  title: "Green Parking",
  description: "A system for managing parking reservations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark antialiased`}>
      <body>
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
