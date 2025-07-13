'use client'

import { useEffect } from "react";
import { I18nProvider } from "@/lib/i18n/provider";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize analytics if configured
    if (process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
      const script = document.createElement('script');
      script.src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
      script.setAttribute('data-website-id', process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <I18nProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              {children}
            </AuthProvider>
          </I18nProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}