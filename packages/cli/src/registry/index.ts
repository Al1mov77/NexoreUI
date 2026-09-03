import { button } from './button';
import { modal } from './modal';
import { card } from './card';
import { alert } from './alert';
import { badge } from './badge';
import { morphingGeometry } from './morphing-geometry';
import { auroraBorderFX } from './aurora-border-fx';

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
};
