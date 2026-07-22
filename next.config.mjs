/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@clerk/nextjs",
      "@clerk/ui",
      "@supabase/supabase-js",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
    ],
  },
};

export default nextConfig;
