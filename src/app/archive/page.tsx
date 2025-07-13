import { Suspense } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCachedEvents } from '@/lib/cache/events';
import { ClientArchivePage } from '@/components/ClientArchivePage';

// Server component for SEO and initial load performance
export default async function Archive() {
  // Fetch initial archive events on server
  const initialEvents = await getCachedEvents(true, 20, 0); // true for past events

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="inline-block mb-6">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna agli Eventi Attuali
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Archivio Eventi
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Rivivi i momenti speciali e gli eventi che hanno animato Gambarie
          </p>
        </div>
      </section>

      {/* Main Content */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <ClientArchivePage initialEvents={initialEvents} />
      </Suspense>
      
      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export const metadata = {
  title: 'Archivio Eventi | Gambarie Summer Events',
  description: 'Esplora l\'archivio degli eventi passati di Gambarie d\'Aspromonte. Rivivi i momenti speciali e le attività che hanno animato la nostra montagna.',
  keywords: 'Gambarie, archivio eventi, eventi passati, Aspromonte, Calabria, storia',
};