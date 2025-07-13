import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase/client';

export interface Activity {
  id: string;
  title_it: string;
  title_en: string;
  description_it?: string;
  description_en?: string;
  type_it: string;
  type_en: string;
  info_links?: Array<{ label: string; url: string }>;
  maps_links?: Array<{ label: string; url: string }>;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Cache active activities
export const getCachedActivities = unstable_cache(
  async (): Promise<Activity[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []) as any;
  },
  ['activities'],
  {
    tags: ['activities-data'],
    revalidate: 3600, // 1 hour
  }
);