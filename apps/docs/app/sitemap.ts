import { MetadataRoute } from 'next';
import { generateStaticParams } from './docs/[[...slug]]/page';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nexoreui.vercel.app';
  
  const staticParams = await generateStaticParams();
  
  const docsUrls = staticParams.map((param) => {
    const slugPath = param.slug.join('/');
    const urlPath = slugPath ? `/docs/${slugPath}` : '/docs';
    
    // Set higher priority for installation/icons base docs pages
    let priority = 0.8;
    if (!slugPath || slugPath === 'installation') {
      priority = 0.9;
    }
    
    return {
      url: `${baseUrl}${urlPath}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...docsUrls,
  ];
}
