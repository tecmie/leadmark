import type { Metadata } from "next";
import localFont from "next/font/local";
import { Ubuntu_Sans } from "next/font/google";
import "./globals.css";
import Providers from '@/utils/provider';

const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const ubuntu = Ubuntu_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ubuntu",
});


export const metadata: Metadata = {
  title: "Leadmark - Email-First Collaboration | Postmark Challenge",
  description: "Hackathon submission for Postmark Challenge: Inbox Innovators. Email-first collaboration platform powered by Postmark's Inbound Email Processing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
