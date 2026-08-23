import { MetadataRoute } from 'next';
import { sidebarGroups } from './config/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nexoreui.vercel.app';
  const allUrls = new Map<string, MetadataRoute.Sitemap[number]>();
  
  // Base URL
  allUrls.set(baseUrl, {
    url: baseUrl,
    lastModified: new Date('2026-08-09'),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Create Project Studio
  const createUrl = `${baseUrl}/create`;
  allUrls.set(createUrl, {
    url: createUrl,
    lastModified: new Date('2026-08-09'),
    changeFrequency: 'weekly',
    priority: 0.95,
  });

  // Base Docs URL
  allUrls.set(`${baseUrl}/docs`, {
    url: `${baseUrl}/docs`,
    lastModified: new Date('2026-08-09'),
    changeFrequency: 'monthly',
    priority: 0.9,
  });

  // Components Overview
  const overviewUrl = `${baseUrl}/docs/components`;
  allUrls.set(overviewUrl, {
    url: overviewUrl,
    lastModified: new Date('2026-08-09'),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // Docs URLs
  sidebarGroups.forEach(group => {
    group.items.forEach(item => {
      let slugPath = '';
      if (item.id === 'installation') {
        slugPath = 'installation';
      } else if (item.id === 'icons') {
        slugPath = 'icons';
      } else {
        slugPath = `components/${item.id}`;
      }
      
      const fullUrl = `${baseUrl}/docs/${slugPath}`;
      let priority = 0.8;
      if (slugPath === 'installation') {
        priority = 0.9;
      }
      
      if (!allUrls.has(fullUrl)) {
        allUrls.set(fullUrl, {
          url: fullUrl,
          lastModified: new Date('2026-08-09'),
          changeFrequency: 'monthly',
          priority,
        });
      }
    });
  });

  // Nexore Make
  const makeUrl = `${baseUrl}/nexoremake`;
  if (!allUrls.has(makeUrl)) {
    allUrls.set(makeUrl, {
      url: makeUrl,
      lastModified: new Date('2026-08-09'),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Privacy Policy
  const privacyUrl = `${baseUrl}/privacy`;
  if (!allUrls.has(privacyUrl)) {
    allUrls.set(privacyUrl, {
      url: privacyUrl,
      lastModified: new Date('2026-08-09'),
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  }

  return Array.from(allUrls.values());
}
