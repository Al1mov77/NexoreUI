import { accordion } from './accordion';
import { aiPromptInput } from './ai-prompt-input';
import { alert } from './alert';
import { auroraBorderCard } from './aurora-border-card';
import { auroraBorderFx } from './aurora-border-fx';
import { auroraSearchPill } from './aurora-search-pill';
import { avatar } from './avatar';
import { badge } from './badge';
import { blurFade } from './blur-fade';
import { button } from './button';
import { card } from './card';
import { checkbox } from './checkbox';
import { command } from './command';
import { darkMode } from './dark-mode';
import { dataDisplay } from './data-display';
import { dialog } from './dialog';
import { dock } from './dock';
import { fileUpload } from './file-upload';
import { input } from './input';
import { interactiveCodeBlock } from './interactive-code-block';
import { loader } from './loader';
import { marquee } from './marquee';
import { modal } from './modal';
import { morphingGeometry } from './morphing-geometry';
import { navigation } from './navigation';
import { numberTicker } from './number-ticker';
import { premiumCharts } from './premium-charts';
import { premiumCommerce } from './premium-commerce';
import { premiumEffects } from './premium-effects';
import { premiumMedia } from './premium-media';
import { premiumOverlays } from './premium-overlays';
import { premiumSocial } from './premium-social';
import { proAi } from './pro-ai';
import { proButtons } from './pro-buttons';
import { proCards } from './pro-cards';
import { proDashboards } from './pro-dashboards';
import { proEcommerce } from './pro-ecommerce';
import { proFeedback } from './pro-feedback';
import { proForms } from './pro-forms';
import { proInputs } from './pro-inputs';
import { proLayouts } from './pro-layouts';
import { proLists } from './pro-lists';
import { proMarketing } from './pro-marketing';
import { proNavigation } from './pro-navigation';
import { proTables } from './pro-tables';
import { progress } from './progress';
import { rating } from './rating';
import { scrollArea } from './scroll-area';
import { select } from './select';
import { skeleton } from './skeleton';
import { slider } from './slider';
import { specialAnimations } from './special-animations';
import { specialForms } from './special-forms';
import { stepper } from './stepper';
import { switchComponent } from './switch';
import { table } from './table';
import { tabs } from './tabs';
import { toaster } from './toaster';
import { tooltip } from './tooltip';
import { ultraComponents } from './ultra-components';
import { ultraEffects } from './ultra-effects';
import { templateAgencyCreative } from './template-agency-creative';
import { templateAgentWorkflow } from './template-agent-workflow';
import { templateAiChat } from './template-ai-chat';
import { templateAiStartup } from './template-ai-startup';
import { templateAnalyticsDashboard } from './template-analytics-dashboard';
import { templateArchitectureSpatial } from './template-architecture-spatial';
import { templateAudioDaw } from './template-audio-daw';
import { templateAudioPodcast } from './template-audio-podcast';
import { templateAurasolaceSanctuary } from './template-aurasolace-sanctuary';
import { templateCineboardStudio } from './template-cineboard-studio';
import { templateCleantechAgriculture } from './template-cleantech-agriculture';
import { templateConferenceEvent } from './template-conference-event';
import { templateCreativePortfolio } from './template-creative-portfolio';
import { templateCybersecuritySoc } from './template-cybersecurity-soc';
import { templateDevopsKubernetes } from './template-devops-kubernetes';
import { templateDevtoolsCli } from './template-devtools-cli';
import { templateDocsPlatform } from './template-docs-platform';
import { templateDomusLiving } from './template-domus-living';
import { templateEcommerceStore } from './template-ecommerce-store';
import { templateEdtechLearning } from './template-edtech-learning';
import { templateFintechApp } from './template-fintech-app';
import { templateFitnessAthletics } from './template-fitness-athletics';
import { templateGamifiedHabits } from './template-gamified-habits';
import { templateGamingEsports } from './template-gaming-esports';
import { templateGlobalLogistics } from './template-global-logistics';
import { templateHealthcarePortal } from './template-healthcare-portal';
import { templateHelpCenter } from './template-help-center';
import { templateHyperionEv } from './template-hyperion-ev';
import { templateJurisVault } from './template-juris-vault';
import { templateMiseenplaceKds } from './template-miseenplace-kds';
import { templateModernSaas } from './template-modern-saas';
import { templateOrbitalxMission } from './template-orbitalx-mission';
import { templateProjectManagement } from './template-project-management';
import { templateRealEstate } from './template-real-estate';
import { templateRestaurantCulinary } from './template-restaurant-culinary';
import { templateScholarisArchive } from './template-scholaris-archive';
import { templateSovereignAuctions } from './template-sovereign-auctions';
import { templateStartupWaitlist } from './template-startup-waitlist';
import { templateTalentorbitHr } from './template-talentorbit-hr';
import { templateUptimeStatus } from './template-uptime-status';
import { templateWeb3Dex } from './template-web3-dex';
import { templateWildernessTravel } from './template-wilderness-travel';

export interface RegistryItem {
  name: string;
  dependencies: string[];
  componentsDependencies?: string[];
  fileName: string;
  content: string;
}

export const registry: Record<string, RegistryItem> = {
  // UI Components
  'accordion': accordion,
  'ai-prompt-input': aiPromptInput,
  'aiPromptInput': aiPromptInput,
  'alert': alert,
  'aurora-border-card': auroraBorderCard,
  'auroraBorderCard': auroraBorderCard,
  'aurora-border-fx': auroraBorderFx,
  'auroraBorderFx': auroraBorderFx,
  'aurora-search-pill': auroraSearchPill,
  'auroraSearchPill': auroraSearchPill,
  'avatar': avatar,
  'badge': badge,
  'blur-fade': blurFade,
  'blurFade': blurFade,
  'button': button,
  'card': card,
  'checkbox': checkbox,
  'command': command,
  'dark-mode': darkMode,
  'darkMode': darkMode,
  'data-display': dataDisplay,
  'dataDisplay': dataDisplay,
  'dialog': dialog,
  'dock': dock,
  'file-upload': fileUpload,
  'fileUpload': fileUpload,
  'input': input,
  'interactive-code-block': interactiveCodeBlock,
  'interactiveCodeBlock': interactiveCodeBlock,
  'loader': loader,
  'marquee': marquee,
  'modal': modal,
  'morphing-geometry': morphingGeometry,
  'morphingGeometry': morphingGeometry,
  'navigation': navigation,
  'number-ticker': numberTicker,
  'numberTicker': numberTicker,
  'premium-charts': premiumCharts,
  'premiumCharts': premiumCharts,
  'premium-commerce': premiumCommerce,
  'premiumCommerce': premiumCommerce,
  'premium-effects': premiumEffects,
  'premiumEffects': premiumEffects,
  'premium-media': premiumMedia,
  'premiumMedia': premiumMedia,
  'premium-overlays': premiumOverlays,
  'premiumOverlays': premiumOverlays,
  'premium-social': premiumSocial,
  'premiumSocial': premiumSocial,
  'pro-ai': proAi,
  'proAi': proAi,
  'pro-buttons': proButtons,
  'proButtons': proButtons,
  'pro-cards': proCards,
  'proCards': proCards,
  'pro-dashboards': proDashboards,
  'proDashboards': proDashboards,
  'pro-ecommerce': proEcommerce,
  'proEcommerce': proEcommerce,
  'pro-feedback': proFeedback,
  'proFeedback': proFeedback,
  'pro-forms': proForms,
  'proForms': proForms,
  'pro-inputs': proInputs,
  'proInputs': proInputs,
  'pro-layouts': proLayouts,
  'proLayouts': proLayouts,
  'pro-lists': proLists,
  'proLists': proLists,
  'pro-marketing': proMarketing,
  'proMarketing': proMarketing,
  'pro-navigation': proNavigation,
  'proNavigation': proNavigation,
  'pro-tables': proTables,
  'proTables': proTables,
  'progress': progress,
  'rating': rating,
  'scroll-area': scrollArea,
  'scrollArea': scrollArea,
  'select': select,
  'skeleton': skeleton,
  'slider': slider,
  'special-animations': specialAnimations,
  'specialAnimations': specialAnimations,
  'special-forms': specialForms,
  'specialForms': specialForms,
  'stepper': stepper,
  'switch': switchComponent,
  'switchComponent': switchComponent,
  'table': table,
  'tabs': tabs,
  'toaster': toaster,
  'tooltip': tooltip,
  'ultra-components': ultraComponents,
  'ultraComponents': ultraComponents,
  'ultra-effects': ultraEffects,
  'ultraEffects': ultraEffects,

  // Aliases
  'loaders': loader,
  'charts': premiumCharts,
  'commerce': premiumCommerce,
  'social': premiumSocial,

  // Templates
  'template-agency-creative': templateAgencyCreative,
  'template-agent-workflow': templateAgentWorkflow,
  'template-ai-chat': templateAiChat,
  'template-ai-startup': templateAiStartup,
  'template-analytics-dashboard': templateAnalyticsDashboard,
  'template-architecture-spatial': templateArchitectureSpatial,
  'template-audio-daw': templateAudioDaw,
  'template-audio-podcast': templateAudioPodcast,
  'template-aurasolace-sanctuary': templateAurasolaceSanctuary,
  'template-cineboard-studio': templateCineboardStudio,
  'template-cleantech-agriculture': templateCleantechAgriculture,
  'template-conference-event': templateConferenceEvent,
  'template-creative-portfolio': templateCreativePortfolio,
  'template-cybersecurity-soc': templateCybersecuritySoc,
  'template-devops-kubernetes': templateDevopsKubernetes,
  'template-devtools-cli': templateDevtoolsCli,
  'template-docs-platform': templateDocsPlatform,
  'template-domus-living': templateDomusLiving,
  'template-ecommerce-store': templateEcommerceStore,
  'template-edtech-learning': templateEdtechLearning,
  'template-fintech-app': templateFintechApp,
  'template-fitness-athletics': templateFitnessAthletics,
  'template-gamified-habits': templateGamifiedHabits,
  'template-gaming-esports': templateGamingEsports,
  'template-global-logistics': templateGlobalLogistics,
  'template-healthcare-portal': templateHealthcarePortal,
  'template-help-center': templateHelpCenter,
  'template-hyperion-ev': templateHyperionEv,
  'template-juris-vault': templateJurisVault,
  'template-miseenplace-kds': templateMiseenplaceKds,
  'template-modern-saas': templateModernSaas,
  'template-orbitalx-mission': templateOrbitalxMission,
  'template-project-management': templateProjectManagement,
  'template-real-estate': templateRealEstate,
  'template-restaurant-culinary': templateRestaurantCulinary,
  'template-scholaris-archive': templateScholarisArchive,
  'template-sovereign-auctions': templateSovereignAuctions,
  'template-startup-waitlist': templateStartupWaitlist,
  'template-talentorbit-hr': templateTalentorbitHr,
  'template-uptime-status': templateUptimeStatus,
  'template-web3-dex': templateWeb3Dex,
  'template-wilderness-travel': templateWildernessTravel,
};
