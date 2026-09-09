import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEMPLATES } from "../../data/templates";
import { TemplateDetailPageClient } from "./TemplateDetailPageClient";

export function generateStaticParams() {
  return TEMPLATES.flatMap((t) => [
    { id: t.slug },
    { id: t.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.slug === id || t.id === id);

  if (!template) {
    return {
      title: "Template Not Found — NexoreUI",
    };
  }

  return {
    title: `${template.title} — ${template.subtitle} | NexoreUI Template`,
    description: template.description,
    keywords: [
      template.title.toLowerCase(),
      ...template.tags.map((t) => t.toLowerCase()),
      "nextjs template",
      "tailwind template",
      "nexoreui starter",
    ],
    alternates: {
      canonical: `/templates/${template.slug}`,
    },
    openGraph: {
      title: `${template.title} — NexoreUI Template`,
      description: template.description,
      type: "website",
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.slug === id || t.id === id);

  if (!template) {
    notFound();
  }

  return <TemplateDetailPageClient template={template} />;
}
