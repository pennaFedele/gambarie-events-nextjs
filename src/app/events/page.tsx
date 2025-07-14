import { Suspense } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { getCachedEvents, getCachedEventCount } from '@/lib/cache/events';
import { Calendar } from 'lucide-react';

// Generate metadata for SEO
export const metadata = {
  title: 'Eventi in Programma | Gambarie Summer Events',
  description: 'Tutti gli eventi in programma a Gambarie d\'Aspromonte. Concerti, festival, sagre e attività per tutta la famiglia nella natura calabrese.',
  keywords: 'Gambarie eventi, programma eventi, concerti Aspromonte, festival Calabria, eventi montagna',
  openGraph: {
    title: 'Eventi in Programma - Gambarie',
    description: 'Scopri tutti gli eventi in programma a Gambarie d\'Aspromonte',
    type: 'website',
  },
};

// Server component for SEO and initial load performance
export default async function EventsPage() {
  // Fetch initial data on server
  const [initialEvents, totalCount] = await Promise.all([
    getCachedEvents(false, 20, 0),
    getCachedEventCount(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/gambarie-hero.jpg"
          alt="Gambarie d'Aspromonte - Eventi"
          fill
          sizes="100vw"
          className="object-cover"
          quality={85}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 sm:px-8 md:px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Eventi in Programma
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-lg font-semibold">
            <Calendar className="w-5 h-5" />
            <span>{totalCount} eventi programmati</span>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-6 sm:px-8 lg:px-4">
          <div className="max-w-7xl mx-auto space-y-8">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-6">
                {initialEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={{
                      ...event,
                      description: event.description || '',
                      description_en: event.description_en || undefined,
                      title_en: event.title_en || undefined,
                      organizer_en: event.organizer_en || undefined,
                      location_en: event.location_en || undefined,
                      external_link: event.external_link || undefined,
                      image_url: event.image_url || undefined,
                      date: event.event_date,
                      time: event.event_time
                    }}
                  />
                ))}
              </div>
            </Suspense>
            
            {initialEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Nessun evento trovato
                </h3>
                <p className="text-muted-foreground">
                  Non ci sono eventi programmati al momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}