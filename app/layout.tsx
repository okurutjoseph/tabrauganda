import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import Footer from '@/components/footer'
import { gotham, lora } from './fonts'
import { Toaster } from 'sonner'
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Putting God's Love in Action Amongest Communities - Tabra",
  description: "Tabra Uganda is dedicated to putting God's love in action amongst communities through various initiatives and programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${gotham.variable} ${lora.variable} antialiased`}>
      <body className="font-gotham">
        <Providers>
          {children}
          <Footer />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
