import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Todo} from '../todos.models';
import {TodosActions} from '../todos.actions';
import {Store} from '@ngrx/store';
import {selectActiveCount, selectCompletedCount, selectFilter, selectFilteredTodos} from '../todos.reducer';
import {TodoItemComponent} from '../todo-item/todo-item.component';
import {FilterBarComponent} from '../filter-bar/filter-bar.component';

@Component({
  selector: 'app-todos-page',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TodoItemComponent, FilterBarComponent
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css'
})
export class TodosPageComponent {

  title = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  store = inject(Store);

  todos$ = this.store.select(selectFilteredTodos);
  filter$ = this.store.select(selectFilter);
  activeCount$ = this.store.select(selectActiveCount);
  completedCount$ = this.store.select(selectCompletedCount);


  addTodo() {
    const raw = this.title.value.trim();
    if (!raw) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: raw,
      completed: false,
      createdAt: Date.now(),
    };
    this.store.dispatch(TodosActions.add({ todo }));
    this.title.reset('');
  }

  toggle(id: string) {
    this.store.dispatch(TodosActions.toggle({ id }));
  }

  remove(id: string) {
    this.store.dispatch(TodosActions.remove({ id }));
  }

  updateTitle(id: string, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    this.store.dispatch(TodosActions.updateTitle({ id, title: trimmed }));
  }

  changeFilter(filter: 'all' | 'active' | 'completed') {
    this.store.dispatch(TodosActions.changeFilter({ filter }));
  }

  clearCompleted() {
    this.store.dispatch(TodosActions.clearCompleted());
  }

  trackById(_: number, item: Todo) {
    return item.id;
  }

}
