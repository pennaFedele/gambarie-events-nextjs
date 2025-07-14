import { Suspense } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCachedEventCount } from '@/lib/cache/events';
import { Calendar } from 'lucide-react';
import { ClientHomePage } from '@/components/ClientHomePage';

// Generate metadata for SEO
export const metadata = {
  title: 'Gambarie Summer Events | Eventi Estivi in Aspromonte',
  description: 'Scopri gli eventi estivi di Gambarie d\'Aspromonte. Musica, cultura, gastronomia e natura nel cuore della Calabria. La tua estate in montagna ti aspetta!',
  keywords: 'Gambarie, eventi estivi, Aspromonte, Calabria, montagna, eventi, musica, cultura, gastronomia',
  openGraph: {
    title: 'Gambarie Summer Events',
    description: 'Eventi estivi in Aspromonte - Scopri la magia di Gambarie',
    type: 'website',
    locale: 'it_IT',
  },
};

// Server component for initial load and SEO
export default async function Home() {
  // Fetch initial data on server for faster perceived performance
  const totalCount = await getCachedEventCount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section with Server-Side Rendered Data */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/hero.png"
          alt="Gambarie d'Aspromonte - Panorama montano"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={85}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 sm:px-8 md:px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Eventi Estivi Gambarie
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Scopri gli eventi e le attività che animano la nostra montagna
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-lg font-semibold">
            <Calendar className="w-5 h-5" />
            <span>{totalCount} eventi programmati</span>
          </div>
        </div>
      </section>

      {/* Interactive Client Section */}
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <ClientHomePage />
      </Suspense>

      <Footer />
    </div>
  );
}