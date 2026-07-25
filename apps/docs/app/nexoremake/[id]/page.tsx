import React from 'react';
import { Metadata } from 'next';
import SharedClientPage from './SharedClientPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Nexore Make Component - ${id}`,
    description: 'Check out this beautiful UI component built visually with Nexore Make. Open the link to view the component and get its React, Vue, HTML code.',
    openGraph: {
      title: `Nexore Make Component - ${id}`,
      description: 'Check out this UI component built visually with Nexore Make. Open to view the live preview and generate React, Vue, or HTML code.',
      url: `https://nexoreui.vercel.app/nexoremake/${id}`,
      siteName: 'NexoreUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nexore Make Component - ${id}`,
      description: 'Check out this beautiful UI component built with Nexore Make.',
    },
  };
}

export default function Page() {
  return <SharedClientPage />;
}
