"use client";

import React from "react";
import { AiStartupPreview } from "./previews/AiStartupPreview";
import { ModernSaasPreview } from "./previews/ModernSaasPreview";
import { AnalyticsDashboardPreview } from "./previews/AnalyticsDashboardPreview";
import { DevtoolsCliPreview } from "./previews/DevtoolsCliPreview";
import { CreativePortfolioPreview } from "./previews/CreativePortfolioPreview";
import { FintechAppPreview } from "./previews/FintechAppPreview";
import { EcommerceStorePreview } from "./previews/EcommerceStorePreview";
import { AgencyCreativePreview } from "./previews/AgencyCreativePreview";
import { AiChatPreview } from "./previews/AiChatPreview";
import { ProjectManagementPreview } from "./previews/ProjectManagementPreview";
import { StartupWaitlistPreview } from "./previews/StartupWaitlistPreview";
import { DocsPlatformPreview } from "./previews/DocsPlatformPreview";

export function RenderTemplatePreview({ templateId }: { templateId: string }) {
  switch (templateId) {
    case "template-ai-startup":
      return <AiStartupPreview />;
    case "template-modern-saas":
      return <ModernSaasPreview />;
    case "template-analytics-dashboard":
      return <AnalyticsDashboardPreview />;
    case "template-devtools-cli":
      return <DevtoolsCliPreview />;
    case "template-creative-portfolio":
      return <CreativePortfolioPreview />;
    case "template-fintech-app":
      return <FintechAppPreview />;
    case "template-ecommerce-store":
      return <EcommerceStorePreview />;
    case "template-agency-creative":
      return <AgencyCreativePreview />;
    case "template-ai-chat":
      return <AiChatPreview />;
    case "template-project-management":
      return <ProjectManagementPreview />;
    case "template-startup-waitlist":
      return <StartupWaitlistPreview />;
    case "template-docs-platform":
      return <DocsPlatformPreview />;
    default:
      return <AiStartupPreview />;
  }
}
