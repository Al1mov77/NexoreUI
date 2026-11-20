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
import { proButtons } from './pro-buttons';
import { proCards } from './pro-cards';
import { proInputs } from './pro-inputs';
import { proObjects } from './pro-objects';
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

export interface RegistryItem {
  name: string;
  dependencies: string[];
  componentsDependencies?: string[];
  fileName: string;
  content: string;
}

export const canonicalRegistry: Record<string, RegistryItem> = {
  'accordion': accordion,
  'ai-prompt-input': aiPromptInput,
  'alert': alert,
  'aurora-border-card': auroraBorderCard,
  'aurora-border-fx': auroraBorderFx,
  'aurora-search-pill': auroraSearchPill,
  'avatar': avatar,
  'badge': badge,
  'blur-fade': blurFade,
  'button': button,
  'camera-mirror': cameraMirror,
  'card': card,
  'checkbox': checkbox,
  'command': command,
  'dark-mode': darkMode,
  'data-display': dataDisplay,
  'dialog': dialog,
  'dither-image': ditherImage,
  'dock': dock,
  'file-upload': fileUpload,
  'flow-field': flowField,
  'fluted-glass': flutedGlass,
  'frost-hover-card': frostHoverCard,
  'glass-lens': glassLens,
  'glass-shatter-card': glassShatterCard,
  'gravity-grid': gravityGrid,
  'holo-finish-card': holoFinishCard,
  'holo-foil': holoFoil,
  'input': input,
  'interactive-code-block': interactiveCodeBlock,
  'letter-pile': letterPile,
  'liquid-smear': liquidSmear,
  'live-object': liveObject,
  'loader': loader,
  'marquee': marquee,
  'moire-grating': moireGrating,
  'morphing-geometry': morphingGeometry,
  'navigation': navigation,
  'node-flow-graph': nodeFlowGraph,
  'number-ticker': numberTicker,
  'particle-reveal-card': particleRevealCard,
  'premium-charts': premiumCharts,
  'premium-commerce': premiumCommerce,
  'premium-effects': premiumEffects,
  'premium-media': premiumMedia,
  'premium-overlays': premiumOverlays,
  'premium-social': premiumSocial,
  'pro-buttons': proButtons,
  'pro-cards': proCards,
  'pro-inputs': proInputs,
  'pro-objects': proObjects,
  'progress': progress,
  'rating': rating,
  'ripple-water': rippleWater,
  'scroll-area': scrollArea,
  'scroll-drum': scrollDrum,
  'scroll-reveal': scrollReveal,
  'scroll-warp': scrollWarp,
  'select': select,
  'silk-unveil': silkUnveil,
  'skeleton': skeleton,
  'slider': slider,
  'sound-pulse': soundPulse,
  'special-animations': specialAnimations,
  'special-forms': specialForms,
  'stepper': stepper,
  'swipe-deck': swipeDeck,
  'switch': switchComponent,
  'table': table,
  'tabs': tabs,
  'text-rail': textRail,
  'toaster': toaster,
  'tooltip': tooltip,
  'twist-ribbon': twistRibbon,
  'type-proximity': typeProximity,
  'ultra-components': ultraComponents,
  'ultra-effects': ultraEffects,
};

export const registry: Record<string, RegistryItem> = {
  ...canonicalRegistry,

  // Friendly & legacy aliases
  'modal': dialog,
  'loaders': loader,
  'charts': premiumCharts,
  'commerce': premiumCommerce,
  'social': premiumSocial,
  'action-buttons': proButtons,
  'specialized-inputs': proInputs,
  'form-controls': specialForms,
  'product-cards': proCards,
  'spotlight-effects': premiumEffects,
  'text-motion': ultraEffects,
  'atmospheric-effects': ultraComponents,
  'motion-primitives': specialAnimations,
  'media-showcase': premiumMedia,
  'overlays': premiumOverlays,

  // camelCase compatibility aliases
  'aiPromptInput': aiPromptInput,
  'auroraBorderCard': auroraBorderCard,
  'auroraBorderFx': auroraBorderFx,
  'auroraSearchPill': auroraSearchPill,
  'blurFade': blurFade,
  'cameraMirror': cameraMirror,
  'darkMode': darkMode,
  'dataDisplay': dataDisplay,
  'ditherImage': ditherImage,
  'fileUpload': fileUpload,
  'flowField': flowField,
  'flutedGlass': flutedGlass,
  'frostHoverCard': frostHoverCard,
  'glassLens': glassLens,
  'glassShatterCard': glassShatterCard,
  'gravityGrid': gravityGrid,
  'holoFinishCard': holoFinishCard,
  'holoFoil': holoFoil,
  'interactiveCodeBlock': interactiveCodeBlock,
  'letterPile': letterPile,
  'liquidSmear': liquidSmear,
  'liveObject': liveObject,
  'moireGrating': moireGrating,
  'morphingGeometry': morphingGeometry,
  'nodeFlowGraph': nodeFlowGraph,
  'numberTicker': numberTicker,
  'particleRevealCard': particleRevealCard,
  'premiumCharts': premiumCharts,
  'premiumCommerce': premiumCommerce,
  'premiumEffects': premiumEffects,
  'premiumMedia': premiumMedia,
  'premiumOverlays': premiumOverlays,
  'premiumSocial': premiumSocial,
  'proButtons': proButtons,
  'proCards': proCards,
  'proInputs': proInputs,
  'proObjects': proObjects,
  'rippleWater': rippleWater,
  'scrollArea': scrollArea,
  'scrollDrum': scrollDrum,
  'scrollReveal': scrollReveal,
  'scrollWarp': scrollWarp,
  'silkUnveil': silkUnveil,
  'soundPulse': soundPulse,
  'specialAnimations': specialAnimations,
  'specialForms': specialForms,
  'swipeDeck': swipeDeck,
  'switchComponent': switchComponent,
  'textRail': textRail,
  'twistRibbon': twistRibbon,
  'typeProximity': typeProximity,
  'ultraComponents': ultraComponents,
  'ultraEffects': ultraEffects,
};
