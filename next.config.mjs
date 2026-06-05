/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Performance: tree-shake heavy barrel-exported packages so each route
  // only ships the icons/utilities it actually uses. This is the single
  // biggest navigation-speed win — the app has 152 routes that each
  // import from these large barrels.
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      '@radix-ui/react-icons',
      // shadcn/ui re-exports — also barrels.
      '@/components/ui',
    ],
  },
}

export default nextConfig
