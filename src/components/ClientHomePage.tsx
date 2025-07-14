'use client';

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/EventCard';
import { LongEventCard } from '@/components/LongEventCard';
import { EventFilters } from '@/components/EventFilters';
import { EventTypeSelector, EventType } from '@/components/EventTypeSelector';
import { LoadMore } from '@/components/LoadMore';
import { useEvents } from '@/hooks/useEvents';
import { useLongEvents } from '@/hooks/useLongEvents';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ClientHomePage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [eventType, setEventType] = useState<EventType>('regular');
  
  const { 
    events: regularEvents, 
    loading: regularLoading, 
    hasMore: regularHasMore, 
    loadMore: regularLoadMore, 
    refresh: regularRefresh 
  } = useEvents(20, false);
  
  const { 
    events: longEvents, 
    loading: longLoading, 
    hasMore: longHasMore, 
    loadMore: longLoadMore, 
    refresh: longRefresh 
  } = useLongEvents(20, false);

  const currentEvents = useMemo(() => {
    return eventType === 'regular' ? regularEvents : longEvents;
  }, [eventType, regularEvents, longEvents]);

  const currentLoading = useMemo(() => {
    return eventType === 'regular' ? regularLoading : longLoading;
  }, [eventType, regularLoading, longLoading]);

  const currentHasMore = useMemo(() => {
    return eventType === 'regular' ? regularHasMore : longHasMore;
  }, [eventType, regularHasMore, longHasMore]);

  const currentLoadMore = useMemo(() => {
    return eventType === 'regular' ? regularLoadMore : longLoadMore;
  }, [eventType, regularLoadMore, longLoadMore]);

  const filteredCurrentEvents = useMemo(() => {
    return currentEvents.filter(event => {
      const matchesDate = !selectedDate || 
        (eventType === 'regular' && 'event_date' in event && new Date(event.event_date).toDateString() === selectedDate.toDateString()) ||
        (eventType === 'long' && 'start_date' in event && (
          new Date(event.start_date) <= selectedDate && 
          new Date(event.end_date) >= selectedDate
        ));
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(event.category);

      return matchesDate && matchesCategory;
    });
  }, [currentEvents, selectedDate, selectedCategories, eventType]);

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedCategories([]);
  };

  const EventCardComponent = useMemo(() => {
    return eventType === 'regular' ? EventCard : LongEventCard;
  }, [eventType]);

  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-6 sm:px-8 lg:px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            {/* Event Type Selector */}
            <div className="flex justify-center pt-4">
              <EventTypeSelector 
                selectedType={eventType} 
                onTypeChange={setEventType} 
              />
            </div>
          </div>

          <EventFilters 
            selectedDate={selectedDate}
            selectedCategories={selectedCategories}
            onDateChange={setSelectedDate}
            onCategoriesChange={setSelectedCategories}
            onClearFilters={handleClearFilters}
          />

          <LoadMore
            hasMore={currentHasMore}
            loading={currentLoading}
            onLoadMore={currentLoadMore}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-6">
              {filteredCurrentEvents.map((event) => (
                <EventCardComponent
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
          </LoadMore>
          
          {filteredCurrentEvents.length === 0 && !currentLoading && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {t('events.noEventsFound')}
              </h3>
              <p className="text-muted-foreground">
                {t('events.modifyFilters')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}