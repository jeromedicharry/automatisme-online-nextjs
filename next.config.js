/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin-preprod.automatisme-online.fr',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
    ],
  },
  env: {
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY,
    CF7_API_URL: process.env.CF7_API_URL,
    ADYEN_CLIENT_KEY: process.env.ADYEN_CLIENT_KEY,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    MAINTENANCE_PASSWORD: process.env.MAINTENANCE_PASSWORD,
  },
};

module.exports = nextConfig;
