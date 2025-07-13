import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['vbklkpfskbjmipbcsteb.supabase.co'], // Your Supabase domain
    unoptimized: true, // For development, you can remove this in production
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
