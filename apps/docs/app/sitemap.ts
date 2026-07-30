import { MetadataRoute } from 'next';
import { generateStaticParams } from './docs/[[...slug]]/page';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nexoreui.vercel.app';
  
  const staticParams = await generateStaticParams();
  
  const allUrls = new Map<string, MetadataRoute.Sitemap[number]>();
  
  // Base URL
  allUrls.set(baseUrl, {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Docs URLs
  staticParams.forEach((param) => {
    // If slug is empty array, join returns empty string
    const slugPath = (param.slug || []).join('/');
    const urlPath = slugPath ? `/docs/${slugPath}` : '/docs';
    const fullUrl = `${baseUrl}${urlPath}`;
    
    // Set higher priority for base docs pages
    let priority = 0.8;
    if (!slugPath || slugPath === 'installation') {
      priority = 0.9;
    }
    
    if (!allUrls.has(fullUrl)) {
      allUrls.set(fullUrl, {
        url: fullUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority,
      });
    }
  });

  // Nexore Make
  const makeUrl = `${baseUrl}/nexoremake`;
  if (!allUrls.has(makeUrl)) {
    allUrls.set(makeUrl, {
      url: makeUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Privacy Policy
  const privacyUrl = `${baseUrl}/privacy`;
  if (!allUrls.has(privacyUrl)) {
    allUrls.set(privacyUrl, {
      url: privacyUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  }

  return Array.from(allUrls.values());
}
