import { button } from './button';
import { modal } from './modal';
import { card } from './card';
import { alert } from './alert';
import { badge } from './badge';
import { morphingGeometry } from './morphing-geometry';
import { auroraBorderFX } from './aurora-border-fx';
import { auroraSearchPill } from './aurora-search-pill';
import { templateAiStartup } from './template-ai-startup';
import { templateModernSaas } from './template-modern-saas';
import { templateAnalyticsDashboard } from './template-analytics-dashboard';
import { templateDevtoolsCli } from './template-devtools-cli';
import { templateCreativePortfolio } from './template-creative-portfolio';
import { templateFintechApp } from './template-fintech-app';
import { templateEcommerceStore } from './template-ecommerce-store';
import { templateAgencyCreative } from './template-agency-creative';
import { templateAiChat } from './template-ai-chat';
import { templateProjectManagement } from './template-project-management';
import { templateStartupWaitlist } from './template-startup-waitlist';
import { templateDocsPlatform } from './template-docs-platform';
import { templateHealthcarePortal } from './template-healthcare-portal';
import { templateWeb3Dex } from './template-web3-dex';
import { templateEdtechLearning } from './template-edtech-learning';
import { templateConferenceEvent } from './template-conference-event';
import { templateAudioPodcast } from './template-audio-podcast';
import { templateRealEstate } from './template-real-estate';
import { templateUptimeStatus } from './template-uptime-status';
import { templateAgentWorkflow } from './template-agent-workflow';
import { templateRestaurantCulinary } from './template-restaurant-culinary';
import { templateHelpCenter } from './template-help-center';
import { templateFitnessAthletics } from './template-fitness-athletics';
import { templateWildernessTravel } from './template-wilderness-travel';
import { templateDevopsKubernetes } from './template-devops-kubernetes';
import { templateAudioDaw } from './template-audio-daw';
import { templateGamifiedHabits } from './template-gamified-habits';
import { templateGlobalLogistics } from './template-global-logistics';
import { templateGamingEsports } from './template-gaming-esports';
import { templateArchitectureSpatial } from './template-architecture-spatial';
import { templateCybersecuritySoc } from './template-cybersecurity-soc';
import { templateCleantechAgriculture } from './template-cleantech-agriculture';
import { templateJurisVault } from './template-juris-vault';
import { templateOrbitalxMission } from './template-orbitalx-mission';
import { templateCineboardStudio } from './template-cineboard-studio';
import { templateDomusLiving } from './template-domus-living';
import { templateHyperionEv } from './template-hyperion-ev';
import { templateSovereignAuctions } from './template-sovereign-auctions';
import { templateScholarisArchive } from './template-scholaris-archive';
import { templateTalentorbitHr } from './template-talentorbit-hr';
import { templateMiseenplaceKds } from './template-miseenplace-kds';
import { templateAurasolaceSanctuary } from './template-aurasolace-sanctuary';

export interface RegistryItem {
  name: string;
  dependencies: string[];
  componentsDependencies?: string[];
  fileName: string;
  content: string;
}

export const registry: Record<string, RegistryItem> = {
  button,
  modal,
  card,
  alert,
  badge,
  'morphing-geometry': morphingGeometry,
  'aurora-border-fx': auroraBorderFX,
  'aurora-search-pill': auroraSearchPill,
  'template-ai-startup': templateAiStartup,
  'template-modern-saas': templateModernSaas,
  'template-analytics-dashboard': templateAnalyticsDashboard,
  'template-devtools-cli': templateDevtoolsCli,
  'template-creative-portfolio': templateCreativePortfolio,
  'template-fintech-app': templateFintechApp,
  'template-ecommerce-store': templateEcommerceStore,
  'template-agency-creative': templateAgencyCreative,
  'template-ai-chat': templateAiChat,
  'template-project-management': templateProjectManagement,
  'template-startup-waitlist': templateStartupWaitlist,
  'template-docs-platform': templateDocsPlatform,
  'template-healthcare-portal': templateHealthcarePortal,
  'template-web3-dex': templateWeb3Dex,
  'template-edtech-learning': templateEdtechLearning,
  'template-conference-event': templateConferenceEvent,
  'template-audio-podcast': templateAudioPodcast,
  'template-real-estate': templateRealEstate,
  'template-uptime-status': templateUptimeStatus,
  'template-agent-workflow': templateAgentWorkflow,
  'template-restaurant-culinary': templateRestaurantCulinary,
  'template-help-center': templateHelpCenter,
  'template-fitness-athletics': templateFitnessAthletics,
  'template-wilderness-travel': templateWildernessTravel,
  'template-devops-kubernetes': templateDevopsKubernetes,
  'template-audio-daw': templateAudioDaw,
  'template-gamified-habits': templateGamifiedHabits,
  'template-global-logistics': templateGlobalLogistics,
  'template-gaming-esports': templateGamingEsports,
  'template-architecture-spatial': templateArchitectureSpatial,
  'template-cybersecurity-soc': templateCybersecuritySoc,
  'template-cleantech-agriculture': templateCleantechAgriculture,
  'template-juris-vault': templateJurisVault,
  'template-orbitalx-mission': templateOrbitalxMission,
  'template-cineboard-studio': templateCineboardStudio,
  'template-domus-living': templateDomusLiving,
  'template-hyperion-ev': templateHyperionEv,
  'template-sovereign-auctions': templateSovereignAuctions,
  'template-scholaris-archive': templateScholarisArchive,
  'template-talentorbit-hr': templateTalentorbitHr,
  'template-miseenplace-kds': templateMiseenplaceKds,
  'template-aurasolace-sanctuary': templateAurasolaceSanctuary,
};



