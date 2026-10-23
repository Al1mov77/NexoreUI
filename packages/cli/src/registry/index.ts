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

};

