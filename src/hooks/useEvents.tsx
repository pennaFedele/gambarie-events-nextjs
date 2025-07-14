import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCachedEvents, CACHE_KEYS, CACHE_TAGS } from '@/lib/cache/events';
import { getTodayInRomeTimezone } from '@/lib/utils/date';

interface Event {
  id: string;
  title: string;
  title_en?: string;
  description: string | null;
  description_en?: string | null;
  organizer: string;
  organizer_en?: string;
  event_date: string;
  event_time: string;
  location: string;
  location_en?: string;
  category: string;
  external_link: string | null;
  image_url: string | null;
  created_at: string;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useEvents = (pageSize = 20, showPast = false): UseEventsReturn => {
  const [offset, setOffset] = useState(0);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query with stale-while-revalidate pattern
  const {
    data: newEvents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [CACHE_KEYS.EVENTS, showPast, offset, pageSize],
    queryFn: async () => {
      // Try server-side cache first, fallback to direct Supabase call
      try {
        return await getCachedEvents(showPast, pageSize, offset);
      } catch (error) {
        console.warn('Cache miss, using direct Supabase call:', error);
        
        const todayStr = getTodayInRomeTimezone();
        
        let query = supabase.from('events').select('*');
        
        if (showPast) {
          query = query
            .lt('event_date', todayStr)
            .order('event_date', { ascending: false })
            .order('event_time', { ascending: false });
        } else {
          query = query
            .gte('event_date', todayStr)
            .order('event_date', { ascending: true })
            .order('event_time', { ascending: true });
        }
        
        const { data, error: supabaseError } = await query.range(offset, offset + pageSize - 1);
        
        if (supabaseError) throw supabaseError;
        return data || [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli eventi.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Accumulate events for pagination
  useEffect(() => {
    if (offset === 0) {
      setAllEvents(newEvents as Event[]);
    } else {
      setAllEvents(prev => {
        const uniqueNewEvents = (newEvents as Event[]).filter(
          newEvent => !prev.some(existingEvent => existingEvent.id === newEvent.id)
        );
        return [...prev, ...uniqueNewEvents];
      });
    }
  }, [newEvents, offset]);

  const hasMoreEvents = newEvents.length === pageSize;
  
  const loadMore = useCallback(async () => {
    if (!hasMoreEvents || isLoading) return;
    setOffset(prev => prev + pageSize);
  }, [hasMoreEvents, pageSize, isLoading]);

  const refresh = useCallback(async () => {
    setOffset(0);
    setAllEvents([]);
    // Invalidate cache and refetch
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENTS] });
    await refetch();
  }, [queryClient, refetch]);

  return {
    events: allEvents,
    loading: isLoading,
    hasMore: hasMoreEvents,
    loadMore,
    refresh,
  };
};