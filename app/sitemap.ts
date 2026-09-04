import type { MetadataRoute } from 'next'
const paths=['','/about','/shop','/sell','/rent','/events','/nomads','/community','/membership','/newsletter','/drop','/gear-conditions','/repair','/privacy','/terms']
export default function sitemap():MetadataRoute.Sitemap{return paths.map(path=>({url:`https://tideandtrail.ca${path}`,lastModified:new Date(),changeFrequency:path==='/shop'?'daily':'weekly',priority:path===''?1:.7}))}
