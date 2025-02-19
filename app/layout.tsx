import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/footer'
import { gotham, lora } from './fonts'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${gotham.variable} ${lora.variable} antialiased`}>
      <body className="font-gotham">
        {children}
        <Footer />
      </body>
    </html>
  );
}
