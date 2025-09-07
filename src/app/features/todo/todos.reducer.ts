import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Filter, Todo} from './todos.models';
import {createFeature, createReducer, createSelector, on} from '@ngrx/store';
import {TodosActions} from './todos.actions';

export const todosFeatureKey = 'todos';

export interface TodoState extends EntityState<Todo> {
  filter: Filter;
}

const adapter = createEntityAdapter<Todo>({
  selectId: (t) => t.id,
  sortComparer: (a, b) => b.createdAt - b.createdAt,
});

const initialState: TodoState = adapter.getInitialState({
  filter: 'all'
});

const baseReducer = createReducer(
  initialState,
  on(TodosActions.add, (state, {todo}) => adapter.addOne(todo, state)),
  on(TodosActions.toggle, (state, {id}) => {
    const entity = state.entities[id];
    if (!entity) return state;

    return adapter.updateOne({id, changes: {completed: !entity.completed, updatedAt: Date.now()}}, state);
  }),
  on(TodosActions.updateTitle, (state, {id, title}) => {
    const entity = state.entities[id];
    if (!entity) return state;
    return adapter.updateOne({id, changes: {title: title, updatedAt: Date.now()}}, state);
  }),
  on(TodosActions.remove, (state, {id}) => adapter.removeOne(id, state)),
  on(TodosActions.clearCompleted, (state) => {
    const completedIds = Object.values(state.entities)
      .filter((t): t is Todo => !!t && t.completed)
      .map((t) => t.id);
    return adapter.removeMany(completedIds, state);
  }),
  on(TodosActions.changeFilter, (state, {filter}) => ({...state, filter}))
)


export const todosFeature = createFeature({
  name: todosFeatureKey,
  reducer: baseReducer,
  extraSelectors: ({selectTodosState}) => {
    const adapterSelectors = adapter.getSelectors();
    const selectAllTodos = createSelector(selectTodosState, adapterSelectors.selectAll)
    const selectFilter = createSelector(selectTodosState, (s) => s.filter);
    const selectActiveCount = createSelector(
      selectAllTodos,
      (todos) => todos.filter((t) => !t.completed).length
    );
    const selectCompletedCount = createSelector(
      selectAllTodos,
      (todos) => todos.filter((t) => t.completed).length
    );
    const selectFilteredTodos = createSelector(
      selectAllTodos,
      selectFilter,
      (todos, filter) => {
        switch (filter) {
          case 'active':
            return todos.filter((t) => !t.completed);
          case 'completed':
            return todos.filter((t) => t.completed);
          default:
            return todos;
        }
      }
    );

    return {
      selectAllTodos,
      selectFilter,
      selectActiveCount,
      selectCompletedCount,
      selectFilteredTodos,
    };

  }
})

export const {
  name: todosFeatureName,
  reducer: todosReducer,
  selectTodosState,
  selectAllTodos,
  selectFilter,
  selectActiveCount,
  selectCompletedCount,
  selectFilteredTodos,
} = todosFeature;
