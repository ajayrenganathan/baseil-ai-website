/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://baseil.ai',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  exclude: [
    '/auth*',
    '/showcase',
    '/robot',
    '/problem',
    '/docs',
    '/icon*',
    '/apple-icon*',
    '/manifest*',
    '/*.svg',
    '/*.png',
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/'],
      },
    ],
    additionalSitemaps: [],
  },

  transform: async (config, path) => {
    // Homepage — highest priority
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    // Blog posts
    if (path.startsWith('/blog')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    // Pricing & Platform
    if (['/pricing', '/platform'].includes(path)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }

    // Default
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
