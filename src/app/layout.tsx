import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gambarie Summer Events",
  description: "A modern React application for managing events and activities in Gambarie, featuring multilingual support",
  keywords: ["react", "typescript", "nextjs", "supabase", "events", "multilingual", "tailwind", "gambarie"],
  authors: [{ name: "Fedele Penna" }],
  openGraph: {
    title: "Gambarie Summer Events",
    description: "Discover summer events and activities in Gambarie",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
