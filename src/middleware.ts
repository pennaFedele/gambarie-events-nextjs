import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // IMPORTANT: This refreshes the session and is required for server components
  // to have access to the session
  const { data: { user } } = await supabase.auth.getUser();

  // Skip maintenance check for authenticated users - they can always access
  if (user) {
    return response;
  }

  // For anonymous users, check maintenance mode
  const { data: appSettings } = await supabase
    .from('app_settings')
    .select('setting_key, setting_value')
    .in('setting_key', ['app_public_visible', 'maintenance_message', 'maintenance_admin_button_text']);

  const isPublic = appSettings?.find(s => s.setting_key === 'app_public_visible')?.setting_value === true;

  // Allow access to auth and maintenance routes even for anonymous users
  const isAuthRoute = request.nextUrl.pathname === '/auth';
  const isMaintenanceRoute = request.nextUrl.pathname === '/maintenance';

  // If site is not public and user is anonymous, redirect to maintenance
  if (!isPublic && !isAuthRoute && !isMaintenanceRoute) {
    const maintenanceUrl = new URL('/maintenance', request.url);
    
    // Pass maintenance settings as search params
    const maintenanceMessage = appSettings?.find(s => s.setting_key === 'maintenance_message')?.setting_value || 'Stiamo lavorando per Voi. App in aggiornamento';
    const adminButtonText = appSettings?.find(s => s.setting_key === 'maintenance_admin_button_text')?.setting_value || 'Sei admin? Accedi';
    
    maintenanceUrl.searchParams.set('message', String(maintenanceMessage));
    maintenanceUrl.searchParams.set('adminButtonText', String(adminButtonText));
    
    return NextResponse.redirect(maintenanceUrl);
  }

  // If site is public and user tries to access maintenance page, redirect to home
  if (isPublic && isMaintenanceRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};