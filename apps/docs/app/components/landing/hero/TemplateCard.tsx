"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TemplateItem, getTemplatePreviewImage } from "../../../data/templates";

export interface TemplateCardProps {
  template: TemplateItem;
  priority?: boolean;
  tabIndex?: number;
}

export const TemplateCard = memo(function TemplateCard({
  template,
  priority = false,
  tabIndex,
}: TemplateCardProps) {
  const imageSrc = template.previewImage || getTemplatePreviewImage(template.slug);

  return (
    <Link
      href={`/templates?preview=${template.slug}`}
      tabIndex={tabIndex}
      aria-label={`${template.title} (${template.category})`}
      className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-zinc-200/90 dark:border-white/[0.08] bg-card dark:bg-zinc-900 select-none shadow-[0_10px_28px_-6px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:z-20 hover:border-zinc-300 dark:hover:border-white/25 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_24px_48px_-10px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Image
        src={imageSrc}
        alt={template.title}
        width={480}
        height={300}
        sizes="(max-width: 767px) 46vw, 260px"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="h-full w-full object-cover object-top"
      />

      <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-inset ring-black/5 dark:ring-white/10" />
    </Link>
  );
});
