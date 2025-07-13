import { useQuery } from '@tanstack/react-query';
import { getCachedEventCount, CACHE_KEYS } from '@/lib/cache/events';
import { supabase } from '@/lib/supabase/client';

export const useEventCount = (includeArchive = false) => {
  const { 
    data: totalCount = 0, 
    isLoading: loading 
  } = useQuery({
    queryKey: [CACHE_KEYS.EVENT_COUNT, includeArchive],
    queryFn: async () => {
      if (!includeArchive) {
        // Use cached count for future events
        try {
          return await getCachedEventCount();
        } catch (error) {
          console.warn('Cache miss, using direct Supabase call:', error);
        }
      }
      
      // Fallback to direct Supabase call for archive or on cache miss
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let regularQuery = supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      
      if (!includeArchive) {
        regularQuery = regularQuery.gte('event_date', today.toISOString().split('T')[0]);
      }
      
      let longQuery = supabase
        .from('long_events')
        .select('*', { count: 'exact', head: true });
      
      if (!includeArchive) {
        longQuery = longQuery.gte('end_date', today.toISOString().split('T')[0]);
      }
      
      const [regularResult, longResult] = await Promise.all([
        regularQuery,
        longQuery
      ]);
      
      if (regularResult.error) throw regularResult.error;
      if (longResult.error) throw longResult.error;
      
      return (regularResult.count || 0) + (longResult.count || 0);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return { totalCount, loading };
};