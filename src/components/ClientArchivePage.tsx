'use client';

import { useState, useMemo } from "react";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { LoadMore } from "@/components/LoadMore";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { isSameDay } from "date-fns";
import type { Event } from '@/lib/cache/events';

interface ClientArchivePageProps {
  initialEvents: Event[];
}

export function ClientArchivePage({ initialEvents }: ClientArchivePageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Use client-side hooks for additional pagination
  const { events, loading, hasMore, loadMore } = useEvents(20, true); // true for archive

  // Combine initial server events with client-side loaded events
  const allEvents = useMemo(() => {
    // Filter out duplicates based on ID
    const eventIds = new Set(initialEvents.map(e => e.id));
    const additionalEvents = events.filter(e => !eventIds.has(e.id));
    return [...initialEvents, ...additionalEvents];
  }, [initialEvents, events]);

  const eventsToShow = useMemo(() => {
    let filteredEvents = allEvents;

    if (selectedDate) {
      filteredEvents = filteredEvents.filter(event => 
        isSameDay(new Date(event.event_date), selectedDate)
      );
    }

    if (selectedCategories.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        selectedCategories.includes(event.category)
      );
    }

    return filteredEvents;
  }, [allEvents, selectedDate, selectedCategories]);

  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedCategories([]);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <EventFilters
            selectedDate={selectedDate}
            selectedCategories={selectedCategories}
            onDateChange={setSelectedDate}
            onCategoriesChange={setSelectedCategories}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Events Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Eventi Passati
              </h2>
              <p className="text-muted-foreground">
                {eventsToShow.length} {eventsToShow.length === 1 ? "evento trovato" : "eventi trovati"}
              </p>
            </div>
          </div>

          {eventsToShow.length > 0 ? (
            <LoadMore
              hasMore={hasMore}
              loading={loading}
              onLoadMore={loadMore}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventsToShow.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={{
                      ...event,
                      date: event.event_date,
                      time: event.event_time,
                      description: event.description || '',
                      description_en: event.description_en || undefined,
                      external_link: event.external_link || undefined,
                      image_url: event.image_url || undefined,
                      location: event.location || '',
                      location_en: event.location_en || undefined,
                      organizer_en: event.organizer_en || undefined,
                      title_en: event.title_en || undefined
                    }}
                    variant="past"
                  />
                ))}
              </div>
            </LoadMore>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nessun evento trovato</h3>
              <p className="text-muted-foreground mb-4">
                {selectedDate || selectedCategories.length > 0 
                  ? "Prova a modificare i filtri per trovare eventi."
                  : "Non ci sono eventi nell'archivio al momento."
                }
              </p>
              {(selectedDate || selectedCategories.length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  Pulisci filtri
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}