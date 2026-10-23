import React from 'react';
import { Metadata } from 'next';
import SharedClientPage from './SharedClientPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const label = id === 'shared' ? 'Shared Component' : `Component ${id}`;

  return {
    title: `Nexore Make - ${label}`,
    description:
      'Inspect this UI component built with Nexore Make. View the live interactive preview and export React, Vue, or HTML code.',
    openGraph: {
      title: `Nexore Make - ${label}`,
      description:
        'Inspect this UI component built with Nexore Make. View the live preview and export React, Vue, or HTML code.',
      url: `https://nexoreui.site/nexoremake/${id}`,
      siteName: 'NexoreUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nexore Make - ${label}`,
      description: 'Inspect this UI component built with Nexore Make.',
    },
  };
}

export default function Page() {
  return <SharedClientPage />;
}
