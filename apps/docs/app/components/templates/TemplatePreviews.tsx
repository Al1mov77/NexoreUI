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
import { HealthcarePortalPreview } from "./previews/HealthcarePortalPreview";
import { Web3DexPreview } from "./previews/Web3DexPreview";
import { EdtechLearningPreview } from "./previews/EdtechLearningPreview";
import { ConferenceEventPreview } from "./previews/ConferenceEventPreview";
import { AudioPodcastPreview } from "./previews/AudioPodcastPreview";
import { RealEstatePreview } from "./previews/RealEstatePreview";
import { UptimeStatusPreview } from "./previews/UptimeStatusPreview";
import { AgentWorkflowPreview } from "./previews/AgentWorkflowPreview";
import { RestaurantCulinaryPreview } from "./previews/RestaurantCulinaryPreview";
import { HelpCenterPreview } from "./previews/HelpCenterPreview";
import { FitnessAthleticsPreview } from "./previews/FitnessAthleticsPreview";
import { WildernessTravelPreview } from "./previews/WildernessTravelPreview";
import { DevopsKubernetesPreview } from "./previews/DevopsKubernetesPreview";
import { AudioDawPreview } from "./previews/AudioDawPreview";
import { GamifiedHabitsPreview } from "./previews/GamifiedHabitsPreview";
import { GlobalLogisticsPreview } from "./previews/GlobalLogisticsPreview";
import { GamingEsportsPreview } from "./previews/GamingEsportsPreview";
import { ArchitectureSpatialPreview } from "./previews/ArchitectureSpatialPreview";
import { CybersecuritySocPreview } from "./previews/CybersecuritySocPreview";
import { CleantechAgriculturePreview } from "./previews/CleantechAgriculturePreview";
import { JurisVaultPreview } from "./previews/JurisVaultPreview";
import { OrbitalXPreview } from "./previews/OrbitalXPreview";
import { CineBoardPreview } from "./previews/CineBoardPreview";
import { DomusLivingPreview } from "./previews/DomusLivingPreview";
import { HyperionEvPreview } from "./previews/HyperionEvPreview";
import { SovereignAuctionsPreview } from "./previews/SovereignAuctionsPreview";
import { ScholarisArchivePreview } from "./previews/ScholarisArchivePreview";
import { TalentOrbitPreview } from "./previews/TalentOrbitPreview";
import { MiseEnPlacePreview } from "./previews/MiseEnPlacePreview";
import { AuraSolacePreview } from "./previews/AuraSolacePreview";

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
    case "template-healthcare-portal":
      return <HealthcarePortalPreview />;
    case "template-web3-dex":
      return <Web3DexPreview />;
    case "template-edtech-learning":
      return <EdtechLearningPreview />;
    case "template-conference-event":
      return <ConferenceEventPreview />;
    case "template-audio-podcast":
      return <AudioPodcastPreview />;
    case "template-real-estate":
      return <RealEstatePreview />;
    case "template-uptime-status":
      return <UptimeStatusPreview />;
    case "template-agent-workflow":
      return <AgentWorkflowPreview />;
    case "template-restaurant-culinary":
      return <RestaurantCulinaryPreview />;
    case "template-help-center":
      return <HelpCenterPreview />;
    case "template-fitness-athletics":
      return <FitnessAthleticsPreview />;
    case "template-wilderness-travel":
      return <WildernessTravelPreview />;
    case "template-devops-kubernetes":
      return <DevopsKubernetesPreview />;
    case "template-audio-daw":
      return <AudioDawPreview />;
    case "template-gamified-habits":
      return <GamifiedHabitsPreview />;
    case "template-global-logistics":
      return <GlobalLogisticsPreview />;
    case "template-gaming-esports":
      return <GamingEsportsPreview />;
    case "template-architecture-spatial":
      return <ArchitectureSpatialPreview />;
    case "template-cybersecurity-soc":
      return <CybersecuritySocPreview />;
    case "template-cleantech-agriculture":
      return <CleantechAgriculturePreview />;
    case "template-juris-vault":
      return <JurisVaultPreview />;
    case "template-orbitalx-mission":
      return <OrbitalXPreview />;
    case "template-cineboard-studio":
      return <CineBoardPreview />;
    case "template-domus-living":
      return <DomusLivingPreview />;
    case "template-hyperion-ev":
      return <HyperionEvPreview />;
    case "template-sovereign-auctions":
      return <SovereignAuctionsPreview />;
    case "template-scholaris-archive":
      return <ScholarisArchivePreview />;
    case "template-talentorbit-hr":
      return <TalentOrbitPreview />;
    case "template-miseenplace-kds":
      return <MiseEnPlacePreview />;
    case "template-aurasolace-sanctuary":
      return <AuraSolacePreview />;
    default:
      return <AiStartupPreview />;
  }
}
