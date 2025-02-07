/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.automatisme-online.fr/',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        // allow: '/',
        // Pages à ne pas indexer
        disallow: '/',
        // disallow: ['/panier', '/caisse'],
      },
    ],
  },
  // Exclure les pages sensibles du sitemap
  exclude: ['/panier', '/caisse'],
  changefreq: 'daily',
  priority: 0.7,
};
