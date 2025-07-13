import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LongEvent {
  id: string;
  title: string;
  title_en?: string;
  description: string | null;
  description_en?: string | null;
  organizer: string;
  organizer_en?: string;
  start_date: string;
  end_date: string;
  event_time: string;
  location: string;
  location_en?: string;
  category: string;
  external_link: string | null;
  image_url: string | null;
  created_at: string;
}

interface UseLongEventsReturn {
  events: LongEvent[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useLongEvents = (pageSize = 20, showPast = false): UseLongEventsReturn => {
  const [events, setEvents] = useState<LongEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { toast } = useToast();

  const fetchEvents = useCallback(async (isLoadMore = false) => {
    console.log('fetchLongEvents called:', { isLoadMore, offset, currentEventsLength: events.length });
    
    try {
      const currentOffset = isLoadMore ? offset : 0;
      console.log('Using offset:', currentOffset);
      
      // Filter by date based on showPast parameter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let query = supabase
        .from('long_events')
        .select('*');
      
      if (showPast) {
        // For past events, check if end_date is before today
        query = query.lt('end_date', today.toISOString().split('T')[0])
          .order('start_date', { ascending: false })
          .order('event_time', { ascending: false });
      } else {
        // For current/future events, check if end_date is today or after
        query = query.gte('end_date', today.toISOString().split('T')[0])
          .order('start_date', { ascending: true })
          .order('event_time', { ascending: true });
      }
      
      const { data, error } = await query.range(currentOffset, currentOffset + pageSize - 1);
      console.log('Query result:', { dataLength: data?.length, error });

      if (error) throw error;

      if (isLoadMore) {
        setEvents(prev => {
          console.log('Before adding new events:', prev.length);
          const newEvents = ((data || []) as LongEvent[]).filter(newEvent => 
            !prev.some(existingEvent => existingEvent.id === newEvent.id)
          );
          console.log('New events to add:', newEvents.length);
          const updatedEvents = [...prev, ...newEvents];
          console.log('Total events after adding:', updatedEvents.length);
          return updatedEvents;
        });
        if (data && data.length > 0) {
          setOffset(currentOffset + pageSize);
        }
      } else {
        setEvents((data || []) as LongEvent[]);
        setOffset(data ? pageSize : 0);
      }

      const hasMoreData = (data || []).length === pageSize;
      console.log('Setting hasMore to:', hasMoreData);
      setHasMore(hasMoreData);
      
    } catch (error) {
      console.error('Error fetching long events:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli eventi lunghi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [pageSize, showPast, toast, offset]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    
    try {
      const currentOffset = offset + pageSize;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let query = supabase
        .from('long_events')
        .select('*');
      
      if (showPast) {
        query = query.lt('end_date', today.toISOString().split('T')[0])
          .order('end_date', { ascending: false });
      } else {
        query = query.gte('start_date', today.toISOString().split('T')[0])
          .order('start_date', { ascending: true });
      }
      
      const { data, error } = await query.range(currentOffset, currentOffset + pageSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        setEvents(prev => [...prev, ...(data as LongEvent[])]);
        setOffset(currentOffset);
        setHasMore(data.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more long events:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, offset, pageSize, showPast]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setOffset(0);
    setHasMore(true);
    await fetchEvents(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
};