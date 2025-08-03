import type { MetadataRoute } from 'next'
import { getCachedEvents } from '@/lib/cache/events'
import { getCachedActivities } from '@/lib/cache/activities'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gambarie.f-penna.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Dynamic pages from events
    const events = await getCachedEvents()
    const eventPages = events.map(event => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(event.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Dynamic pages from activities
    const activities = await getCachedActivities()
    const activityPages = activities.map(activity => ({
      url: `${baseUrl}/activities/${activity.id}`,
      lastModified: new Date(activity.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...eventPages, ...activityPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if dynamic content fails
    return staticPages
  }
}