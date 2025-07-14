import { CACHE_TAGS } from './events';

export async function revalidateEventCache(authToken: string, tag?: string) {
  try {
    const url = new URL('/api/revalidate', window.location.origin);
    
    if (tag) {
      url.searchParams.set('tag', tag);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Revalidation failed:', error);
      return false;
    }

    const result = await response.json();
    console.log('Cache revalidated:', result);
    return true;
  } catch (error) {
    console.error('Revalidation error:', error);
    return false;
  }
}

// Helper functions for common revalidation scenarios
export async function revalidateAllEvents(authToken: string) {
  return await revalidateEventCache(authToken);
}

export async function revalidateRegularEvents(authToken: string) {
  return await revalidateEventCache(authToken, CACHE_TAGS.EVENTS);
}

export async function revalidateLongEvents(authToken: string) {
  return await revalidateEventCache(authToken, CACHE_TAGS.LONG_EVENTS);
}