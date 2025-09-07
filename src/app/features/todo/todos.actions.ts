import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Filter, Todo} from './todos.models';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    'Add': props<{ todo: Todo }>(),
    'Toggle': props<{ id: string }>(),
    'Update Title': props<{ id: string, title: string }>(),
    'Remove': props<{ id: string }>(),
    'Clear Completed': emptyProps(),
    'Change Filter': props<{ filter: Filter }>()
  }
})
