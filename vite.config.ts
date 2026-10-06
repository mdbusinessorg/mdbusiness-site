import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_SITE_URL = 'https://mdbusiness-v2.netlify.app'

/**
 * Injects the configured site URL into index.html and generates
 * robots.txt + sitemap.xml at build time, so the project carries
 * no hard-coded domain and is ready for any new domain via env.
 */
function siteMeta(siteUrl: string): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      return html.replaceAll('%VITE_SITE_URL%', siteUrl)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '')

  return {
    // relative base — the build runs from any path or domain
    base: './',
    plugins: [react(), tailwindcss(), siteMeta(siteUrl)],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('gsap') || id.includes('lenis') || id.includes('framer-motion')) return 'motion'
              return 'vendor'
            }
          },
        },
      },
    },
  }
})
