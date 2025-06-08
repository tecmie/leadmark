import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/utils/provider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
