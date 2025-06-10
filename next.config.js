const redirectsData = require('./src/redirects/redirects.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const optimizedRedirects = optimizeRedirects(redirectsData);

    return optimizedRedirects;
  },
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
  },
};

module.exports = nextConfig;

function optimizeRedirects(redirects) {
  const patterns = new Map();
  const specific = [];

  redirects.forEach((redirect) => {
    // Détecter les patterns répétitifs
    const pattern = detectPattern(redirect.source, redirect.destination);

    if (pattern) {
      if (!patterns.has(pattern.key)) {
        patterns.set(pattern.key, pattern.rule);
      }
    } else {
      specific.push(redirect);
    }
  });

  return [...Array.from(patterns.values()), ...specific];
}

function detectPattern(source, destination) {
  // Exemple : /old-product/123 -> /product/123
  const oldProductMatch = source.match(/^\/old-product\/(.+)$/);
  const newProductMatch = destination.match(/^\/product\/(.+)$/);

  if (oldProductMatch && newProductMatch) {
    return {
      key: 'old-product-pattern',
      rule: {
        source: '/old-product/:slug*',
        destination: '/product/:slug*',
        permanent: true,
      },
    };
  }

  return null;
}
