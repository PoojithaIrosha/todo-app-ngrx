import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Todo} from '../todos.models';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {

  @Input() todo!: Todo;

  @Output() toggle = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();
  @Output() updateTitle = new EventEmitter<{ id: string; title: string }>();

  editing = false;
  draftTitle = '';

  startEdit() {
    this.editing = true;
    this.draftTitle = this.todo.title;
  }

  cancelEdit() {
    this.editing = false;
  }

  commitEdit() {
    const trimmed = this.draftTitle.trim();
    if (trimmed && trimmed !== this.todo.title) {
      this.updateTitle.emit({ id: this.todo.id, title: trimmed });
    }
    this.editing = false;
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
