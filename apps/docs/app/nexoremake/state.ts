import { NexoreMakeElement, CanvasSettings } from './types';

export interface MakerState {
  elements: NexoreMakeElement[];
  selectedId: string | null;
  canvasSettings: CanvasSettings;
  projectName: string;
  history: NexoreMakeElement[][];
  historyIndex: number;
}

export type MakerAction =
  | { type: 'ADD_ELEMENT'; element: Omit<NexoreMakeElement, 'id' | 'zIndex'> }
  | { type: 'MOVE_ELEMENT'; id: string; x: number; y: number }
  | { type: 'RESIZE_ELEMENT'; id: string; width: number | string; height: number | string }
  | { type: 'UPDATE_ELEMENT_STYLE'; id: string; styles: Partial<NexoreMakeElement['styles']> }
  | { type: 'UPDATE_ELEMENT_PROPS'; id: string; payload: Partial<Omit<NexoreMakeElement, 'id' | 'styles' | 'position' | 'size'>> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'DUPLICATE_ELEMENT'; id: string }
  | { type: 'BRING_TO_FRONT'; id: string }
  | { type: 'SEND_TO_BACK'; id: string }
  | { type: 'UPDATE_CANVAS_SETTINGS'; settings: Partial<CanvasSettings> }
  | { type: 'UPDATE_PROJECT_NAME'; name: string }
  | { type: 'LOAD_PROJECT'; elements: NexoreMakeElement[]; canvasSettings?: CanvasSettings; projectName?: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export const initialCanvasSettings: CanvasSettings = {
  width: 1200,
  height: 800,
  backgroundColor: 'transparent',
  gridVisible: true,
  zoom: 1,
};

export const initialState: MakerState = {
  elements: [],
  selectedId: null,
  canvasSettings: initialCanvasSettings,
  projectName: 'My Creative Component',
  history: [[]],
  historyIndex: 0,
};

function pushToHistory(elements: NexoreMakeElement[], history: NexoreMakeElement[][], index: number): { history: NexoreMakeElement[][]; index: number } {
  const newHistory = history.slice(0, index + 1);
  newHistory.push(JSON.parse(JSON.stringify(elements)));
  // Limit history length to 50
  if (newHistory.length > 50) {
    newHistory.shift();
    return { history: newHistory, index: newHistory.length - 1 };
  }
  return { history: newHistory, index: newHistory.length - 1 };
}

export function makerReducer(state: MakerState, action: MakerAction): MakerState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const id = 'el_' + Math.random().toString(36).substr(2, 9);
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
        history,
        historyIndex: index,
      };
    }

    case 'MOVE_ELEMENT': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id
          ? { ...el, position: { x: Math.round(action.x), y: Math.round(action.y) } }
          : el
      );
      // For performance in drag, we might not push on every drag pixel, but we push on dragEnd.
      // So we will trigger this move action.
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'RESIZE_ELEMENT': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, size: { width: action.width, height: action.height } } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'UPDATE_ELEMENT_STYLE': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id
          ? { ...el, styles: { ...el.styles, ...action.styles } }
          : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'UPDATE_ELEMENT_PROPS': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.payload } : el
      );
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        history,
        historyIndex: index,
      };
    }

    case 'DELETE_ELEMENT': {
      const updatedElements = state.elements.filter((el) => el.id !== action.id);
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        history,
        historyIndex: index,
      };
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedId: action.id,
      };
    }

    case 'DUPLICATE_ELEMENT': {
      const target = state.elements.find((el) => el.id === action.id);
      if (!target) return state;

      const id = 'el_' + Math.random().toString(36).substr(2, 9);
      const maxZIndex = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const duplicate: NexoreMakeElement = JSON.parse(JSON.stringify(target));
      duplicate.id = id;
      duplicate.zIndex = maxZIndex + 1;
      duplicate.position.x += 20;
      duplicate.position.y += 20;

      const updatedElements = [...state.elements, duplicate];
      const { history, index } = pushToHistory(updatedElements, state.history, state.historyIndex);
      return {
        ...state,
        elements: updatedElements,
        selectedId: id,
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
      };
    }

    case 'UPDATE_CANVAS_SETTINGS': {
      return {
        ...state,
        canvasSettings: {
          ...state.canvasSettings,
          ...action.settings,
        },
      };
    }

    case 'UPDATE_PROJECT_NAME': {
      return {
        ...state,
        projectName: action.name,
      };
    }

    case 'LOAD_PROJECT': {
      const updatedElements = JSON.parse(JSON.stringify(action.elements));
      const { history, index } = pushToHistory(updatedElements, [updatedElements], 0);
      return {
        ...state,
        elements: updatedElements,
        selectedId: null,
        canvasSettings: action.canvasSettings ? { ...state.canvasSettings, ...action.canvasSettings } : state.canvasSettings,
        projectName: action.projectName || state.projectName,
        history,
        historyIndex: index,
      };
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const nextIndex = state.historyIndex - 1;
        return {
          ...state,
          elements: JSON.parse(JSON.stringify(state.history[nextIndex])),
          historyIndex: nextIndex,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextIndex = state.historyIndex + 1;
        return {
          ...state,
          elements: JSON.parse(JSON.stringify(state.history[nextIndex])),
          historyIndex: nextIndex,
        };
      }
      return state;
    }

    default:
      return state;
  }
}
