import { Suspense } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCachedActivities } from '@/lib/cache/activities';
import { ClientActivitiesPage } from '@/components/ClientActivitiesPage';

// Server component for SEO and initial load performance
export default async function Activities() {
  // Fetch activities data on server
  const activities = await getCachedActivities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Attività e Servizi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scopri tutte le attività disponibili nella zona di Gambarie
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-white animate-pulse rounded-lg" />
            ))}
          </div>
        }>
          <ClientActivitiesPage activities={activities} />
        </Suspense>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nessuna attività trovata
            </h3>
            <p className="text-gray-500">
              Le attività verranno pubblicate presto.
            </p>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Informazioni e Prenotazioni
            </h2>
            <p className="text-gray-600 mb-6">
              Per maggiori informazioni e prenotazioni contatta direttamente i fornitori di servizi tramite i link forniti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Gambarie d'Aspromonte - Reggio Calabria</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export const metadata = {
  title: 'Attività e Servizi | Gambarie Summer Events',
  description: 'Scopri tutte le attività disponibili nella zona di Gambarie d\'Aspromonte: sport, avventura, natura, benessere e molto altro.',
  keywords: 'Gambarie, attività, sport, natura, avventura, Aspromonte, Calabria',
};