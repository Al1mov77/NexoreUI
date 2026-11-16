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
import { ditherImage } from './dither-image';
import { dock } from './dock';
import { fileUpload } from './file-upload';
import { flutedGlass } from './fluted-glass';
import { frostHoverCard } from './frost-hover-card';
import { glassLens } from './glass-lens';
import { glassShatterCard } from './glass-shatter-card';
import { gravityGrid } from './gravity-grid';
import { holoFinishCard } from './holo-finish-card';
import { input } from './input';
import { interactiveCodeBlock } from './interactive-code-block';
import { liquidSmear } from './liquid-smear';
import { liveObject } from './live-object';
import { loader } from './loader';
import { marquee } from './marquee';
import { modal } from './modal';
import { morphingGeometry } from './morphing-geometry';
import { navigation } from './navigation';
import { nodeFlowGraph } from './node-flow-graph';
import { numberTicker } from './number-ticker';
import { particleRevealCard } from './particle-reveal-card';
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
import { proObjects } from './pro-objects';
import { proTables } from './pro-tables';
import { progress } from './progress';
import { rating } from './rating';
import { rippleWater } from './ripple-water';
import { scrollArea } from './scroll-area';
import { scrollDrum } from './scroll-drum';
import { scrollWarp } from './scroll-warp';
import { select } from './select';
import { silkUnveil } from './silk-unveil';
import { skeleton } from './skeleton';
import { slider } from './slider';
import { soundPulse } from './sound-pulse';
import { specialAnimations } from './special-animations';
import { specialForms } from './special-forms';
import { stepper } from './stepper';
import { switchComponent } from './switch';
import { table } from './table';
import { tabs } from './tabs';
import { toaster } from './toaster';
import { tooltip } from './tooltip';
import { twistRibbon } from './twist-ribbon';
import { ultraComponents } from './ultra-components';
import { ultraEffects } from './ultra-effects';
import { typeProximity } from './type-proximity';
import { holoFoil } from './holo-foil';
import { letterPile } from './letter-pile';
import { flowField } from './flow-field';
import { textRail } from './text-rail';
import { moireGrating } from './moire-grating';
import { swipeDeck } from './swipe-deck';
import { cameraMirror } from './camera-mirror';
import { scrollReveal } from './scroll-reveal';
import { templateAerovoidObsidianPro } from './template-aerovoid-obsidian-pro';
import { templateAiChatInterface } from './template-ai-chat-interface';
import { templateAmarenaRoyalePro } from './template-amarena-royale-pro';
import { templateAuraNocturnePro } from './template-aura-nocturne-pro';
import { templateAuraObsidianPro } from './template-aura-obsidian-pro';
import { templateAuraSoundPro } from './template-aura-sound-pro';
import { templateAuthPro } from './template-auth-pro';
import { templateBearLiftPro } from './template-bear-lift-pro';
import { templateBurlitCoffeePro } from './template-burlit-coffee-pro';
import { templateCapySpaPro } from './template-capy-spa-pro';
import { templateChronoXPro } from './template-chrono-x-pro';
import { templateDustlineDawnPro } from './template-dustline-dawn-pro';
import { templateFizzwickSodaPro } from './template-fizzwick-soda-pro';
import { templateEcommercePro } from './template-ecommerce-pro';
import { templateFerrariNocturne } from './template-ferrari-nocturne';
import { templateFlipSkatePro } from './template-flip-skate-pro';
import { templateIronpawToolsPro } from './template-ironpaw-tools-pro';
import { templateKarminFilmPro } from './template-karmin-film-pro';
import { templateLamborghiniRevueltoPro } from './template-lamborghini-revuelto-pro';
import { templateLevitasCryoPro } from './template-levitas-cryo-pro';
import { templateMonolithCacaoPro } from './template-monolith-cacao-pro';
import { templateNexcoreAdminPro } from './template-nexcore-admin-pro';
import { templateNexoreCasePro } from './template-nexore-case-pro';
import { templateNexoreTeePro } from './template-nexore-tee-pro';
import { templatePandaBakeryPro } from './template-panda-bakery-pro';
import { templatePortfolioPro } from './template-portfolio-pro';
import { templatePsycheObsidian } from './template-psyche-obsidian';
import { templatePullNoodlePro } from './template-pull-noodle-pro';
import { templateRoseNocturne } from './template-rose-nocturne';
import { templateStaylinePro } from './template-stayline-pro';
import { templateSwaggerFormBuilder } from './template-swagger-form-builder';
import { templateToyberryStorePro } from './template-toyberry-store-pro';
import { templateUsersTablePro } from './template-users-table-pro';
import { templateVantrParticle } from './template-vantr-particle';
import { templateVaporObsidian } from './template-vapor-obsidian';
import { templateVelvetGelatoPro } from './template-velvet-gelato-pro';
import { templateVesuvioPizzaPro } from './template-vesuvio-pizza-pro';
import { templateVortexApexPro } from './template-vortex-apex-pro';
import { templateZenithElixirPro } from './template-zenith-elixir-pro';

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
  'dither-image': ditherImage,
  'ditherImage': ditherImage,
  'dock': dock,
  'file-upload': fileUpload,
  'fileUpload': fileUpload,
  'fluted-glass': flutedGlass,
  'flutedGlass': flutedGlass,
  'frost-hover-card': frostHoverCard,
  'frostHoverCard': frostHoverCard,
  'glass-lens': glassLens,
  'glassLens': glassLens,
  'glass-shatter-card': glassShatterCard,
  'glassShatterCard': glassShatterCard,
  'gravity-grid': gravityGrid,
  'gravityGrid': gravityGrid,
  'holo-finish-card': holoFinishCard,
  'holoFinishCard': holoFinishCard,
  'input': input,
  'interactive-code-block': interactiveCodeBlock,
  'interactiveCodeBlock': interactiveCodeBlock,
  'liquid-smear': liquidSmear,
  'liquidSmear': liquidSmear,
  'live-object': liveObject,
  'liveObject': liveObject,
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
  'particle-reveal-card': particleRevealCard,
  'particleRevealCard': particleRevealCard,
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
  'pro-objects': proObjects,
  'proObjects': proObjects,
  'pro-tables': proTables,
  'proTables': proTables,
  'progress': progress,
  'rating': rating,
  'ripple-water': rippleWater,
  'rippleWater': rippleWater,
  'scroll-area': scrollArea,
  'scrollArea': scrollArea,
  'scroll-drum': scrollDrum,
  'scrollDrum': scrollDrum,
  'scroll-warp': scrollWarp,
  'scrollWarp': scrollWarp,
  'select': select,
  'silk-unveil': silkUnveil,
  'silkUnveil': silkUnveil,
  'skeleton': skeleton,
  'slider': slider,
  'sound-pulse': soundPulse,
  'soundPulse': soundPulse,
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
  'twist-ribbon': twistRibbon,
  'twistRibbon': twistRibbon,
  'ultra-components': ultraComponents,
  'ultraComponents': ultraComponents,
  'ultra-effects': ultraEffects,
  'ultraEffects': ultraEffects,
  'type-proximity': typeProximity,
  'typeProximity': typeProximity,
  'holo-foil': holoFoil,
  'holoFoil': holoFoil,
  'letter-pile': letterPile,
  'letterPile': letterPile,
  'flow-field': flowField,
  'flowField': flowField,
  'text-rail': textRail,
  'textRail': textRail,
  'moire-grating': moireGrating,
  'moireGrating': moireGrating,
  'swipe-deck': swipeDeck,
  'swipeDeck': swipeDeck,
  'camera-mirror': cameraMirror,
  'cameraMirror': cameraMirror,
  'scroll-reveal': scrollReveal,
  'scrollReveal': scrollReveal,

  // Aliases
  'loaders': loader,
  'charts': premiumCharts,
  'commerce': premiumCommerce,
  'social': premiumSocial,

  // Templates
  'template-aerovoid-obsidian-pro': templateAerovoidObsidianPro,
  'template-ai-chat-interface': templateAiChatInterface,
  'template-amarena-royale-pro': templateAmarenaRoyalePro,
  'template-aura-nocturne-pro': templateAuraNocturnePro,
  'template-aura-obsidian-pro': templateAuraObsidianPro,
  'template-aura-sound-pro': templateAuraSoundPro,
  'template-auth-pro': templateAuthPro,
  'template-bear-lift-pro': templateBearLiftPro,
  'template-burlit-coffee-pro': templateBurlitCoffeePro,
  'template-capy-spa-pro': templateCapySpaPro,
  'template-chrono-x-pro': templateChronoXPro,
  'template-dustline-dawn-pro': templateDustlineDawnPro,
  'template-fizzwick-soda-pro': templateFizzwickSodaPro,
  'template-ecommerce-pro': templateEcommercePro,
  'template-ferrari-nocturne': templateFerrariNocturne,
  'template-flip-skate-pro': templateFlipSkatePro,
  'template-ironpaw-tools-pro': templateIronpawToolsPro,
  'template-karmin-film-pro': templateKarminFilmPro,
  'template-lamborghini-revuelto-pro': templateLamborghiniRevueltoPro,
  'template-levitas-cryo-pro': templateLevitasCryoPro,
  'template-monolith-cacao-pro': templateMonolithCacaoPro,
  'template-nexcore-admin-pro': templateNexcoreAdminPro,
  'template-nexore-case-pro': templateNexoreCasePro,
  'template-nexore-tee-pro': templateNexoreTeePro,
  'template-panda-bakery-pro': templatePandaBakeryPro,
  'template-portfolio-pro': templatePortfolioPro,
  'template-psyche-obsidian': templatePsycheObsidian,
  'template-pull-noodle-pro': templatePullNoodlePro,
  'template-rose-nocturne': templateRoseNocturne,
  'template-stayline-pro': templateStaylinePro,
  'template-swagger-form-builder': templateSwaggerFormBuilder,
  'template-toyberry-store-pro': templateToyberryStorePro,
  'template-users-table-pro': templateUsersTablePro,
  'template-vantr-particle': templateVantrParticle,
  'template-vapor-obsidian': templateVaporObsidian,
  'template-velvet-gelato-pro': templateVelvetGelatoPro,
  'template-vesuvio-pizza-pro': templateVesuvioPizzaPro,
  'template-vortex-apex-pro': templateVortexApexPro,
  'template-zenith-elixir-pro': templateZenithElixirPro,
};
