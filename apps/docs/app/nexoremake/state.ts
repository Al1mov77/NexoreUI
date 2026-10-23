import { NexoreMakeElement, CanvasSettings, DeviceType } from './types';

export interface MakerState {
  elements: NexoreMakeElement[];
  selectedId: string | null;
  selectedIds: string[];
  canvasSettings: CanvasSettings;
  projectName: string;
  history: NexoreMakeElement[][];
  historyIndex: number;
  lastMutationKey?: string;
  lastMutationTime?: number;
}

export type MakerAction =
  | { type: 'ADD_ELEMENT'; element: Omit<NexoreMakeElement, 'id' | 'zIndex'> }
  | { type: 'MOVE_ELEMENT'; id: string; x: number; y: number }
  | { type: 'MOVE_SELECTED_ELEMENTS'; deltaX: number; deltaY: number }
  | { type: 'RESIZE_ELEMENT'; id: string; width: number | string; height: number | string }
  | { type: 'UPDATE_ELEMENT_BOUNDS'; id: string; x: number; y: number; width: number | string; height: number | string }
  | { type: 'UPDATE_ELEMENT_STYLE'; id: string; styles: Partial<NexoreMakeElement['styles']> }
  | { type: 'UPDATE_ELEMENT_PROPS'; id: string; payload: Partial<Omit<NexoreMakeElement, 'id' | 'styles' | 'position' | 'size'>> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'DELETE_SELECTED_ELEMENTS' }
  | { type: 'SELECT_ELEMENT'; id: string | null; multi?: boolean }
  | { type: 'SELECT_MULTIPLE'; ids: string[] }
  | { type: 'DUPLICATE_ELEMENT'; id: string }
  | { type: 'DUPLICATE_SELECTED' }
  | { type: 'PASTE_ELEMENTS'; elements: NexoreMakeElement[] }
  | { type: 'ALIGN_SELECTED'; alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' }
  | { type: 'DISTRIBUTE_SELECTED'; axis: 'horizontal' | 'vertical' }
  | { type: 'TOGGLE_ELEMENT_LOCKED'; id: string }
  | { type: 'TOGGLE_ELEMENT_HIDDEN'; id: string }
  | { type: 'RENAME_ELEMENT'; id: string; name: string }
  | { type: 'REORDER_ELEMENT_ZINDEX'; id: string; direction: 'up' | 'down' }
  | { type: 'BRING_TO_FRONT'; id: string }
  | { type: 'SEND_TO_BACK'; id: string }
  | { type: 'UPDATE_CANVAS_SETTINGS'; settings: Partial<CanvasSettings> }
  | { type: 'SWITCH_DEVICE'; device: DeviceType }
  | { type: 'UPDATE_PROJECT_NAME'; name: string }
  | { type: 'LOAD_PROJECT'; elements: NexoreMakeElement[]; canvasSettings?: CanvasSettings; projectName?: string }
  | { type: 'APPLY_AI_ELEMENTS'; elements: NexoreMakeElement[]; canvasSettings?: CanvasSettings }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export const initialCanvasSettings: CanvasSettings = {
  width: 1200,
  height: 800,
  backgroundColor: 'transparent',
  gridVisible: true,
  zoom: 1,
  device: 'desktop',
};

export const initialState: MakerState = {
  elements: [],
  selectedId: null,
  selectedIds: [],
  canvasSettings: initialCanvasSettings,
  projectName: 'My Creative Component',
  history: [[]],
  historyIndex: 0,
};

export function cloneElements(elements: NexoreMakeElement[]): NexoreMakeElement[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(elements);
  }
  return elements.map((el) => ({
    ...el,
    position: { ...el.position },
    size: { ...el.size },
    styles: { ...el.styles },
    items: el.items ? [...el.items] : undefined,
    tags: el.tags ? [...el.tags] : undefined,
    deviceLayouts: el.deviceLayouts
      ? {
          desktop: el.deviceLayouts.desktop
            ? {
                position: { ...el.deviceLayouts.desktop.position },
                size: { ...el.deviceLayouts.desktop.size },
              }
            : undefined,
          tablet: el.deviceLayouts.tablet
            ? {
                position: { ...el.deviceLayouts.tablet.position },
                size: { ...el.deviceLayouts.tablet.size },
              }
            : undefined,
          mobile: el.deviceLayouts.mobile
            ? {
                position: { ...el.deviceLayouts.mobile.position },
                size: { ...el.deviceLayouts.mobile.size },
              }
            : undefined,
        }
      : undefined,
  }));
}

function pushToHistory(
  elements: NexoreMakeElement[],
  history: NexoreMakeElement[][],
  index: number,
  coalesce = false
): { history: NexoreMakeElement[][]; index: number } {
  const snapshot = cloneElements(elements);
  if (coalesce && index > 0 && index < history.length) {
    const updatedHistory = history.slice(0, index + 1);
    updatedHistory[index] = snapshot;
    return { history: updatedHistory, index };
  }
  const newHistory = history.slice(0, index + 1);
  newHistory.push(snapshot);
  if (newHistory.length > 50) {
    newHistory.shift();
    return { history: newHistory, index: newHistory.length - 1 };
  }
  return { history: newHistory, index: newHistory.length - 1 };
}

const GESTURE_COALESCE_MS = 600;

function numVal(val: number | string | undefined, fallback: number): number {
  if (typeof val === 'number') return val;
  if (!val) return fallback;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? fallback : parsed;
}

export function makerReducer(state: MakerState, action: MakerAction): MakerState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const id = 'el_' + Math.random().toString(36).substring(2, 11);
      const maxZIndex = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const newElement: NexoreMakeElement = {
        ...action.element,
        id,
        zIndex: maxZIndex + 1,
      };
      const updatedElements = [...state.elements, newElement];
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: id,
        selectedIds: [id],
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'MOVE_ELEMENT': {
      const now = Date.now();
      const mutationKey = `move:${action.id}`;
      const shouldCoalesce =
        state.lastMutationKey === mutationKey &&
        state.lastMutationTime !== undefined &&
        now - state.lastMutationTime < GESTURE_COALESCE_MS;

      const currentDevice: DeviceType = state.canvasSettings.device || 'desktop';

      const updatedElements = state.elements.map((el) => {
        if (el.id !== action.id || el.locked) return el;
        const currentDevLayouts = el.deviceLayouts || {};
        return {
          ...el,
          position: { x: action.x, y: action.y },
          deviceLayouts: {
            ...currentDevLayouts,
            [currentDevice]: {
              position: { x: action.x, y: action.y },
              size: { ...el.size },
            },
          },
        };
      });

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex, shouldCoalesce);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: mutationKey,
        lastMutationTime: now,
      };
    }

    case 'MOVE_SELECTED_ELEMENTS': {
      const now = Date.now();
      const mutationKey = `move_sel:${state.selectedIds.join(',')}`;
      const shouldCoalesce =
        state.lastMutationKey === mutationKey &&
        state.lastMutationTime !== undefined &&
        now - state.lastMutationTime < GESTURE_COALESCE_MS;

      const currentDevice: DeviceType = state.canvasSettings.device || 'desktop';

      const updatedElements = state.elements.map((el) => {
        if (!state.selectedIds.includes(el.id) || el.locked) return el;
        const nextX = el.position.x + action.deltaX;
        const nextY = el.position.y + action.deltaY;
        const currentDevLayouts = el.deviceLayouts || {};
        return {
          ...el,
          position: { x: nextX, y: nextY },
          deviceLayouts: {
            ...currentDevLayouts,
            [currentDevice]: {
              position: { x: nextX, y: nextY },
              size: { ...el.size },
            },
          },
        };
      });

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex, shouldCoalesce);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: mutationKey,
        lastMutationTime: now,
      };
    }

    case 'RESIZE_ELEMENT': {
      const now = Date.now();
      const mutationKey = `resize:${action.id}`;
      const shouldCoalesce =
        state.lastMutationKey === mutationKey &&
        state.lastMutationTime !== undefined &&
        now - state.lastMutationTime < GESTURE_COALESCE_MS;

      const currentDevice: DeviceType = state.canvasSettings.device || 'desktop';

      const updatedElements = state.elements.map((el) => {
        if (el.id !== action.id || el.locked) return el;
        const currentDevLayouts = el.deviceLayouts || {};
        return {
          ...el,
          size: { width: action.width, height: action.height },
          deviceLayouts: {
            ...currentDevLayouts,
            [currentDevice]: {
              position: { ...el.position },
              size: { width: action.width, height: action.height },
            },
          },
        };
      });

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex, shouldCoalesce);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: mutationKey,
        lastMutationTime: now,
      };
    }

    case 'UPDATE_ELEMENT_BOUNDS': {
      const now = Date.now();
      const mutationKey = `bounds:${action.id}`;
      const shouldCoalesce =
        state.lastMutationKey === mutationKey &&
        state.lastMutationTime !== undefined &&
        now - state.lastMutationTime < GESTURE_COALESCE_MS;

      const currentDevice: DeviceType = state.canvasSettings.device || 'desktop';

      const updatedElements = state.elements.map((el) => {
        if (el.id !== action.id || el.locked) return el;
        const currentDevLayouts = el.deviceLayouts || {};
        return {
          ...el,
          position: { x: action.x, y: action.y },
          size: { width: action.width, height: action.height },
          deviceLayouts: {
            ...currentDevLayouts,
            [currentDevice]: {
              position: { x: action.x, y: action.y },
              size: { width: action.width, height: action.height },
            },
          },
        };
      });

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex, shouldCoalesce);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: mutationKey,
        lastMutationTime: now,
      };
    }

    case 'UPDATE_ELEMENT_STYLE': {
      const now = Date.now();
      const styleKeys = Object.keys(action.styles).sort().join(',');
      const mutationKey = `style:${action.id}:${styleKeys}`;
      const shouldCoalesce =
        state.lastMutationKey === mutationKey &&
        state.lastMutationTime !== undefined &&
        now - state.lastMutationTime < GESTURE_COALESCE_MS;

      const updatedElements = state.elements.map((el) =>
        el.id === action.id
          ? { ...el, styles: { ...el.styles, ...action.styles } }
          : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex, shouldCoalesce);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: mutationKey,
        lastMutationTime: now,
      };
    }

    case 'UPDATE_ELEMENT_PROPS': {
      const now = Date.now();
      const propKeys = Object.keys(action.payload).sort().join(',');
      const mutationKey = `props:${action.id}:${propKeys}`;
      const shouldCoalesce =
        state.lastMutationKey === mutationKey &&
        state.lastMutationTime !== undefined &&
        now - state.lastMutationTime < GESTURE_COALESCE_MS;

      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.payload } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex, shouldCoalesce);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: mutationKey,
        lastMutationTime: now,
      };
    }

    case 'DELETE_ELEMENT': {
      const updatedElements = state.elements.filter((el) => el.id !== action.id);
      const nextSelectedIds = state.selectedIds.filter((id) => id !== action.id);
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: nextSelectedIds[0] || null,
        selectedIds: nextSelectedIds,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'DELETE_SELECTED_ELEMENTS': {
      if (state.selectedIds.length === 0) return state;
      const updatedElements = state.elements.filter((el) => !state.selectedIds.includes(el.id));
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: null,
        selectedIds: [],
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'SELECT_ELEMENT': {
      if (action.id === null) {
        return {
          ...state,
          selectedId: null,
          selectedIds: [],
          lastMutationKey: undefined,
          lastMutationTime: undefined,
        };
      }

      if (action.multi) {
        const alreadySelected = state.selectedIds.includes(action.id);
        const nextSelected = alreadySelected
          ? state.selectedIds.filter((id) => id !== action.id)
          : [...state.selectedIds, action.id];
        return {
          ...state,
          selectedId: nextSelected[nextSelected.length - 1] || null,
          selectedIds: nextSelected,
          lastMutationKey: undefined,
          lastMutationTime: undefined,
        };
      }

      return {
        ...state,
        selectedId: action.id,
        selectedIds: [action.id],
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'SELECT_MULTIPLE': {
      return {
        ...state,
        selectedId: action.ids[0] || null,
        selectedIds: action.ids,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'DUPLICATE_ELEMENT': {
      const target = state.elements.find((el) => el.id === action.id);
      if (!target) return state;

      const id = 'el_' + Math.random().toString(36).substring(2, 11);
      const maxZIndex = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const [duplicate] = cloneElements([target]);
      duplicate.id = id;
      duplicate.zIndex = maxZIndex + 1;
      duplicate.position.x += 16;
      duplicate.position.y += 16;

      const updatedElements = [...state.elements, duplicate];
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: id,
        selectedIds: [id],
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'DUPLICATE_SELECTED': {
      if (state.selectedIds.length === 0) return state;
      const targets = state.elements.filter((el) => state.selectedIds.includes(el.id));
      if (targets.length === 0) return state;

      let currentMaxZ = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const newIds: string[] = [];
      const newDuplicates = targets.map((target) => {
        const newId = 'el_' + Math.random().toString(36).substring(2, 11);
        newIds.push(newId);
        currentMaxZ += 1;
        const [dup] = cloneElements([target]);
        dup.id = newId;
        dup.zIndex = currentMaxZ;
        dup.position.x += 16;
        dup.position.y += 16;
        return dup;
      });

      const updatedElements = [...state.elements, ...newDuplicates];
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: newIds[0] || null,
        selectedIds: newIds,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'PASTE_ELEMENTS': {
      if (!action.elements || action.elements.length === 0) return state;
      let currentMaxZ = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const newIds: string[] = [];
      const pasted = action.elements.map((el) => {
        const newId = 'el_' + Math.random().toString(36).substring(2, 11);
        newIds.push(newId);
        currentMaxZ += 1;
        const [copy] = cloneElements([el]);
        copy.id = newId;
        copy.zIndex = currentMaxZ;
        copy.position.x += 16;
        copy.position.y += 16;
        return copy;
      });

      const updatedElements = [...state.elements, ...pasted];
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: newIds[0] || null,
        selectedIds: newIds,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'ALIGN_SELECTED': {
      const selected = state.elements.filter((el) => state.selectedIds.includes(el.id));
      if (selected.length < 2) return state;

      const minX = Math.min(...selected.map((el) => el.position.x));
      const maxX = Math.max(...selected.map((el) => el.position.x + numVal(el.size.width, 100)));
      const minY = Math.min(...selected.map((el) => el.position.y));
      const maxY = Math.max(...selected.map((el) => el.position.y + numVal(el.size.height, 40)));
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      const updatedElements = state.elements.map((el) => {
        if (!state.selectedIds.includes(el.id) || el.locked) return el;
        const w = numVal(el.size.width, 100);
        const h = numVal(el.size.height, 40);
        let nextX = el.position.x;
        let nextY = el.position.y;

        switch (action.alignment) {
          case 'left':
            nextX = minX;
            break;
          case 'center':
            nextX = Math.round(midX - w / 2);
            break;
          case 'right':
            nextX = Math.round(maxX - w);
            break;
          case 'top':
            nextY = minY;
            break;
          case 'middle':
            nextY = Math.round(midY - h / 2);
            break;
          case 'bottom':
            nextY = Math.round(maxY - h);
            break;
        }

        return {
          ...el,
          position: { x: nextX, y: nextY },
        };
      });

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'DISTRIBUTE_SELECTED': {
      const selected = state.elements.filter((el) => state.selectedIds.includes(el.id));
      if (selected.length < 3) return state;

      let updatedElements = [...state.elements];

      if (action.axis === 'horizontal') {
        const sorted = [...selected].sort((a, b) => a.position.x - b.position.x);
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const span = last.position.x - first.position.x;
        const step = span / (sorted.length - 1);

        const posMap = new Map<string, number>();
        sorted.forEach((el, i) => {
          posMap.set(el.id, Math.round(first.position.x + i * step));
        });

        updatedElements = updatedElements.map((el) => {
          if (posMap.has(el.id) && !el.locked) {
            return {
              ...el,
              position: { ...el.position, x: posMap.get(el.id)! },
            };
          }
          return el;
        });
      } else {
        const sorted = [...selected].sort((a, b) => a.position.y - b.position.y);
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const span = last.position.y - first.position.y;
        const step = span / (sorted.length - 1);

        const posMap = new Map<string, number>();
        sorted.forEach((el, i) => {
          posMap.set(el.id, Math.round(first.position.y + i * step));
        });

        updatedElements = updatedElements.map((el) => {
          if (posMap.has(el.id) && !el.locked) {
            return {
              ...el,
              position: { ...el.position, y: posMap.get(el.id)! },
            };
          }
          return el;
        });
      }

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'TOGGLE_ELEMENT_LOCKED': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, locked: !el.locked } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'TOGGLE_ELEMENT_HIDDEN': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, hidden: !el.hidden } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'RENAME_ELEMENT': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, name: action.name } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'REORDER_ELEMENT_ZINDEX': {
      const target = state.elements.find((el) => el.id === action.id);
      if (!target) return state;

      const sorted = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sorted.findIndex((el) => el.id === action.id);
      if (currentIndex === -1) return state;

      const swapIndex = action.direction === 'up' ? currentIndex + 1 : currentIndex - 1;
      if (swapIndex < 0 || swapIndex >= sorted.length) return state;

      const other = sorted[swapIndex];
      const targetZ = target.zIndex;
      const otherZ = other.zIndex;

      const updatedElements = state.elements.map((el) => {
        if (el.id === target.id) return { ...el, zIndex: otherZ };
        if (el.id === other.id) return { ...el, zIndex: targetZ };
        return el;
      });

      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'BRING_TO_FRONT': {
      const maxZIndex = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, zIndex: maxZIndex + 1 } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'SEND_TO_BACK': {
      const minZIndex = state.elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, zIndex: minZIndex - 1 } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'UPDATE_CANVAS_SETTINGS': {
      return {
        ...state,
        canvasSettings: { ...state.canvasSettings, ...action.settings },
      };
    }

    case 'SWITCH_DEVICE': {
      const targetDevice = action.device;
      if (state.canvasSettings.device === targetDevice) {
        return state;
      }

      let width = 1200;
      let height = 800;
      if (targetDevice === 'tablet') {
        width = 768;
        height = 960;
      } else if (targetDevice === 'mobile') {
        width = 390;
        height = 844;
      }

      const updatedElements = state.elements.map((el) => {
        const layout = el.deviceLayouts?.[targetDevice];
        if (layout) {
          return {
            ...el,
            position: { ...layout.position },
            size: { ...layout.size },
          };
        }
        return el;
      });

      const updatedHistory = state.history.map((snapshot) =>
        snapshot.map((el) => {
          const layout = el.deviceLayouts?.[targetDevice];
          if (layout) {
            return {
              ...el,
              position: { ...layout.position },
              size: { ...layout.size },
            };
          }
          return el;
        })
      );

      return {
        ...state,
        elements: updatedElements,
        canvasSettings: {
          ...state.canvasSettings,
          width,
          height,
          device: targetDevice,
        },
        history: updatedHistory,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'UPDATE_PROJECT_NAME': {
      return {
        ...state,
        projectName: action.name,
      };
    }

    case 'LOAD_PROJECT': {
      const updatedElements = cloneElements(action.elements);
      return {
        ...state,
        elements: updatedElements,
        selectedId: null,
        selectedIds: [],
        canvasSettings: action.canvasSettings ? { ...state.canvasSettings, ...action.canvasSettings } : state.canvasSettings,
        projectName: action.projectName || state.projectName,
        history: [cloneElements(updatedElements)],
        historyIndex: 0,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'APPLY_AI_ELEMENTS': {
      const updatedElements = cloneElements(action.elements);
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        canvasSettings: action.canvasSettings ? { ...state.canvasSettings, ...action.canvasSettings } : state.canvasSettings,
        history,
        historyIndex: index,
        lastMutationKey: undefined,
        lastMutationTime: undefined,
      };
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const nextIndex = state.historyIndex - 1;
        const targetElements = cloneElements(state.history[nextIndex]);
        const validSelectedIds = state.selectedIds.filter((id) =>
          targetElements.some((el) => el.id === id)
        );
        return {
          ...state,
          elements: targetElements,
          selectedId: validSelectedIds[0] || null,
          selectedIds: validSelectedIds,
          historyIndex: nextIndex,
          lastMutationKey: undefined,
          lastMutationTime: undefined,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextIndex = state.historyIndex + 1;
        const targetElements = cloneElements(state.history[nextIndex]);
        const validSelectedIds = state.selectedIds.filter((id) =>
          targetElements.some((el) => el.id === id)
        );
        return {
          ...state,
          elements: targetElements,
          selectedId: validSelectedIds[0] || null,
          selectedIds: validSelectedIds,
          historyIndex: nextIndex,
          lastMutationKey: undefined,
          lastMutationTime: undefined,
        };
      }
      return state;
    }

    default:
      return state;
  }
}
