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
};


