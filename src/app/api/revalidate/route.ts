import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { CACHE_TAGS } from '@/lib/cache/events';

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');

    // Check if this is an external call with secret (e.g., webhook)
    if (secret) {
      const validSecret = process.env.REVALIDATION_SECRET;
      if (secret !== validSecret) {
        return NextResponse.json(
          { error: 'Invalid secret' },
          { status: 401 }
        );
      }
      // External call with valid secret - skip auth check
    } else {
      // Internal call from admin panel - verify admin authentication
      const authorization = request.headers.get('authorization');
      if (!authorization) {
      return NextResponse.json(
        { error: 'Missing authorization' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // TODO: Implement proper admin check when profiles table is available
    // For now, allow any authenticated user to revalidate cache
    console.log('Revalidation requested by user:', user.id);
    }

    // Revalidate specific tag or all event-related caches
    if (tag && Object.values(CACHE_TAGS).includes(tag as any)) {
      revalidateTag(tag);
    } else {
      // Revalidate all event-related caches
      revalidateTag(CACHE_TAGS.EVENTS);
      revalidateTag(CACHE_TAGS.LONG_EVENTS);
      revalidateTag(CACHE_TAGS.ALL_EVENTS);
      revalidateTag('app-settings');
    }

    return NextResponse.json({ 
      revalidated: true, 
      tag: tag || 'all',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}