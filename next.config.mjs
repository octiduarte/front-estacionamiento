import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  // reactStrictMode: true, // Example, keep if already there or needed
  async headers() {
    return [
      {
        // Apply these headers to the root and all locale paths
        // This regex matches /, /en, /es, /it, /en/, /es/, /it/
        source: '/:locale((en|es|it)?)?(/?)', 
        headers: [
          {
            key: 'Cache-Control',
            // This policy allows caching, requires revalidation, suitable for bf-cache
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
let configToExport = withNextIntl(nextConfig); // Changed variable name for clarity

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = createBundleAnalyzer({
    enabled: true,
  });
  configToExport = withBundleAnalyzer(configToExport);
}

export default configToExport;
