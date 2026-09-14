import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function generateSitemap() {
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const baseUrl = 'https://stridewear.com'
  const today = new Date().toISOString().split('T')[0]

  const productUrls = (products ?? [])
    .map(
      (p) => `  <url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${p.created_at?.split('T')[0] ?? today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('\n')

  const categoryUrls = (categories ?? [])
    .map(
      (c) => `  <url>
    <loc>${baseUrl}/products?category=${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${productUrls}
${categoryUrls}
</urlset>`

  const outputPath = resolve(__dirname, '../public/sitemap.xml')
  writeFileSync(outputPath, xml, 'utf-8')
  console.log(`Sitemap generated at ${outputPath}`)
}

generateSitemap().catch(console.error)
