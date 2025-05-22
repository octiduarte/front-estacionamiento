const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  // openAnalyzer: false, // Keep it off for CI environments
});

const nextConfig = {
  // Add any other necessary Next.js config options here
  // For example: reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin();

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
