import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase/client';

export interface Event {
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

export interface LongEvent {
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

// Cache keys
export const CACHE_KEYS = {
  EVENTS: 'events',
  LONG_EVENTS: 'long_events',
  EVENT_COUNT: 'event_count',
} as const;

// Cache tags for revalidation
export const CACHE_TAGS = {
  EVENTS: 'events-data',
  LONG_EVENTS: 'long-events-data',
  ALL_EVENTS: 'all-events-data',
} as const;

// Cache regular events
export const getCachedEvents = unstable_cache(
  async (showPast = false, limit = 20, offset = 0): Promise<Event[]> => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let query = supabase
      .from('events')
      .select('*');
    
    if (showPast) {
      // Past events: only events before today (not including today)
      query = query
        .lt('event_date', todayStr)
        .order('event_date', { ascending: false })
        .order('event_time', { ascending: false });
    } else {
      // Current/future events: events from today onwards
      query = query
        .gte('event_date', todayStr)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });
    }
    
    const { data, error } = await query.range(offset, offset + limit - 1);
    
    if (error) throw error;
    return (data || []) as any;
  },
  [CACHE_KEYS.EVENTS],
  {
    tags: [CACHE_TAGS.EVENTS, CACHE_TAGS.ALL_EVENTS],
    revalidate: 3600, // 1 hour
  }
);

// Cache long events
export const getCachedLongEvents = unstable_cache(
  async (showPast = false, limit = 20, offset = 0): Promise<LongEvent[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let query = supabase
      .from('long_events')
      .select('*');
    
    if (showPast) {
      query = query
        .lt('end_date', today.toISOString().split('T')[0])
        .order('end_date', { ascending: false });
    } else {
      query = query
        .gte('start_date', today.toISOString().split('T')[0])
        .order('start_date', { ascending: true });
    }
    
    const { data, error } = await query.range(offset, offset + limit - 1);
    
    if (error) throw error;
    return (data || []) as any;
  },
  [CACHE_KEYS.LONG_EVENTS],
  {
    tags: [CACHE_TAGS.LONG_EVENTS, CACHE_TAGS.ALL_EVENTS],
    revalidate: 3600, // 1 hour
  }
);

// Cache event count
export const getCachedEventCount = unstable_cache(
  async (): Promise<number> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count regular events
    const { count: regularCount, error: regularError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('event_date', today.toISOString().split('T')[0]);
    
    if (regularError) throw regularError;
    
    // Count long events
    const { count: longCount, error: longError } = await supabase
      .from('long_events')
      .select('*', { count: 'exact', head: true })
      .gte('start_date', today.toISOString().split('T')[0]);
    
    if (longError) throw longError;
    
    return (regularCount || 0) + (longCount || 0);
  },
  [CACHE_KEYS.EVENT_COUNT],
  {
    tags: [CACHE_TAGS.ALL_EVENTS],
    revalidate: 3600, // 1 hour
  }
);

// Cache app settings
export const getCachedAppSettings = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .order('setting_key');
    
    if (error) throw error;
    return (data || []) as any;
  },
  ['app-settings'],
  {
    tags: ['app-settings'],
    revalidate: 300, // 5 minutes - more frequent for maintenance mode
  }
);