import React from 'react';
import { Metadata } from 'next';
import { DemoPageClient } from './DemoPageClient';

export const metadata: Metadata = {
  title: 'Interactive Product Tour & Video Showcase — NexoreUI',
  description:
    'Watch the full 2-minute product tour of NexoreUI: explore 50+ aesthetic React components, AI layout generation with Nexore Make, and 1-click multi-framework exports.',
  keywords: [
    'nexoreui demo',
    'nexoreui product tour',
    'react ui components demo',
    'shadcn demo showcase',
    'nexore make ai demo',
    'interactive ui showcase',
    'video tour walkthrough',
  ],
  alternates: {
    canonical: '/demo',
  },
  openGraph: {
    title: 'Interactive Product Tour & Video Showcase — NexoreUI',
    description:
      'Watch the full 2-minute product tour of NexoreUI: explore 50+ aesthetic React components, AI layout generation with Nexore Make, and 1-click multi-framework exports.',
    url: 'https://www.nexoreui.com/demo',
    type: 'video.other',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Product Tour & Video Showcase — NexoreUI',
    description:
      'Watch the full 2-minute product tour of NexoreUI: explore 50+ aesthetic React components, AI layout generation with Nexore Make, and 1-click multi-framework exports.',
  },
};

export default function DemoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'NexoreUI Interactive Product Tour',
    description:
      'A 2-minute cinematic walkthrough of NexoreUI components, interactive studio configurator, and Nexore Make AI generation.',
    thumbnailUrl: 'https://www.nexoreui.com/og-image.png',
    uploadDate: '2026-09-11T21:00:00+05:00',
    contentUrl: 'https://www.nexoreui.com/videos/demo.mp4',
    embedUrl: 'https://www.nexoreui.com/demo',
    duration: 'PT2M7S',
    publisher: {
      '@type': 'Organization',
      name: 'NexoreUI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.nexoreui.com/nexore-avatar.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoPageClient />
    </>
  );
}
