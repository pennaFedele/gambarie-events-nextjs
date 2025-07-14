import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['vbklkpfskbjmipbcsteb.supabase.co'], // Your Supabase domain
    unoptimized: false, // Enable image optimization for better performance
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
