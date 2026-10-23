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
import { frostHoverCard } from './frost-hover-card';
import { glassShatterCard } from './glass-shatter-card';
import { holoFinishCard } from './holo-finish-card';
import { liveObject } from './live-object';
import { particleRevealCard } from './particle-reveal-card';
import { input } from './input';
import { interactiveCodeBlock } from './interactive-code-block';
import { loader } from './loader';
import { marquee } from './marquee';
import { modal } from './modal';
import { morphingGeometry } from './morphing-geometry';
import { navigation } from './navigation';
import { nodeFlowGraph } from './node-flow-graph';
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
import { soundPulse } from './sound-pulse';
import { silkUnveil } from './silk-unveil';
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
import { templateAuraSoundPro } from './template-aura-sound-pro';
import { templateChronoXPro } from './template-chrono-x-pro';
import { templateZenithElixirPro } from './template-zenith-elixir-pro';
import { templateVelvetGelatoPro } from './template-velvet-gelato-pro';
import { templateAuraNocturnePro } from './template-aura-nocturne-pro';
import { templateAuraObsidianPro } from './template-aura-obsidian-pro';
import { templateLevitasCryoPro } from './template-levitas-cryo-pro';
import { templateMonolithCacaoPro } from './template-monolith-cacao-pro';
import { templateAmarenaRoyalePro } from './template-amarena-royale-pro';
import { templateAerovoidObsidianPro } from './template-aerovoid-obsidian-pro';
import { templateVortexApexPro } from './template-vortex-apex-pro';
import { templatePsycheObsidian } from './template-psyche-obsidian';
import { templateFerrariNocturne } from './template-ferrari-nocturne';
import { templateNexcoreAdminPro } from './template-nexcore-admin-pro';
import { templateAuthPro } from './template-auth-pro';
import { templateEcommercePro } from './template-ecommerce-pro';
import { templateUsersTablePro } from './template-users-table-pro';
import { templatePortfolioPro } from './template-portfolio-pro';
import { templateSwaggerFormBuilder } from './template-swagger-form-builder';
import { templateAiChatInterface } from './template-ai-chat-interface';
import { templateStaylinePro } from './template-stayline-pro';
import { templateLamborghiniRevueltoPro } from './template-lamborghini-revuelto-pro';
import { templateIronpawToolsPro } from './template-ironpaw-tools-pro';
import { templateBurlitCoffeePro } from './template-burlit-coffee-pro';
import { templateBearLiftPro } from './template-bear-lift-pro';
import { templateCapySpaPro } from './template-capy-spa-pro';
import { templateRoseNocturne } from './template-rose-nocturne';
import { templatePandaBakeryPro } from './template-panda-bakery-pro';
import { templateVaporObsidian } from './template-vapor-obsidian';
import { templatePullNoodlePro } from './template-pull-noodle-pro';
import { templateFlipSkatePro } from './template-flip-skate-pro';
import { templateVantrParticle } from './template-vantr-particle';

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
  'frost-hover-card': frostHoverCard,
  'frostHoverCard': frostHoverCard,
  'glass-shatter-card': glassShatterCard,
  'glassShatterCard': glassShatterCard,
  'holo-finish-card': holoFinishCard,
  'holoFinishCard': holoFinishCard,
  'live-object': liveObject,
  'liveObject': liveObject,
  'particle-reveal-card': particleRevealCard,
  'particleRevealCard': particleRevealCard,
  'input': input,
  'interactive-code-block': interactiveCodeBlock,
  'interactiveCodeBlock': interactiveCodeBlock,
  'loader': loader,
  'marquee': marquee,
  'modal': modal,
  'morphing-geometry': morphingGeometry,
  'morphingGeometry': morphingGeometry,
  'navigation': navigation,
  'node-flow-graph': nodeFlowGraph,
  'nodeFlowGraph': nodeFlowGraph,
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
  'sound-pulse': soundPulse,
  'soundPulse': soundPulse,
  'silk-unveil': silkUnveil,
  'silkUnveil': silkUnveil,
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
  'template-aura-sound-pro': templateAuraSoundPro,
  'template-chrono-x-pro': templateChronoXPro,
  'template-zenith-elixir-pro': templateZenithElixirPro,
  'templateZenithElixirPro': templateZenithElixirPro,
  'template-velvet-gelato-pro': templateVelvetGelatoPro,
  'templateVelvetGelatoPro': templateVelvetGelatoPro,
  'template-aura-nocturne-pro': templateAuraNocturnePro,
  'templateAuraNocturnePro': templateAuraNocturnePro,
  'template-aura-obsidian-pro': templateAuraObsidianPro,
  'templateAuraObsidianPro': templateAuraObsidianPro,
  'template-levitas-cryo-pro': templateLevitasCryoPro,
  'templateLevitasCryoPro': templateLevitasCryoPro,
  'template-monolith-cacao-pro': templateMonolithCacaoPro,
  'templateMonolithCacaoPro': templateMonolithCacaoPro,
  'template-amarena-royale-pro': templateAmarenaRoyalePro,
  'templateAmarenaRoyalePro': templateAmarenaRoyalePro,
  'template-aerovoid-obsidian-pro': templateAerovoidObsidianPro,
  'templateAerovoidObsidianPro': templateAerovoidObsidianPro,
  'template-vortex-apex-pro': templateVortexApexPro,
  'template-psyche-obsidian': templatePsycheObsidian,
  'templatePsycheObsidian': templatePsycheObsidian,
  'templateVortexApexPro': templateVortexApexPro,
  'template-ferrari-nocturne': templateFerrariNocturne,
  'templateFerrariNocturne': templateFerrariNocturne,
  'template-nexcore-admin-pro': templateNexcoreAdminPro,
  'templateNexcoreAdminPro': templateNexcoreAdminPro,
  'template-auth-pro': templateAuthPro,
  'templateAuthPro': templateAuthPro,
  'template-ecommerce-pro': templateEcommercePro,
  'templateEcommercePro': templateEcommercePro,
  'template-users-table-pro': templateUsersTablePro,
  'templateUsersTablePro': templateUsersTablePro,
  'template-table-users-pro': templateUsersTablePro,
  'template-portfolio-pro': templatePortfolioPro,
  'templatePortfolioPro': templatePortfolioPro,
  'template-portfolio': templatePortfolioPro,
  'template-nexportfolio-pro': templatePortfolioPro,
  'template-swagger-form-builder': templateSwaggerFormBuilder,
  'templateSwaggerFormBuilder': templateSwaggerFormBuilder,
  'template-form-builder': templateSwaggerFormBuilder,
  'swagger-form-builder': templateSwaggerFormBuilder,
  'template-ai-chat-interface': templateAiChatInterface,
  'templateAiChatInterface': templateAiChatInterface,
  'ai-chat-interface': templateAiChatInterface,
  'template-ai-chat': templateAiChatInterface,
  'template-stayline-pro': templateStaylinePro,
  'templateStaylinePro': templateStaylinePro,
  'stayline': templateStaylinePro,
  'template-lamborghini-revuelto': templateLamborghiniRevueltoPro,
  'templateLamborghiniRevueltoPro': templateLamborghiniRevueltoPro,
  'lamborghini-revuelto': templateLamborghiniRevueltoPro,
  'template-ironpaw-tools-pro': templateIronpawToolsPro,
  'templateIronpawToolsPro': templateIronpawToolsPro,
  'ironpaw-tools': templateIronpawToolsPro,
  'template-burlit-coffee-pro': templateBurlitCoffeePro,
  'templateBurlitCoffeePro': templateBurlitCoffeePro,
  'burlit-coffee': templateBurlitCoffeePro,
  'template-bear-lift-pro': templateBearLiftPro,
  'templateBearLiftPro': templateBearLiftPro,
  'bear-lift': templateBearLiftPro,
  'template-capy-spa-pro': templateCapySpaPro,
  'templateCapySpaPro': templateCapySpaPro,
  'capy-spa': templateCapySpaPro,
  'template-rose-nocturne': templateRoseNocturne,
  'templateRoseNocturne': templateRoseNocturne,
  'rose-nocturne-atelier': templateRoseNocturne,
  'template-panda-bakery-pro': templatePandaBakeryPro,
  'templatePandaBakeryPro': templatePandaBakeryPro,
  'panda-bakery': templatePandaBakeryPro,
  'template-vapor-obsidian': templateVaporObsidian,
  'templateVaporObsidian': templateVaporObsidian,
  'vapor-obsidian-atelier': templateVaporObsidian,
  'template-flip-skate-pro': templateFlipSkatePro,
  'templateFlipSkatePro': templateFlipSkatePro,
  'flip-skate': templateFlipSkatePro,
  'template-flip-skate': templateFlipSkatePro,
  'template-pull-noodle-pro': templatePullNoodlePro,
  'templatePullNoodlePro': templatePullNoodlePro,
  'pull-noodle': templatePullNoodlePro,
  'template-pull-noodle': templatePullNoodlePro,
  // Vantr Particle Reveal
  'template-vantr-particle': templateVantrParticle,
  'templateVantrParticle': templateVantrParticle,
  'vantr-particle': templateVantrParticle,
  'vantr-particle-reveal': templateVantrParticle,
  'template-vantr-particle-pro': templateVantrParticle,
};
