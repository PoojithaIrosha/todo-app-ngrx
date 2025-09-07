import { Action, ActionReducer, INIT, UPDATE } from '@ngrx/store';
import {TodoState} from '../../features/todo/todos.reducer';

export interface AppState {
  todos: TodoState;
}

const STORAGE_KEY = 'todo-ngrx-state';
const STATE_VERSION = 1;

function loadState(): Partial<AppState> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== STATE_VERSION) return;
    return parsed.state as Partial<AppState>;
  } catch {
    return;
  }
}

function saveState(state: AppState) {
  try {
    const payload = { version: STATE_VERSION, state: { todos: state.todos } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
  }
}

export function storageSyncMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state: AppState | undefined, action: Action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const hydrated = loadState();
      const next = reducer({ ...(state as any), ...(hydrated as any) }, action);
      saveState(next);
      return next;
    }

    const nextState = reducer(state, action);
    if (nextState) saveState(nextState);
    return nextState;
  };
}
